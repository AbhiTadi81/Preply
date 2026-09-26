# Preply

Preply is an AI-powered interview preparation platform with resume analysis, dynamic mock interviews, automated scoring, and personalized daily skill gap reports.

---

## Architecture

The project is structured into **three completely independent, standalone services**:

```
Preply/
├── frontend/        # Standalone React Application
├── backend/         # Standalone Node.js + Express REST API
├── ai-service/      # Standalone Python + FastAPI Microservice
├── .gitignore
└── README.md
```

- **Frontend (`React`)**: Client-side UI built with React 19, Tailwind CSS, Lucide icons, and React Router. Zero Vite dependency, CRA-compatible structure generating `frontend/build/`.
- **Backend (`Node.js + Express`)**: Standalone REST API providing JWT authentication, MongoDB data persistence, and interview session management.
- **AI Service (`Python + FastAPI`)**: Dedicated AI service leveraging Google Gemini models to parse resumes, generate targeted interview questions, evaluate answers, and create performance reports.

---

## Communication Flow

All network traffic follows a clean unidirectional flow:

```
Browser
   │  HTTPS / HTTP
   ▼
Frontend (Port 3000)
   │  REST API (REACT_APP_API_URL)
   ▼
Backend (Port 5000)
   │  HTTP (AI_SERVICE_URL)
   ▼
AI Service (Port 8000)
```

1. The **Browser** interacts with the **Frontend**.
2. The **Frontend** communicates with the **Backend** REST API via `REACT_APP_API_URL`.
3. The **Backend** delegates AI tasks (resume parsing, question generation, answer scoring, report generation) to the **AI Service** via `AI_SERVICE_URL`.
4. The **Frontend** never accesses the AI service directly or runs backend business logic.

---

## Prerequisites

- **Node.js** (v20+ recommended)
- **Python** (v3.10+ recommended)
- **MongoDB** (Local instance or MongoDB Atlas URI)
- **Google Gemini API Key**

---

## Environment Variables

Each service manages its own environment variables independently:

### 1. Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```env
PORT=3000
REACT_APP_API_URL=http://localhost:5000
```

### 2. Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/preply
JWT_SECRET=your_jwt_secret_key_here
AI_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

### 3. AI Service (`ai-service/.env`)
Copy `ai-service/.env.example` to `ai-service/.env`:
```env
PORT=8000
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-3.5-flash-lite
```

---

## Running the Services Locally

Open three separate terminal windows to run all three services concurrently:

### 1. Frontend
```bash
cd frontend
npm install
npm start
```
- Local dev server starts at: `http://localhost:3000`
- To produce a production build:
```bash
npm run build
```
Generates production files into `frontend/build/`.

### 2. Backend
```bash
cd backend
npm install
npm run dev
```
- API server starts at: `http://localhost:5000`
- Health check available at: `http://localhost:5000/api/health`
- Production start:
```bash
npm start
```

### 3. AI Service
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```
- Or run directly:
```bash
python app.py
```
- API documentation available at: `http://localhost:8000/docs`
- Health check available at: `http://localhost:8000/health`

---

## Independent Deployment

Each of the three services is designed to be deployed separately to platforms such as Vercel, Render, Railway, AWS, or Heroku.

### Frontend Deployment (e.g., Vercel, Netlify)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Environment Variables**:
  - `REACT_APP_API_URL`: URL of the deployed backend (e.g., `https://api.yourdomain.com`)

### Backend Deployment (e.g., Render, Railway)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `PORT`: Assigned automatically by hosting platform
  - `MONGODB_URI`: Connection string for MongoDB database
  - `JWT_SECRET`: Secure JWT secret
  - `AI_SERVICE_URL`: URL of deployed AI service (e.g., `https://ai.yourdomain.com`)
  - `FRONTEND_URL`: URL of deployed frontend (e.g., `https://app.yourdomain.com`)

### AI Service Deployment (e.g., Render, Railway, Fly.io)
- **Root Directory**: `ai-service`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `PORT`: Assigned automatically by hosting platform
  - `GEMINI_API_KEY`: Google Gemini API key
  - `GEMINI_MODEL`: `gemini-3.5-flash-lite`
