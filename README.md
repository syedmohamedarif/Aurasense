# AuraSense

AI-Powered Conversational Music Playlist Recommendation System.

## Tech Stack

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Python FastAPI
- **AI:** Groq API (LLM)
- **Music:** YouTube Data API v3, YouTube Embed Player

## Default Login

- **Email:** admin@aurasense.com  
- **Password:** aurasense123  

## Prerequisites

- Node.js 18+
- Python 3.11+
- Groq API key
- YouTube Data API v3 key

## Local Development

### 1. Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your GROQ_API_KEY and YOUTUBE_API_KEY

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Deployment (Docker)

### Using Docker Compose

1. Copy `.env.example` to `.env` and set:

```
GROQ_API_KEY=your_groq_api_key
YOUTUBE_API_KEY=your_youtube_data_api_v3_key
```

2. Build and run:

```bash
docker-compose up -d --build
```

3. Access the app at http://localhost:3000 (frontend) or http://localhost:8000 (API docs).

### Manual Docker Build

**Backend:**

```bash
docker build -f Dockerfile.backend -t aurasense-backend .
docker run -p 8000:8000 -e GROQ_API_KEY=xxx -e YOUTUBE_API_KEY=xxx aurasense-backend
```

**Frontend (with API URL):**

```bash
docker build -f Dockerfile.frontend -t aurasense-frontend --build-arg VITE_API_URL=https://your-api.com .
docker run -p 3000:80 aurasense-frontend
```

## Cloud Deployment

### Option 1: Railway / Render

- Deploy backend as a service, note the public URL (e.g. `https://aurasense-api.up.railway.app`).
- Deploy frontend with `VITE_API_URL` set to that URL (e.g. via build arg or env).
- Build: `VITE_API_URL=https://aurasense-api.up.railway.app npm run build`

### Option 2: Vercel (Frontend) + Railway (Backend)

- Backend: deploy to Railway, get URL.
- Frontend: Vercel project, add env `VITE_API_URL=https://your-backend.railway.app`, deploy.

### Option 3: Single Server

- Run `docker-compose up -d` on a VPS (e.g. DigitalOcean, AWS EC2).
- Point domain to server and configure reverse proxy (Nginx/Caddy) for SSL.

## API Endpoints

| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| POST   | /login          | Login (returns session)  |
| POST   | /chat           | Chat with AI (Bearer token) |
| POST   | /playlist/create| Create playlist (Bearer token) |

## Project Structure

```
aurasense/
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── chatbot.py
│   ├── recommender.py
│   └── youtube_service.py
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       └── api.js
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── nginx.conf
```
