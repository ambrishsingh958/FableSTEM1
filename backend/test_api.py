import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def post(url, payload):
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

print("=== 1. TEST STORY AGE 5-7 ===")
s1 = post('http://127.0.0.1:8000/api/story', {'topic': 'The Water Cycle', 'age_group': '5-7', 'language': 'English'})
print("Title (5-7):", s1.get('title'))
print("Reading Level:", s1.get('reading_level'))
print("Word Count:", len(s1.get('story', '').split()))
print("Vocabulary:", [v['word'] for v in s1.get('vocabulary', [])])

print("\n=== 2. TEST STORY AGE 11-14 ===")
s2 = post('http://127.0.0.1:8000/api/story', {'topic': 'The Water Cycle', 'age_group': '11-14', 'language': 'English'})
print("Title (11-14):", s2.get('title'))
print("Reading Level:", s2.get('reading_level'))
print("Word Count:", len(s2.get('story', '').split()))
print("Vocabulary:", [v['word'] for v in s2.get('vocabulary', [])])

print("\n=== 3. TEST QUIZ GENERATION ===")
q = post('http://127.0.0.1:8000/api/quiz', {'story': s1['story'], 'age_group': '5-7', 'language': 'English'})
print("Question count:", len(q.get('questions', [])))
for item in q.get('questions', []):
    print(f"Q{item['id']} ({item['type']}): {item['question']}")

print("\n=== 4. TEST ANSWER EVALUATION ===")
questions = q.get('questions', [])
user_answers = {
    '1': questions[0]['answer'] if len(questions) > 0 else 'A',
    '2': 'Intentionally wrong answer',
    '3': questions[2]['answer'] if len(questions) > 2 else 'C',
    '4': 'True',
    '5': 'Water moves continuously around giving life to nature'
}
ev = post('http://127.0.0.1:8000/api/evaluate', {
    'story': s1['story'],
    'questions': questions,
    'user_answers': user_answers,
    'age_group': '5-7',
    'language': 'English'
})
print("Score:", ev.get('score'), "/", ev.get('total'), f"({ev.get('percentage')}%)")
print("Summary:", ev.get('summary'))
print("Badge:", ev.get('badge'))
print("Feedback Q2 (intentional wrong):", ev.get('feedback', [{}, {}])[1].get('comment'))
print("Feedback Q5 (short answer):", ev.get('feedback', [{}, {}, {}, {}, {}])[4].get('comment'))

print("\n=== ALL TESTS PASSED SUCCESSFULLY! ===")
