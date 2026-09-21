from .llm_service import complete_json
from prompts.prompts import REPORT_PROMPT

async def generate_report(payload: dict):
    result = await complete_json(REPORT_PROMPT, payload)
    if result:
        result.setdefault("overallScore", 0)
        result.setdefault("technicalScore", result.get("technicalKnowledgeScore", 0))
        result.setdefault("clarityScore", result.get("communicationScore", 0))
        result.setdefault("completenessScore", result.get("projectKnowledgeScore", 0))
        result.setdefault("skillScores", {})
        result.setdefault("strongAreas", result.get("strengths", []))
        result.setdefault("weakAreas", result.get("areasToImprove", []))
        result.setdefault("resumeGaps", [])
        result.setdefault("projectGaps", [])
        result.setdefault("repeatedMistakes", [])
        result.setdefault("recommendations", result.get("recommendedPractice", []))
        return result
    evaluations = payload.get("evaluations", [])
    scores = [item.get("overallScore", 0) for item in evaluations]
    average = round(sum(scores) / len(scores) * 10) if scores else 0
    return {"overallScore": average, "technicalScore": average, "clarityScore": average, "completenessScore": average, "skillScores": {}, "strongAreas": [], "weakAreas": [], "resumeGaps": [], "projectGaps": [], "repeatedMistakes": [], "recommendations": ["Practice explaining implementation trade-offs with measurable outcomes."]}
