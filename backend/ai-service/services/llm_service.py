import json
import os
import httpx

async def complete_json(system_prompt: str, payload: dict):
    api_key = os.getenv("LLM_API_KEY")
    if not api_key:
        return None
    base_url = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
    model = os.getenv("LLM_MODEL", "gpt-4o-mini")
    response = await httpx.AsyncClient(timeout=45).post(
        f"{base_url}/chat/completions",
        headers={"Authorization": f"Bearer {api_key}"},
        json={"model": model, "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": json.dumps(payload)}], "response_format": {"type": "json_object"}},
    )
    response.raise_for_status()
    return json.loads(response.json()["choices"][0]["message"]["content"])
