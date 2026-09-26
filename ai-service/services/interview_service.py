"""
Interview Service

Responsibilities:
- Generates targeted interview questions grounded in candidate resume details and target role.
- Prevents question repetition using previous questions history.
"""

from .llm_service import complete_json
from prompts.prompts import QUESTION_PROMPT

async def generate_question(payload: dict):
    result = await complete_json(QUESTION_PROMPT, payload)
    previous = {question.strip().casefold() for question in payload.get("previousQuestions", [])}
    if result and result.get("question", "").strip().casefold() not in previous:
        return result
    skills = payload.get("resume", {}).get("skills", [])
    projects = payload.get("resume", {}).get("projects", [])
    project = projects[(payload.get("questionNumber", 1) - 1) % len(projects)] if projects else None
    topic = skills[(payload.get("questionNumber", 1) - 1) % len(skills)] if skills else payload["targetRole"]
    project_name = project.get("name", "the project") if isinstance(project, dict) else "the project"
    fallback = f"For {project_name}, explain how you used {topic}, one trade-off you made, and the measurable outcome."
    if fallback.casefold() in previous:
        fallback = f"What problem did {topic} solve in your resume experience, and how would you improve that implementation today?"
    return {"question": fallback, "type": "resume_project", "topic": topic, "difficulty": payload.get("difficulty", "medium"), "expectedConcepts": ["implementation", "trade-offs", "outcome"]}
