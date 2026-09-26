"""
LLM Service

Responsibilities:
- Initializes and manages the Google GenAI client using GEMINI_API_KEY.
- Provides complete_json: sends prompts with structured JSON output enforcement.
- Implements retry with exponential backoff for transient rate limits or unavailability.
"""

import asyncio
import json
import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment variables for ai-service
load_dotenv()
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

_client = None

def get_client() -> genai.Client:
    global _client
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is missing")
    if _client is None:
        _client = genai.Client(api_key=api_key)
    return _client

async def complete_json(system_prompt: str, payload: dict) -> dict:
    client = get_client()
    model = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")

    last_error = None
    for attempt in range(3):
        try:
            response = await client.aio.models.generate_content(
                model=model,
                contents=json.dumps(payload),
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    response_mime_type="application/json"
                )
            )
            raw_text = (response.text or "").strip()
            if not raw_text:
                raise ValueError("Gemini returned empty response text")
            return json.loads(raw_text)
        except Exception as e:
            last_error = e
            err_str = str(e)
            if ("503" in err_str or "429" in err_str or "UNAVAILABLE" in err_str) and attempt < 2:
                await asyncio.sleep(1.5 * (attempt + 1))
                continue
            raise e

    if last_error:
        raise last_error
