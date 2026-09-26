"""
Evaluation Service

Responsibilities:
- Evaluates candidate answers against expected technical concepts and question context.
- Generates granular scores (technical, clarity, completeness), missing concepts, and feedback.
"""

from fastapi import HTTPException
from .llm_service import complete_json
from prompts.prompts import EVALUATION_PROMPT

async def evaluate_answer(payload: dict):
    try:
        result = await complete_json(EVALUATION_PROMPT, payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to evaluate answer using AI service: {str(e)}")
    if not result:
        raise HTTPException(status_code=500, detail="Failed to evaluate answer using AI service.")
        
    answer = payload["answer"].lower()
    concepts = [concept.lower() for concept in payload.get("expectedConcepts", [])]
    answer_compact = answer.replace("-", "")
    missing_concepts = [concept for concept in concepts if concept.replace("-", "") not in answer_compact and not any(token.replace("-", "")[:4] in answer_compact for token in concept.split())]
    if "missingConcepts" not in result:
        result["missingConcepts"] = missing_concepts
    result.setdefault("answerRelevanceScore", result.get("overallScore", 0))
    result.setdefault("technicalScore", result.get("overallScore", 0))
    result.setdefault("clarityScore", result.get("overallScore", 0))
    result.setdefault("completenessScore", result.get("overallScore", 0))
    result.setdefault("overallScore", round(sum(result.get(key, 0) for key in ("technicalScore", "clarityScore", "completenessScore")) / 3))
    if not result.get("feedback"):
        if not missing_concepts:
            result["feedback"] = "Good coverage of the requested concepts. Add more concrete implementation details and measurable results where possible."
        else:
            result["feedback"] = f"Address these parts of the question more directly: {', '.join(missing_concepts)}."
    return result

