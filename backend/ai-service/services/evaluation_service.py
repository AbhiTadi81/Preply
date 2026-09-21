from .llm_service import complete_json
from prompts.prompts import EVALUATION_PROMPT

async def evaluate_answer(payload: dict):
    result = await complete_json(EVALUATION_PROMPT, payload)
    if result:
        answer = payload["answer"].lower()
        concepts = [concept.lower() for concept in payload.get("expectedConcepts", [])]
        answer_compact = answer.replace("-", "")
        missing_concepts = [concept for concept in concepts if concept.replace("-", "") not in answer_compact and not any(token.replace("-", "")[:4] in answer_compact for token in concept.split())]
        result["missingConcepts"] = missing_concepts
        result.setdefault("answerRelevanceScore", result.get("overallScore", 0))
        result.setdefault("technicalScore", result.get("overallScore", 0))
        result.setdefault("clarityScore", result.get("overallScore", 0))
        result.setdefault("completenessScore", result.get("overallScore", 0))
        result.setdefault("overallScore", round(sum(result.get(key, 0) for key in ("technicalScore", "clarityScore", "completenessScore")) / 3))
        if not missing_concepts:
            result["feedback"] = "Good coverage of the requested concepts. Add more concrete implementation details and measurable results where possible."
        else:
            result["feedback"] = f"Address these parts of the question more directly: {', '.join(missing_concepts)}."
        return result
    answer = payload["answer"].lower()
    concepts = [concept.lower() for concept in payload.get("expectedConcepts", [])]
    covered = [concept for concept in concepts if concept in answer or any(token[:5] in answer for token in concept.split())]
    missing = [concept for concept in concepts if concept not in answer]
    relevance = min(10, 4 + len(covered) * 2)
    clarity = 8 if len(answer.split()) >= 20 else 6 if len(answer.split()) >= 10 else 4
    completeness = min(10, 4 + round(len(covered) / max(1, len(concepts)) * 6))
    overall = round((relevance + clarity + completeness) / 3)
    feedback = "Good coverage of the requested concepts." if not missing else f"Address these parts of the question more directly: {', '.join(missing)}."
    return {"technicalScore": relevance, "clarityScore": clarity, "completenessScore": completeness, "answerRelevanceScore": relevance, "overallScore": overall, "missingConcepts": missing, "feedback": feedback, "resumeClaim": "", "claimUnderstanding": "partial"}
