# Preply

AI resume-based voice interview practice with a React frontend, Node/Express application API, MongoDB persistence, and an internal FastAPI AI service.

## Local setup

Prerequisites: Node.js 20+, Python 3.11+, MongoDB, and a configured LLM-compatible API key.

1. Install Node dependencies:

   ```powershell
   npm install
   Copy-Item .env.example .env
   ```

2. Install the AI service dependencies:

   ```powershell
   cd backend/ai-service
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   Copy-Item .env.example .env
   cd ..
   ```

3. Start MongoDB.

4. Start FastAPI in terminal 1:

   ```powershell
   cd backend/ai-service
   .\.venv\Scripts\Activate.ps1
   uvicorn main:app --reload --port 8000
   ```

5. Build the React/Tailwind client and start Node/Express in terminal 2:

   ```powershell
   npm run dev
   ```

Open `http://localhost:3000`.

The interview setup preserves the existing UI and now sends `easy`, `medium`, or `hard` to Node. Node owns authentication and persistence, and calls FastAPI for resume parsing, question generation, answer evaluation, and final reports. The client is bundled with esbuild and Tailwind CLI; Vite is not used.

## Production build

```powershell
npm run build
npm start
```

The production Node process serves the built React app and the REST API. FastAPI remains an internal service at `AI_SERVICE_URL`.
