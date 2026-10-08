import re

# Restricted patterns for kid safety
UNSAFE_KEYWORDS = [
    r"\bkill\b", r"\bmurder\b", r"\bblood\b", r"\bweapon\b", r"\bgun\b", r"\bbomb\b",
    r"\bknife\b", r"\battack\b", r"\bdeath\b", r"\bdie\b", r"\bhate\b", r"\bracis\w*",
    r"\bterror\w*", r"\bexplos\w*", r"\bdrug\w*", r"\balcohol\b", r"\bporn\w*",
    r"\bsex\w*", r"\bnude\b", r"\bnaked\b", r"\bsuicide\b", r"\bhurt\b", r"\bpoison\b",
    r"\bcigarette\b", r"\btobacco\b", r"\bvape\b", r"\bwarfare\b"
]

UNSAFE_PATTERN = re.compile("|".join(UNSAFE_KEYWORDS), re.IGNORECASE)

FRIENDLY_REFUSAL = (
    "Let’s choose a safer learning topic! 🌱 "
    "Try exploring science, nature, history, kindness, or space—such as 'The Water Cycle', "
    "'How Birds Fly', 'Photosynthesis', or 'Why Honesty Matters'!"
)

def check_topic_safety(topic: str) -> tuple[bool, str]:
    """Returns (is_safe, message). True if safe, False with polite refusal if unsafe."""
    topic_clean = topic.strip()
    if not topic_clean:
        return False, "Please enter a topic you would like to learn about!"
    
    if len(topic_clean) > 100:
        return False, "Please keep your topic short and focused (under 100 characters)."

    if UNSAFE_PATTERN.search(topic_clean):
        return False, FRIENDLY_REFUSAL

    return True, ""
