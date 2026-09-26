"""
Resume Service

Responsibilities:
- Coordinates with Gemini LLM to parse raw resume text into structured candidate data:
  skills, projects, work experience, education, and certifications.
"""

import re
from .llm_service import complete_json
from prompts.prompts import RESUME_PROMPT

async def parse_resume(text: str):
    result = await complete_json(RESUME_PROMPT, {"resume_text": text})
    if result:
        return result
    skills = sorted(set(re.findall(r"\b(?:Python|JavaScript|React|Node\.js|MongoDB|SQL|AWS|Java|C\+\+)\b", text, re.I)))
    return {"skills": skills, "projects": [], "experience": [], "education": [], "certifications": []}
