"""
Preply AI Microservice (FastAPI)

Responsibility:
- Exposes REST endpoints for AI-driven resume parsing, interview question generation,
  answer evaluation, and daily skill gap report generation.
- Delegates business logic to specialized services in the services/ folder.
- Does not connect directly to the database or frontend; communicates only with the backend.
"""

import os
from fastapi import FastAPI, HTTPException
import uvicorn

from schemas.schemas import ResumeRequest, QuestionRequest, EvaluationRequest, ReportRequest
from services.resume_service import parse_resume
from services.interview_service import generate_question
from services.evaluation_service import evaluate_answer
from services.report_service import generate_report

app = FastAPI(
    title="Preply AI Service",
    description="Dedicated microservice for Gemini-powered resume analysis and mock interviews",
    version="1.0.0"
)


@app.get("/")
def root():
    """Service overview and links to documentation and health check."""
    return {
        "status": "ok",
        "service": "Preply AI Service",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
def health():
    """Simple health check endpoint for monitoring."""
    return {"status": "ok", "service": "preply-ai"}


@app.post("/api/resume/parse")
async def parse_resume_route(request: ResumeRequest):
    """
    Parses raw resume text and extracts structured candidate profile information
    (skills, experience level, summary, suggested roles).
    """
    return await parse_resume(request.resume_text)


@app.post("/api/interview/generate-question")
async def generate_question_route(request: QuestionRequest):
    """
    Generates dynamic interview questions tailored to the candidate's target role,
    resume context, and chosen difficulty level.
    """
    if request.difficulty not in {"easy", "medium", "hard"}:
        raise HTTPException(status_code=400, detail="Difficulty must be easy, medium, or hard")
    return await generate_question(request.model_dump())


@app.post("/api/interview/evaluate-answer")
async def evaluate_answer_route(request: EvaluationRequest):
    """
    Evaluates a candidate's recorded answer against expected concepts,
    providing a numerical score, strengths, and areas for improvement.
    """
    return await evaluate_answer(request.model_dump())


@app.post("/api/interview/generate-report")
async def generate_report_route(request: ReportRequest):
    """
    Generates a comprehensive interview performance report with skill breakdown,
    recommendations, and next steps for candidate improvement.
    """
    return await generate_report(request.model_dump())


if __name__ == "__main__":
    # Allows running directly via `python app.py` or with uvicorn CLI
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"[AI-Service] Starting server on http://{host}:{port}")
    uvicorn.run("app:app", host=host, port=port, reload=True)
