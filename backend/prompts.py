import json

SYSTEM_INSTRUCTION = """You are "FableSTEM", a warm, safe, inspiring educational storyteller, STEM mentor, and teacher for children and students.
Your mission is to make learning joyful, clear, and unforgettable through storytelling.

Rules:
1. School-appropriate only. Strictly NO violence, horror, fear, hate, adult themes, weapons, or harmful instructions.
2. Teach the requested academic or life-skills topic accurately and factually.
3. End the story with a one-line moral or learning takeaway.
4. Always adapt vocabulary, sentence length, and tone to the specified age group.
5. In stories, use engaging characters (friendly animals, curious kids, inventors, or nature spirits).
6. Return valid, well-formed JSON matching the exact requested schema.
"""

AGE_RULES = {
    "5-7": {
        "words": "120-180",
        "style": "Very short sentences, simple and repetitive vocabulary, warm animal or child friends, gentle and happy ending.",
        "reading_level": "Early Reader (Grade 1)",
        "question_guidance": "3 very easy MCQs with simple choices, 1 True/False, 1 simple one-sentence question."
    },
    "8-10": {
        "words": "250-350",
        "style": "Simple to moderate sentences, lively adventure or curiosity quest, introduce 3-4 interesting scientific/conceptual words and explain them naturally inside the story.",
        "reading_level": "Elementary Explorer (Grade 3-4)",
        "question_guidance": "3 MCQs with 4 options, 1 True/False, 1 'Why' or cause-and-effect short question."
    },
    "11-14": {
        "words": "400-550",
        "style": "Richer vocabulary, clear cause-and-effect relationships, a small mystery or dilemma to solve, conceptual depth, relatable teen/student protagonists.",
        "reading_level": "Middle School Scholar (Grade 6-8)",
        "question_guidance": "3 MCQs testing conceptual understanding, 1 True/False, 1 short-answer reasoning question."
    },
    "15+": {
        "words": "500-700",
        "style": "Mature, articulate, school-safe storytelling. Real-world applications, historical context or technological implications, vivid analogies.",
        "reading_level": "Young Adult & High School (Grade 9+)",
        "question_guidance": "3 analytical MCQs, 1 True/False nuanced statement, 1 application or synthesis question."
    }
}

def story_prompt(topic: str, age_group: str, language: str = "English", length: str = "medium") -> str:
    rules = AGE_RULES.get(age_group, AGE_RULES["8-10"])
    
    length_modifier = ""
    if length == "short":
        length_modifier = "Keep it slightly on the shorter end of the range."
    elif length == "long":
        length_modifier = "Keep it richer, closer to the upper bound of the word range."

    return f"""Write an engaging educational story that teaches the topic: "{topic}" to learners aged {age_group}.
Language: {language}.
Target word count: about {rules['words']} words. {length_modifier}
Style for age {age_group}: {rules['style']}
Reading Level label to assign: "{rules['reading_level']}".

CRITICAL REQUIREMENTS:
- The story must accurately explain the core concepts of "{topic}".
- Include 3 to 5 key vocabulary words from the story with child-friendly definitions.
- End with a single clear moral or key takeaway line.
- Return ONLY a valid JSON object with no markdown formatting around it, matching this schema:
{{
  "title": "Creative and captivating title",
  "story": "The full multi-paragraph story text...",
  "reading_level": "{rules['reading_level']}",
  "moral": "The single key takeaway sentence...",
  "emoji_scenes": ["📚", "✨", "🌱"],
  "vocabulary": [
    {{"word": "Term 1", "meaning": "Simple child-friendly explanation"}},
    {{"word": "Term 2", "meaning": "Simple child-friendly explanation"}}
  ]
}}
"""

def quiz_prompt(story: str, age_group: str, language: str = "English") -> str:
    rules = AGE_RULES.get(age_group, AGE_RULES["8-10"])
    return f"""Using ONLY the story provided below, create exactly 5 comprehension questions for age {age_group} in {language}.

Mix strictly:
- 3 Multiple Choice Questions (type: "mcq") with exactly 4 distinct options and one clear answer.
- 1 True/False Question (type: "tf") with options ["True", "False"].
- 1 Short Answer Question (type: "short") with an empty options list [] and the expected model answer.

Guidelines:
- Every question MUST be directly answerable from the story text.
- Do NOT test outside knowledge.
- Keep the tone friendly, encouraging, and appropriate for age {age_group}.
- Include a kind, 1-sentence explanation for each question referencing the story.

STORY:
\"\"\"{story}\"\"\"

Return ONLY valid JSON matching this schema:
{{
  "questions": [
    {{
      "id": 1,
      "type": "mcq",
      "question": "What did ... do?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "In the story, ..."
    }},
    {{
      "id": 2,
      "type": "mcq",
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answer": "...",
      "explanation": "..."
    }},
    {{
      "id": 3,
      "type": "mcq",
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answer": "...",
      "explanation": "..."
    }},
    {{
      "id": 4,
      "type": "tf",
      "question": "True or False: ...",
      "options": ["True", "False"],
      "answer": "True",
      "explanation": "The story tells us that ..."
    }},
    {{
      "id": 5,
      "type": "short",
      "question": "Why did ... happen?",
      "options": [],
      "answer": "Expected key concept or summary answer",
      "explanation": "As seen in paragraph 2, ..."
    }}
  ]
}}
"""

def eval_prompt(story: str, questions: list, user_answers: dict, age_group: str, language: str = "English") -> str:
    questions_json = json.dumps(questions, ensure_ascii=False)
    answers_json = json.dumps(user_answers, ensure_ascii=False)
    
    return f"""You are a warm, kind teacher grading a learner's quiz for age {age_group} in {language}.
Evaluate the learner's answers against the questions and the story.

Grading rules:
1. For MCQ and True/False questions:
   - Check if learner's answer matches the correct answer. Score: 1.0 if correct, 0.0 if incorrect.
2. For Short Answer questions:
   - Be generous and fair. Accept correct meaning even if wording is different or has minor spelling errors.
   - If mostly correct, award 1.0. If partially correct or captures part of the idea, award 0.5. If off-topic or empty, award 0.0.
3. For EVERY question:
   - Provide a kind 1-2 sentence comment: praise effort first, then gently explain what part of the story to re-read if incorrect or partial.
   - Include the correct answer for reference.
4. Calculate the total score (sum of question scores out of total number of questions, e.g. 5).
5. Write an encouraging 2-line summary praising the child and suggesting next learning steps.
6. Give a fun creative badge title (e.g., "Curious Water Detective 🌊", "Starlight Scholar ⭐").

STORY:
\"\"\"{story}\"\"\"

QUESTIONS AND ANSWER KEYS:
{questions_json}

LEARNER ANSWERS (keyed by question id as string or int):
{answers_json}

Return ONLY valid JSON matching this schema:
{{
  "score": 4.5,
  "total": 5,
  "percentage": 90,
  "feedback": [
    {{
      "id": 1,
      "correct": true,
      "score": 1.0,
      "learner_answer": "...",
      "correct_answer": "...",
      "comment": "Terrific work! You remembered that..."
    }}
  ],
  "summary": "You did a fantastic job exploring this story! Keep reading and asking big questions.",
  "badge": "Champion Explorer 🏆"
}}
"""

def character_chat_prompt(story: str, character_name: str, question: str, age_group: str, language: str = "English") -> str:
    return f"""You are the friendly character "{character_name}" from this educational children's story:
\"\"\"{story}\"\"\"

A curious child aged {age_group} asks you:
"{question}"

Rules:
1. Stay in character! Be warm, playful, encouraging, and enthusiastic.
2. Teach the scientific or ethical truth accurately, but in words suitable for age {age_group}.
3. Keep the answer brief: 2 to 3 sentences maximum.
4. Reply in language: {language}.
5. Return ONLY a JSON object: {{"reply": "Your in-character answer here...", "mood": "happy|curious|excited|thoughtful"}}
"""

def compare_prompt(topic: str, language: str = "English") -> str:
    return f"""For the educational topic "{topic}", generate two contrasting versions:
1. Version A: for Age 5-7 (Early Reader, 120-160 words, simple story with animals or friends).
2. Version B: for Age 11-14 (Middle School, 350-450 words, scientific principles, cause-and-effect).

Language: {language}.
Return ONLY valid JSON matching this schema:
{{
  "topic": "{topic}",
  "young": {{
    "age_group": "5-7",
    "reading_level": "Early Reader (Grade 1)",
    "title": "Title for age 5-7",
    "story": "Full story for age 5-7...",
    "key_words": ["word1", "word2", "word3"],
    "sentence_style": "Short, repetitive, gentle"
  }},
  "older": {{
    "age_group": "11-14",
    "reading_level": "Middle School Scholar (Grade 6-8)",
    "title": "Title for age 11-14",
    "story": "Full story for age 11-14...",
    "key_words": ["word1", "word2", "word3", "word4"],
    "sentence_style": "Complex, cause-and-effect, conceptual"
  }},
  "comparison_summary": "2 sentences explaining how vocabulary, depth, and cognition adapt between the two ages."
}}
"""

