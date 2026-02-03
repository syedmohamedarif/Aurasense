from typing import Optional

DEFAULT_EMAIL = "admin@aurasense.com"
DEFAULT_PASSWORD = "aurasense123"

# In-memory session store: session_id -> email
sessions: dict[str, str] = {}


def validate_credentials(email: str, password: str) -> bool:
    return email == DEFAULT_EMAIL and password == DEFAULT_PASSWORD


def create_session(email: str) -> str:
    import uuid
    session_id = str(uuid.uuid4())
    sessions[session_id] = email
    return session_id


def get_session_email(session_id: Optional[str]) -> Optional[str]:
    if not session_id:
        return None
    return sessions.get(session_id)


def invalidate_session(session_id: str) -> None:
    sessions.pop(session_id, None)
