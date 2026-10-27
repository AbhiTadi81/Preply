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
    interview_type = payload.get("interviewType", "Technical Interview")
    role = payload.get("targetRole", "the target role")
    difficulty = payload.get("difficulty", "medium")
    if interview_type == "Coding Interview":
        fallback = f"As a {role} candidate, implement a realistic {difficulty}-level {topic} problem inspired by {project_name}. Explain the algorithm, edge cases, time complexity, and space complexity."
    elif interview_type == "System Design Interview":
        fallback = f"As a {role} candidate, design a {difficulty}-level scalable {topic} component for {project_name}. Cover requirements, APIs, data storage, reliability, scaling, security, and trade-offs."
    elif interview_type == "HR & Behavioral Interview":
        fallback = f"Tell me about a challenge you faced while working on {project_name} as a {role}, how you handled it, and what you learned."
    elif interview_type == "Project-Based Interview":
        fallback = f"Walk me through your role in {project_name}: what you implemented with {topic}, the hardest decision or obstacle, the outcome, and what you would improve."
    else:
        fallback = f"For the {role} role, explain how you used {topic} in {project_name}, including the technical decision, trade-off, testing or debugging approach, and measurable outcome."
    if fallback.casefold() in previous:
        fallback = f"What problem did {topic} solve in your resume experience, and how would you improve that implementation today?"
    return {"question": fallback, "type": interview_type, "topic": topic, "difficulty": difficulty, "expectedConcepts": ["role relevance", "interview type", "evidence from resume"]}
