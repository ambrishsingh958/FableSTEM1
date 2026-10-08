import os
import json
import time
import logging
from collections import defaultdict
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from prompts import SYSTEM_INSTRUCTION, story_prompt, quiz_prompt, eval_prompt, character_chat_prompt, compare_prompt
from safety import check_topic_safety
from fallback_data import generate_fallback_story, generate_fallback_quiz, evaluate_fallback_answers

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("story_teacher")

load_dotenv()

# Gemini Client setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
MODEL_NAME = "gemini-2.5-flash"

client = None
if GEMINI_API_KEY:
    try:
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        logger.info("✅ Google GenAI client initialized successfully with API key.")
    except Exception as e:
        logger.warning(f"⚠️ Failed to initialize GenAI client: {e}. Will use intelligent fallback.")
else:
    logger.info("ℹ️ GEMINI_API_KEY not set. Backend will use high-fidelity intelligent fallback engine.")

app = FastAPI(
    title="FableSTEM API",
    description="Backend API for AI Storytelling, STEM Discovery, and Comprehension Evaluation",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory rate limiting: 15 requests per minute per IP
ip_request_timestamps = defaultdict(list)
RATE_LIMIT_MAX = 20
RATE_LIMIT_WINDOW = 60  # seconds

def enforce_rate_limit(client_ip: str):
    now = time.time()
    timestamps = ip_request_timestamps[client_ip]
    # Prune timestamps older than window
    ip_request_timestamps[client_ip] = [ts for ts in timestamps if now - ts < RATE_LIMIT_WINDOW]
    if len(ip_request_timestamps[client_ip]) >= RATE_LIMIT_MAX:
        raise HTTPException(
            status_code=429,
            detail="You're asking questions very fast! 🌟 Please wait a moment before creating your next story."
        )
    ip_request_timestamps[client_ip].append(now)

def call_gemini_json(prompt: str, temperature: float = 0.7) -> dict:
    """Calls Gemini API with structured JSON output, with 1 automatic retry."""
    if not client:
        return None

    from google.genai import types
    for attempt in range(2):
        try:
            logger.info(f"Invoking Gemini model '{MODEL_NAME}' (attempt {attempt + 1})...")
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    temperature=temperature,
                    response_mime_type="application/json"
                )
            )
            raw_text = response.text.strip()
            # Clean possible markdown wrapping if returned
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()

            parsed = json.loads(raw_text)
            return parsed
        except Exception as err:
            logger.warning(f"Gemini call attempt {attempt + 1} encountered: {err}")
            if attempt == 0:
                time.sleep(0.5)
                continue
    return None

# Request Schemas
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

# Endpoints
@app.get("/health")
def health_check():
    return {
        "ok": True,
        "service": "FableSTEM Backend",
        "gemini_configured": bool(client and GEMINI_API_KEY),
        "model": MODEL_NAME if client else "smart-fallback-engine"
    }

@app.post("/api/story")
async def generate_story(req: StoryRequest, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    enforce_rate_limit(client_ip)

    # 1. Safety verification
    is_safe, safety_msg = check_topic_safety(req.topic)
    if not is_safe:
        raise HTTPException(status_code=400, detail=safety_msg)

    # 2. Try Gemini API
    prompt = story_prompt(req.topic, req.age_group, req.language, req.length)
    ai_data = call_gemini_json(prompt, temperature=0.85)

    if ai_data and "story" in ai_data and "title" in ai_data:
        # Guarantee fallback fields exist
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
    ai_data = call_gemini_json(prompt, temperature=0.35)

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
    ai_data = call_gemini_json(prompt, temperature=0.2)

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

class ChatCharacterReq(BaseModel):
    story: str
    character_name: str = "Pip"
    question: str = Field(..., max_length=200)
    age_group: str = "8-10"
    language: str = "English"

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
    ai_data = call_gemini_json(prompt, temperature=0.7)
    if ai_data and "reply" in ai_data:
        return ai_data

    # Intelligent fallback reply
    name = req.character_name or "Pip"
    return {
        "reply": f"Hi there! As {name}, I loved going on this journey! Remember that nature works together in cycles. What do you find most magical about our story? ✨",
        "mood": "happy"
    }

class CompareAgesReq(BaseModel):
    topic: str = Field(..., max_length=100)
    language: str = "English"

@app.post("/api/compare-ages")
async def compare_ages(req: CompareAgesReq, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    enforce_rate_limit(client_ip)

    is_safe, safety_msg = check_topic_safety(req.topic)
    if not is_safe:
        raise HTTPException(status_code=400, detail=safety_msg)

    prompt = compare_prompt(req.topic, req.language)
    ai_data = call_gemini_json(prompt, temperature=0.7)
    if ai_data and "young" in ai_data and "older" in ai_data:
        return ai_data

    # Fallback comparison data
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

class AuthRequest(BaseModel):
    username: str
    password: str = ""
    role: str = "student"
    avatar: str = "🦉"
    grade_or_class: str = ""

@app.post("/api/auth/login")
def auth_login(req: AuthRequest):
    name = req.username.strip() or ("Curious Learner" if req.role == "student" else "Teacher Davis")
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
def auth_register(req: AuthRequest):
    return auth_login(req)


