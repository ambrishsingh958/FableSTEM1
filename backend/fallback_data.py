"""
Intelligent fallback story, quiz, and evaluation engine for offline demo or quota limits.
Provides accurate, age-tailored stories with vocabulary, quizzes, and automated evaluation.
"""

FALLBACK_STORIES = {
    "water cycle": {
        "5-7": {
            "title": "Pip the Little Raindrop's Big Sky Adventure",
            "reading_level": "Early Reader (Grade 1)",
            "moral": "Water moves in a wonderful circle that gives life to all plants and animals!",
            "emoji_scenes": ["💧", "☀️", "☁️", "🌧️", "🌱"],
            "vocabulary": [
                {"word": "Raindrop", "meaning": "A tiny round drop of fresh water falling from the sky."},
                {"word": "Vapor", "meaning": "Tiny water bits that float up like invisible warm breath."},
                {"word": "Cloud", "meaning": "A fluffy floating blanket made of millions of tiny water drops."}
            ],
            "story": (
                "Once upon a time, there was a cheerful little water drop named Pip. "
                "Pip rested happily in a blue pond, waving hello to green frogs.\n\n"
                "One sunny morning, the warm golden sun smiled down. 'Time to fly, Pip!' said the sun. "
                "Pip felt warm and light. Whoosh! Pip turned into invisible vapor and floated up into the bright blue sky.\n\n"
                "High up in the cool air, Pip met millions of friendly drop buddies. Together, they joined hands and made a giant, puffy white cloud! "
                "As the cloud grew cool and heavy, the droplets hugged tight. 'Wheee!' cheered Pip. "
                "Pip splashed down gently as cool rain onto a thirsty yellow sunflower.\n\n"
                "The sunflower drank happily, and Pip trickled back to the pond, ready for the magical water cycle adventure to begin again!"
            )
        },
        "8-10": {
            "title": "The Incredible Journey of Splash: The Water Cycle Quest",
            "reading_level": "Elementary Explorer (Grade 3-4)",
            "moral": "Every drop of water on Earth travels through an endless natural recycling adventure.",
            "emoji_scenes": ["🌊", "☀️", "☁️", "⚡", "🏔️"],
            "vocabulary": [
                {"word": "Evaporation", "meaning": "The process where liquid water heats up and transforms into floating water vapor gas."},
                {"word": "Condensation", "meaning": "When warm vapor cools down and gathers into clouds of liquid droplets."},
                {"word": "Precipitation", "meaning": "Water falling back to Earth as rain, snow, sleet, or hail."}
            ],
            "story": (
                "Deep in the rolling blue ocean, Splash the water droplet loved riding giant waves with sea turtles. "
                "But Splash knew that every drop had a secret scientific destiny called the Water Cycle.\n\n"
                "On a blazing summer afternoon, thermal energy from the sun warmed the ocean surface. "
                "Splash absorbed the heat energy and underwent evaporation—changing from liquid water into light, buoyant water vapor. "
                "Splash soared thousands of feet into the troposphere.\n\n"
                "As altitude increased, the air temperature plummeted. Splash cooled rapidly. "
                "Through condensation, Splash gathered onto a speck of dust, turning back into a microscopic droplet and joining a dense cumulus cloud.\n\n"
                "Inside the cloud, droplets bumped together and grew heavier. Gravity took over! "
                "Splash experienced precipitation, showering down onto a snowy mountain ridge. "
                "Splash melted, flowed down an icy stream into a crystal-clear river, and journeyed all the way back to the ocean, proving nature's cycle never ends."
            )
        },
        "11-14": {
            "title": "The Global Thermostat: Aqua's Journey Across Earth's Hydrosphere",
            "reading_level": "Middle School Scholar (Grade 6-8)",
            "moral": "The hydrological cycle is Earth's life support system, regulating planetary climate and nourishing ecosystems.",
            "emoji_scenes": ["🌍", "🔬", "💧", "🌪️", "🌿"],
            "vocabulary": [
                {"word": "Hydrological Cycle", "meaning": "The continuous movement of water on, above, and below Earth's surface powered by solar radiation and gravity."},
                {"word": "Transpiration", "meaning": "The evaporation of moisture from plant leaves into the surrounding atmosphere through microscopic stomata."},
                {"word": "Infiltration", "meaning": "The downward movement of surface water into soil layers and subterranean aquifers."}
            ],
            "story": (
                "In Maya's seventh-grade science lab, a single beaker sat beside a sunny window. "
                "Maya traced the journey of an imaginary molecule of dihydrogen monoxide named Aqua.\n\n"
                "Aqua wasn't ordinary; Aqua was dynamic. Hundreds of years ago, Aqua rested inside an Amazon rainforest fern. "
                "Through transpiration, solar energy coaxed Aqua out through the stomata of green leaves into the humid tropical canopy. "
                "Rising with convective air currents, Aqua cooled adiabatic ally, joining a colossal atmospheric river.\n\n"
                "Over the Pacific, collision-coalescence transformed the cloud particles into heavy rainfall. "
                "Precipitating over a coastal watershed, Aqua seeped deep underground via infiltration, recharging a vital aquifer that quenched farmland below.\n\n"
                "Weeks later, Aqua emerged through an artesian spring, traveled through municipal water channels, and entered Maya's beaker. "
                "As the sun warmed the glass, Aqua began evaporating once more, an everlasting testament to the law of conservation of mass."
            )
        },
        "15+": {
            "title": "Thermodynamics and Equilibrium: The Hydrological Engine of Earth",
            "reading_level": "Young Adult & High School (Grade 9+)",
            "moral": "Earth's water cycle is a massive thermodynamic heat engine governing global energy balance and biospheric survival.",
            "emoji_scenes": ["🌐", "🧪", "🛰️", "🌡️", "🔄"],
            "vocabulary": [
                {"word": "Latent Heat", "meaning": "Thermal energy absorbed or released during a phase change without altering the substance's temperature."},
                {"word": "Adiabatic Cooling", "meaning": "The process of temperature reduction in an air parcel as it expands under lower atmospheric pressure."},
                {"word": "Aquifer Depletion", "meaning": "The unsustainable extraction of subterranean groundwater faster than natural recharge rates."}
            ],
            "story": (
                "Planet Earth operates as a massive closed thermodynamic system, with solar radiation delivering 173 petawatts of continuous energy. "
                "At the core of this planetary equilibrium lies the hydrological cycle.\n\n"
                "Consider a water parcel at equatorial latitudes. As surface sea temperatures crest 28 degrees Celsius, sensible heat transfers into latent heat of vaporization. "
                "Molecules absorb 2.26 megajoules per kilogram, breaking hydrogen bonds and ascending into convective updrafts.\n\n"
                "As the parcel ascends through declining barometric pressures, adiabatic expansion drives cooling. "
                "Upon reaching the dew point, condensation releases that sequestered latent heat, fueling atmospheric circulation and powering jet streams.\n\n"
                "When precipitation returns water to terrestrial surfaces, the hydrological pathways split between surface runoff and deep geological infiltration. "
                "Modern anthropogenic climate shifts—including glacial retreat and altered precipitation regimes—threaten this delicate equilibrium, underscoring our responsibility to conserve Earth's primary thermodynamic regulator."
            )
        }
    }
}

def generate_fallback_story(topic: str, age_group: str, language: str = "English") -> dict:
    key = "water cycle"
    t_lower = topic.lower()
    for k in FALLBACK_STORIES:
        if k in t_lower:
            key = k
            break
            
    group_data = FALLBACK_STORIES.get(key, FALLBACK_STORIES["water cycle"])
    story_data = group_data.get(age_group, group_data.get("8-10"))
    
    # If custom topic, build a dedicated customized educational story
    if key not in t_lower:
        topic_title = topic.strip().title()
        if age_group == "5-7":
            return {
                "title": f"The Wonderful World of {topic_title}",
                "reading_level": "Early Reader (Grade 1)",
                "moral": f"Exploring {topic} helps us understand the magical world around us!",
                "emoji_scenes": ["🌟", "🎒", "🧸", "🎉"],
                "vocabulary": [
                    {"word": "Discover", "meaning": "To see or learn something brand new for the first time."},
                    {"word": "Wonder", "meaning": "A warm, happy feeling of wanting to know how things work."}
                ],
                "story": (
                    f"Once upon a time, two best friends named Leo and Mia wanted to learn all about {topic}.\n\n"
                    f"'What makes {topic} so special?' asked Leo with wide, curious eyes. "
                    f"Mia smiled and pointed out the window. Together, they looked closely and noticed how {topic} brings joy and harmony to nature.\n\n"
                    f"Step by step, they explored how {topic} works in simple, friendly ways. "
                    f"Leo cheered, 'Now I understand {topic}!' They hugged happily and couldn't wait to share the story with their family."
                )
            }
        elif age_group == "11-14":
            return {
                "title": f"The Science and Secret of {topic_title}",
                "reading_level": "Middle School Scholar (Grade 6-8)",
                "moral": f"Curiosity and scientific inquiry unlock the deepest principles of {topic}.",
                "emoji_scenes": ["💡", "🔬", "📚", "✨"],
                "vocabulary": [
                    {"word": "Mechanism", "meaning": "A system of parts working together like a clock to perform a function."},
                    {"word": "Observation", "meaning": "Carefully watching and noting phenomena to form insights."},
                    {"word": "Impact", "meaning": "A noticeable, lasting effect on an environment or system."}
                ],
                "story": (
                    f"During an afternoon science workshop, Alex and Sofia embarked on an investigation into {topic}.\n\n"
                    f"At first glance, {topic} seemed complex. But as Sofia gathered baseline measurements and Alex analyzed key patterns, "
                    f"the underlying cause-and-effect relationship revealed itself clearly.\n\n"
                    f"They discovered that {topic} isn't just an isolated fact—it connects deeply with everyday problems and technological progress. "
                    f"'When you dissect the core principles,' Alex noted, 'you realize how essential {topic} is to everyday life.' "
                    f"Their presentation earned top honors, proving that persistent curiosity turns puzzles into breakthroughs."
                )
            }
        elif age_group == "15+":
            return {
                "title": f"Deconstructing {topic_title}: Principles, Applications, and Impact",
                "reading_level": "Young Adult & High School (Grade 9+)",
                "moral": f"Mastery of {topic} bridges foundational theory with real-world innovation.",
                "emoji_scenes": ["🔍", "🌐", "⚡", "📐"],
                "vocabulary": [
                    {"word": "Principle", "meaning": "A fundamental truth or proposition that serves as the foundation for a system of belief or behavior."},
                    {"word": "Correlation", "meaning": "A mutual relationship or connection between two or more elements."},
                    {"word": "Application", "meaning": "The practical use of theoretical concepts in real-world scenarios."}
                ],
                "story": (
                    f"Modern inquiry into {topic} highlights the intersection of theoretical principles and practical application.\n\n"
                    f"Scholars and practitioners have long studied how {topic} influences broader systems. By examining systemic variables, "
                    f"researchers can identify deterministic patterns that govern how {topic} operates under diverse conditions.\n\n"
                    f"Critical analysis shows that understanding {topic} empowers innovators to engineer robust solutions to contemporary challenges. "
                    f"As science progresses, developing a rigorous conceptual framework around {topic} remains an indispensable intellectual asset."
                )
            }
        else: # 8-10 default
            return {
                "title": f"The Great Quest for {topic_title}",
                "reading_level": "Elementary Explorer (Grade 3-4)",
                "moral": f"Learning about {topic} teaches us how things connect in our world.",
                "emoji_scenes": ["🗺️", "🔎", "🎒", "🏆"],
                "vocabulary": [
                    {"word": "Concept", "meaning": "A big idea that helps explain how things work."},
                    {"word": "Process", "meaning": "A series of actions or steps taken in order to achieve a result."},
                    {"word": "Evidence", "meaning": "Clues or facts that show something is true."}
                ],
                "story": (
                    f"In Mrs. Green's classroom, Sammy was on an exciting mission to solve the mystery of {topic}.\n\n"
                    f"'Where does {topic} come from, and why does it matter?' Sammy asked his science partner Maya. "
                    f"With their notebooks in hand, they observed how {topic} worked step by step in the real world.\n\n"
                    f"Along their adventure, they discovered new facts that surprised them. They learned that {topic} connects many different ideas together. "
                    f"By the end of the day, Sammy smiled proudly. 'Mystery solved! Learning about {topic} was the best adventure ever!'"
                )
            }

    return story_data

def generate_fallback_quiz(story: str, age_group: str) -> dict:
    is_young = age_group == "5-7"
    return {
        "questions": [
            {
                "id": 1,
                "type": "mcq",
                "question": "What is the main subject being explored in the story?",
                "options": [
                    "The natural journey and meaning taught in the story",
                    "A story about building a space rocket",
                    "A recipe for chocolate cake",
                    "How to fix a bicycle wheel"
                ],
                "answer": "The natural journey and meaning taught in the story",
                "explanation": "The story centers entirely around discovering this educational topic."
            },
            {
                "id": 2,
                "type": "mcq",
                "question": "What happened when the main character began their adventure?",
                "options": [
                    "They noticed key steps and learned how the process works",
                    "They immediately fell asleep",
                    "They gave up and went home",
                    "They forgot what they were doing"
                ],
                "answer": "They noticed key steps and learned how the process works",
                "explanation": "As the story describes, observing the process step-by-step revealed how it works."
            },
            {
                "id": 3,
                "type": "mcq",
                "question": "How did the adventure end for the characters?",
                "options": [
                    "With a clear moral and happy understanding of the topic",
                    "They lost all their notes",
                    "Nothing made any sense",
                    "They decided never to learn again"
                ],
                "answer": "With a clear moral and happy understanding of the topic",
                "explanation": "The conclusion celebrates successful understanding and ends with a positive takeaway."
            },
            {
                "id": 4,
                "type": "tf",
                "question": "True or False: The concepts in this story help us understand the world around us.",
                "options": ["True", "False"],
                "answer": "True",
                "explanation": "The story emphasizes that this topic connects to our everyday environment and lives."
            },
            {
                "id": 5,
                "type": "short",
                "question": "In your own words, what was the most important lesson or takeaway from the story?",
                "options": [],
                "answer": "Understanding how the process works and how nature or life connects together",
                "explanation": "The moral at the end highlights the importance of learning and observing our world."
            }
        ]
    }

def evaluate_fallback_answers(story: str, questions: list, user_answers: dict) -> dict:
    feedback = []
    total_score = 0.0

    for q in questions:
        qid = str(q.get("id"))
        qtype = q.get("type")
        correct_ans = str(q.get("answer", "")).strip().lower()
        user_ans = str(user_answers.get(qid, "")).strip().lower()

        if qtype in ["mcq", "tf"]:
            is_correct = (user_ans == correct_ans)
            score = 1.0 if is_correct else 0.0
            total_score += score
            if is_correct:
                comment = f"Spot on! 🌟 You remembered that {q.get('answer')}."
            else:
                comment = f"Almost! In the story, the answer is '{q.get('answer')}'. {q.get('explanation', '')}"
            feedback.append({
                "id": q.get("id"),
                "correct": is_correct,
                "score": score,
                "learner_answer": user_answers.get(qid, "No answer"),
                "correct_answer": q.get("answer"),
                "comment": comment
            })
        else: # short answer
            # Check for non-empty thoughtful response
            if len(user_ans) >= 4:
                score = 1.0
                is_correct = True
                comment = "Wonderful insight! 💡 You explained the central idea very thoughtfully in your own words."
            elif len(user_ans) > 0:
                score = 0.5
                is_correct = True
                comment = "Good effort! You're on the right track; try describing a bit more detail next time."
            else:
                score = 0.0
                is_correct = False
                comment = "No answer provided. Remember to re-read the moral at the end of the story!"
            total_score += score
            feedback.append({
                "id": q.get("id"),
                "correct": is_correct,
                "score": score,
                "learner_answer": user_answers.get(qid, "No answer"),
                "correct_answer": q.get("answer"),
                "comment": comment
            })

    total = len(questions) if questions else 5
    percentage = round((total_score / total) * 100)
    
    if percentage >= 80:
        summary = "Outstanding work! 🌟 You demonstrated an exceptional grasp of this story and its lessons!"
        badge = "Master Story Scholar 🏆"
    elif percentage >= 60:
        summary = "Great job! 👏 You understood the main story well. A quick re-read will make you a complete expert!"
        badge = "Curious Explorer 🚀"
    else:
        summary = "Good effort! Reading stories is all about practice. Take another look at the story and try again!"
        badge = "Budding Detective 🔍"

    return {
        "score": total_score,
        "total": total,
        "percentage": percentage,
        "feedback": feedback,
        "summary": summary,
        "badge": badge
    }
