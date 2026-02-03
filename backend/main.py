import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from auth import validate_credentials, create_session, get_session_email
from chatbot import chat
from recommender import create_playlist

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="AuraSense API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    success: bool
    message: str
    session_id: str | None = None


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


class PlaylistCreateRequest(BaseModel):
    mood: str
    genre: list[str]
    language: str
    activity: str
    duration: int


def require_auth(authorization: str | None = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing session")
    session_id = authorization.replace("Bearer ", "").strip()
    email = get_session_email(session_id)
    if not email:
        raise HTTPException(status_code=401, detail="Session expired")
    return session_id


@app.post("/login", response_model=LoginResponse)
def login(req: LoginRequest):
    if validate_credentials(req.email, req.password):
        session_id = create_session(req.email)
        return LoginResponse(success=True, message="Login successful", session_id=session_id)
    return LoginResponse(success=False, message="Invalid email or password", session_id=None)


@app.post("/chat")
def chat_endpoint(req: ChatRequest, authorization: str | None = Header(None)):
    require_auth(authorization)
    result = chat(req.message, req.history)
    return result


@app.post("/playlist/create")
def playlist_create(req: PlaylistCreateRequest, authorization: str | None = Header(None)):
    require_auth(authorization)
    songs = create_playlist(
        mood=req.mood,
        genre=req.genre,
        language=req.language,
        activity=req.activity,
        duration=req.duration,
    )
    return {"songs": songs}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
