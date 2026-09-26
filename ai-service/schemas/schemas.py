from typing import Any
from pydantic import BaseModel, Field

class ResumeRequest(BaseModel):
    resume_text: str = Field(min_length=1)

class QuestionRequest(BaseModel):
    resume: dict[str, Any]
    targetRole: str
    difficulty: str = "medium"
    previousQuestions: list[str] = []
    previousAnswers: list[str] = []
    questionNumber: int = 1

class EvaluationRequest(BaseModel):
    resume: dict[str, Any]
    question: str
    expectedConcepts: list[str] = []
    answer: str = Field(min_length=1)
    targetRole: str

class ReportRequest(BaseModel):
    resume: dict[str, Any]
    questions: list[dict[str, Any]]
    answers: list[dict[str, Any]]
    evaluations: list[dict[str, Any]]
    targetRole: str
