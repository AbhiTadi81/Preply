from fastapi import FastAPI, HTTPException
from schemas.schemas import ResumeRequest, QuestionRequest, EvaluationRequest, ReportRequest
from services.resume_service import parse_resume
from services.interview_service import generate_question
from services.evaluation_service import evaluate_answer
from services.report_service import generate_report

app = FastAPI(title="Preply AI Service")

@app.get("/health")
def health():
    return {"status": "ok", "service": "preply-ai"}

@app.post("/api/resume/parse")
async def parse_resume_route(request: ResumeRequest):
    return await parse_resume(request.resume_text)

@app.post("/api/interview/generate-question")
async def generate_question_route(request: QuestionRequest):
    if request.difficulty not in {"easy", "medium", "hard"}:
        raise HTTPException(status_code=400, detail="Difficulty must be easy, medium, or hard")
    return await generate_question(request.model_dump())

@app.post("/api/interview/evaluate-answer")
async def evaluate_answer_route(request: EvaluationRequest):
    return await evaluate_answer(request.model_dump())

@app.post("/api/interview/generate-report")
async def generate_report_route(request: ReportRequest):
    return await generate_report(request.model_dump())
