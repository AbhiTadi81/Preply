"""
Report Service

Responsibilities:
- Synthesizes all question evaluations and answers into a comprehensive final report.
- Produces skill breakdown, strengths, weak areas, resume gaps, and actionable recommendations.
"""

from fastapi import HTTPException
from .llm_service import complete_json
from prompts.prompts import REPORT_PROMPT

async def generate_report(payload: dict):
    try:
        result = await complete_json(REPORT_PROMPT, payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report using AI service: {str(e)}")
    if not result:
        raise HTTPException(status_code=500, detail="Failed to generate report using AI service.")
        
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

