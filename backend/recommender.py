from typing import Optional
from youtube_service import fetch_playlist_songs


def create_playlist(
    mood: str,
    genre: list[str],
    language: str,
    activity: str,
    duration: int,
) -> list[dict]:
    count = max(5, min(20, duration // 3))
    genres = genre if isinstance(genre, list) else [genre] if genre else ["melody"]
    songs = fetch_playlist_songs(mood, genres, language, activity, count)
    return songs
