import os
import json
import time
import logging
from collections import defaultdict
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from prompts import SYSTEM_INSTRUCTION, story_prompt, quiz_prompt, eval_prompt, character_chat_prompt, compare_prompt
from safety import check_topic_safety
from fallback_data import generate_fallback_story, generate_fallback_quiz, evaluate_fallback_answers
from database import (
    init_db, get_db, is_db_connected, DBUser, DBSavedStory, DBQuizResult
)

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("fablestem_backend")

load_dotenv()

# ==========================================
# Groq & Gemini Client Setup
# ==========================================
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GROQ_MODEL = os.getenv("GROQ_MODEL", "gpt-oss-120b").strip()

groq_client = None
if GROQ_API_KEY:
    try:
        from groq import Groq
        groq_client = Groq(api_key=GROQ_API_KEY)
        logger.info(f"✅ Groq client initialized successfully with model: {GROQ_MODEL}")
    except Exception as e:
        logger.warning(f"⚠️ Failed to initialize Groq client: {e}. Will attempt fallback.")
else:
    logger.info("ℹ️ GROQ_API_KEY not yet configured in .env. Will use intelligent fallback until key is added.")

# Secondary Gemini Client setup (optional fallback)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = "gemini-2.5-flash"
gemini_client = None
if GEMINI_API_KEY:
    try:
        from google import genai
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        logger.info("✅ Google GenAI client initialized as secondary fallback.")
    except Exception as e:
        logger.warning(f"⚠️ Failed to initialize GenAI client: {e}")

app = FastAPI(
    title="FableSTEM API",
    description="Backend API powered by Groq (gpt-oss-120b) and PostgreSQL database",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory rate limiting: 20 requests per minute per IP
ip_request_timestamps = defaultdict(list)
RATE_LIMIT_MAX = 25
RATE_LIMIT_WINDOW = 60  # seconds

def enforce_rate_limit(client_ip: str):
    now = time.time()
    timestamps = ip_request_timestamps[client_ip]
    ip_request_timestamps[client_ip] = [ts for ts in timestamps if now - ts < RATE_LIMIT_WINDOW]
    if len(ip_request_timestamps[client_ip]) >= RATE_LIMIT_MAX:
        raise HTTPException(
            status_code=429,
            detail="You're asking questions very fast! 🌟 Please wait a moment before creating your next story."
        )
    ip_request_timestamps[client_ip].append(now)

def call_llm_json(prompt: str, temperature: float = 0.7) -> Optional[dict]:
    """
    Primary LLM invoker:
    1. First tries Groq with model gpt-oss-120b (fastest inference).
    2. Then tries Gemini if configured.
    3. Returns None to trigger intelligent fallback.
    """
    # 1. Try Groq (gpt-oss-120b)
    if groq_client:
        for attempt in range(2):
            try:
                logger.info(f"Invoking Groq model '{GROQ_MODEL}' (attempt {attempt + 1})...")
                completion = groq_client.chat.completions.create(
                    model=GROQ_MODEL,
                    messages=[
                        {"role": "system", "content": SYSTEM_INSTRUCTION},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=temperature
                )
                raw_text = completion.choices[0].message.content.strip()
                parsed = json.loads(raw_text)
                return parsed
            except Exception as err:
                logger.warning(f"Groq API call attempt {attempt + 1} encountered: {err}")
                if attempt == 0:
                    time.sleep(0.4)
                    continue

    # 2. Try Gemini secondary fallback
    if gemini_client:
        from google.genai import types
        try:
            logger.info(f"Invoking Gemini fallback model '{GEMINI_MODEL}'...")
            response = gemini_client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    temperature=temperature,
                    response_mime_type="application/json"
                )
            )
            raw = response.text.strip()
            if raw.startswith("```json"):
                raw = raw[7:]
            if raw.startswith("```"):
                raw = raw[3:]
            if raw.endswith("```"):
                raw = raw[:-3]
            return json.loads(raw.strip())
        except Exception as gemini_err:
            logger.warning(f"Gemini fallback call encountered: {gemini_err}")

    return None

# ==========================================
# Request Schemas
# ==========================================
class StoryRequest(BaseModel):
    topic: str = Field(..., max_length=100)
    age_group: str = Field(..., pattern=r"^(5-7|8-10|11-14|15\+)$")
    language: str = "English"
    length: str = "medium"

class QuizRequest(BaseModel):
    story: str
    age_group: str = "8-10"
    language: str = "English"

class EvaluateRequest(BaseModel):
    story: str
    questions: list
    user_answers: dict
    age_group: str = "8-10"
    language: str = "English"

class ChatCharacterReq(BaseModel):
    story: str
    character_name: str = "Pip"
    question: str = Field(..., max_length=200)
    age_group: str = "8-10"
    language: str = "English"

class CompareAgesReq(BaseModel):
    topic: str = Field(..., max_length=100)
    language: str = "English"

class AuthRequest(BaseModel):
    username: str
    password: str = ""
    role: str = "student"
    avatar: str = "🦉"
    grade_or_class: str = ""

class SaveStoryRequest(BaseModel):
    username: Optional[str] = None
    topic: str
    age_group: str
    language: str = "English"
    title: str
    story: str
    vocabulary: Optional[List[Dict[str, Any]]] = None

class SaveQuizRequest(BaseModel):
    username: Optional[str] = None
    story_title: str
    topic: str
    age_group: str
    score_percentage: int
    total_questions: int
    correct_count: int
    badge: str

# ==========================================
# Endpoints
# ==========================================
@app.get("/health")
@app.get("/api/health")
def health_check():
    import database
    return {
        "ok": True,
        "service": "FableSTEM Backend",
        "llm_provider": "Groq" if groq_client else "Gemini" if gemini_client else "smart-fallback-engine",
        "groq_model": GROQ_MODEL,
        "groq_configured": bool(groq_client and GROQ_API_KEY),
        "database": "PostgreSQL (Connected)" if database.is_db_connected else "PostgreSQL (Awaiting URL in .env)",
        "database_connected": database.is_db_connected
    }

@app.post("/api/story")
async def generate_story(req: StoryRequest, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    enforce_rate_limit(client_ip)

    # 1. Safety verification
    is_safe, safety_msg = check_topic_safety(req.topic)
    if not is_safe:
        raise HTTPException(status_code=400, detail=safety_msg)

    # 2. Try Groq (gpt-oss-120b)
    prompt = story_prompt(req.topic, req.age_group, req.language, req.length)
    ai_data = call_llm_json(prompt, temperature=0.85)

    if ai_data and "story" in ai_data and "title" in ai_data:
        if "vocabulary" not in ai_data or not isinstance(ai_data["vocabulary"], list):
            ai_data["vocabulary"] = []
        if "emoji_scenes" not in ai_data:
            ai_data["emoji_scenes"] = ["📖", "✨", "🌱"]
        return ai_data

    # 3. Fallback engine
    logger.info("Using smart fallback story generator.")
    return generate_fallback_story(req.topic, req.age_group, req.language)

@app.post("/api/quiz")
async def generate_quiz(req: QuizRequest, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    enforce_rate_limit(client_ip)

    if not req.story.strip():
        raise HTTPException(status_code=400, detail="Story content is required to generate quiz.")

    prompt = quiz_prompt(req.story, req.age_group, req.language)
    ai_data = call_llm_json(prompt, temperature=0.35)

    if ai_data and "questions" in ai_data and len(ai_data["questions"]) > 0:
        return ai_data

    logger.info("Using smart fallback quiz generator.")
    return generate_fallback_quiz(req.story, req.age_group)

@app.post("/api/evaluate")
async def evaluate_answers(req: EvaluateRequest, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    enforce_rate_limit(client_ip)

    if not req.questions:
        raise HTTPException(status_code=400, detail="Questions are required for evaluation.")

    prompt = eval_prompt(req.story, req.questions, req.user_answers, req.age_group, req.language)
    ai_data = call_llm_json(prompt, temperature=0.2)

    if ai_data and "score" in ai_data and "feedback" in ai_data:
        return ai_data

    logger.info("Using smart fallback answer evaluator.")
    return evaluate_fallback_answers(req.story, req.questions, req.user_answers)

@app.get("/api/presets")
def get_presets():
    """Returns instant demo presets for hackathon judges."""
    return [
        {
            "id": "water_cycle_young",
            "topic": "Water Cycle",
            "age_group": "5-7",
            "language": "English",
            "label": "🌧️ Water Cycle (Ages 5-7, Early Reader)",
            "description": "Short sentences, friendly raindrops, gentle discovery"
        },
        {
            "id": "water_cycle_older",
            "topic": "Water Cycle",
            "age_group": "11-14",
            "language": "English",
            "label": "🔬 Water Cycle (Ages 11-14, Middle School)",
            "description": "Transpiration, aquifers, thermodynamics, conceptual depth"
        },
        {
            "id": "photosynthesis_elem",
            "topic": "Photosynthesis",
            "age_group": "8-10",
            "language": "English",
            "label": "🌿 Photosynthesis (Ages 8-10, Elementary)",
            "description": "Sunlight, chlorophyll, plant leaves, adventure quest"
        },
        {
            "id": "honesty_young",
            "topic": "Honesty & Friendship",
            "age_group": "5-7",
            "language": "English",
            "label": "💖 Honesty & Friendship (Ages 5-7)",
            "description": "Moral education, sharing, trust, heartwarming ending"
        },
        {
            "id": "solar_system_teen",
            "topic": "The Solar System",
            "age_group": "11-14",
            "language": "English",
            "label": "🪐 Solar System & Gravitation (Ages 11-14)",
            "description": "Orbits, cosmic scale, planetary composition, space exploration"
        }
    ]

@app.post("/api/chat-character")
async def chat_with_character(req: ChatCharacterReq, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    enforce_rate_limit(client_ip)

    is_safe, safety_msg = check_topic_safety(req.question)
    if not is_safe:
        return {
            "reply": "That's a bit too tricky for me! Let's explore science, space, nature, or our story together! 🌟",
            "mood": "thoughtful"
        }

    prompt = character_chat_prompt(req.story, req.character_name, req.question, req.age_group, req.language)
    ai_data = call_llm_json(prompt, temperature=0.7)
    if ai_data and "reply" in ai_data:
        return ai_data

    name = req.character_name or "Pip"
    return {
        "reply": f"Hi there! As {name}, I loved going on this journey! Remember that nature works together in cycles. What do you find most magical about our story? ✨",
        "mood": "happy"
    }

@app.post("/api/compare-ages")
async def compare_ages(req: CompareAgesReq, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    enforce_rate_limit(client_ip)

    is_safe, safety_msg = check_topic_safety(req.topic)
    if not is_safe:
        raise HTTPException(status_code=400, detail=safety_msg)

    prompt = compare_prompt(req.topic, req.language)
    ai_data = call_llm_json(prompt, temperature=0.7)
    if ai_data and "young" in ai_data and "older" in ai_data:
        return ai_data

    y = generate_fallback_story(req.topic, "5-7", req.language)
    o = generate_fallback_story(req.topic, "11-14", req.language)
    return {
        "topic": req.topic,
        "young": {
            "age_group": "5-7",
            "reading_level": y.get("reading_level", "Early Reader (Grade 1)"),
            "title": y.get("title", ""),
            "story": y.get("story", ""),
            "key_words": [w["word"] for w in y.get("vocabulary", [])],
            "sentence_style": "Short sentences, friendly animals, gentle repetition"
        },
        "older": {
            "age_group": "11-14",
            "reading_level": o.get("reading_level", "Middle School Scholar (Grade 6-8)"),
            "title": o.get("title", ""),
            "story": o.get("story", ""),
            "key_words": [w["word"] for w in o.get("vocabulary", [])],
            "sentence_style": "Scientific vocabulary, cause-and-effect, conceptual systems"
        },
        "comparison_summary": "Notice how the 5-7 version uses personified characters and simple sensory words, while the 11-14 version introduces scientific mechanisms like thermodynamic cycles and conservation of matter."
    }

# ==========================================
# Authentication & PostgreSQL Integration
# ==========================================
@app.post("/api/auth/login")
def auth_login(req: AuthRequest, db=Depends(get_db)):
    name = req.username.strip() or ("Curious Learner" if req.role == "student" else "Teacher Davis")
    
    # If PostgreSQL is connected, save or update user
    if db:
        try:
            existing = db.query(DBUser).filter(DBUser.username == name).first()
            if not existing:
                existing = DBUser(
                    username=name,
                    role=req.role,
                    avatar=req.avatar or ("🦉" if req.role == "student" else "🍎"),
                    grade_or_class=req.grade_or_class or ("Grade 3" if req.role == "student" else "Oakwood Elementary"),
                    xp=250 if req.role == "student" else 600,
                    streak=4
                )
                db.add(existing)
                db.commit()
                db.refresh(existing)
            return {
                "ok": True,
                "token": f"st_token_{existing.id}_{int(time.time())}",
                "user": {
                    "id": existing.id,
                    "name": existing.username,
                    "role": existing.role,
                    "avatar": existing.avatar,
                    "grade_or_class": existing.grade_or_class,
                    "xp": existing.xp,
                    "streak": existing.streak,
                    "badges": ["Story Pioneer 📖", "Water Detective 🌊", "Quiz Champion 🏆"]
                }
            }
        except Exception as e:
            logger.warning(f"Database error in login: {e}")

    # In-memory session fallback
    return {
        "ok": True,
        "token": f"st_token_{int(time.time())}",
        "user": {
            "name": name,
            "role": req.role,
            "avatar": req.avatar or ("🦉" if req.role == "student" else "🍎"),
            "grade_or_class": req.grade_or_class or ("Grade 3" if req.role == "student" else "Oakwood Elementary"),
            "xp": 250 if req.role == "student" else 600,
            "streak": 4,
            "badges": ["Story Pioneer 📖", "Water Detective 🌊", "Quiz Champion 🏆"]
        }
    }

@app.post("/api/auth/register")
def auth_register(req: AuthRequest, db=Depends(get_db)):
    return auth_login(req, db)

# PostgreSQL Database persistence endpoints
@app.post("/api/database/save-story")
def db_save_story(req: SaveStoryRequest, db=Depends(get_db)):
    if not db:
        return {"ok": False, "message": "PostgreSQL not connected. Story saved in local browser storage."}
    try:
        user = None
        if req.username:
            user = db.query(DBUser).filter(DBUser.username == req.username).first()
        story = DBSavedStory(
            user_id=user.id if user else None,
            topic=req.topic,
            age_group=req.age_group,
            language=req.language,
            title=req.title,
            story_text=req.story,
            vocabulary=req.vocabulary or []
        )
        db.add(story)
        db.commit()
        db.refresh(story)
        return {"ok": True, "story_id": story.id}
    except Exception as e:
        logger.warning(f"Error saving story to PostgreSQL: {e}")
        return {"ok": False, "error": str(e)}

@app.get("/api/database/stories")
def db_get_stories(username: Optional[str] = None, db=Depends(get_db)):
    if not db:
        return {"ok": False, "stories": []}
    try:
        query = db.query(DBSavedStory)
        if username:
            user = db.query(DBUser).filter(DBUser.username == username).first()
            if user:
                query = query.filter(DBSavedStory.user_id == user.id)
        stories = query.order_by(DBSavedStory.created_at.desc()).limit(20).all()
        return {
            "ok": True,
            "stories": [
                {
                    "id": s.id,
                    "title": s.title,
                    "topic": s.topic,
                    "age_group": s.age_group,
                    "story": s.story_text,
                    "vocabulary": s.vocabulary,
                    "created_at": s.created_at.isoformat() if s.created_at else None
                } for s in stories
            ]
        }
    except Exception as e:
        logger.warning(f"Error querying stories from PostgreSQL: {e}")
        return {"ok": False, "stories": []}

@app.post("/api/database/save-quiz")
def db_save_quiz(req: SaveQuizRequest, db=Depends(get_db)):
    if not db:
        return {"ok": False, "message": "PostgreSQL not connected."}
    try:
        user = None
        if req.username:
            user = db.query(DBUser).filter(DBUser.username == req.username).first()
        record = DBQuizResult(
            user_id=user.id if user else None,
            story_title=req.story_title,
            topic=req.topic,
            age_group=req.age_group,
            score_percentage=req.score_percentage,
            total_questions=req.total_questions,
            correct_count=req.correct_count,
            badge=req.badge
        )
        db.add(record)
        if user:
            user.xp = (user.xp or 0) + int(req.score_percentage * 0.5)
        db.commit()
        return {"ok": True, "quiz_id": record.id}
    except Exception as e:
        logger.warning(f"Error saving quiz to PostgreSQL: {e}")
        return {"ok": False, "error": str(e)}
