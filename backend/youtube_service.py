import os
from typing import Optional
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


def get_youtube_client():
    api_key = os.getenv("YOUTUBE_API_KEY", "")
    return build("youtube", "v3", developerKey=api_key)


# Hardcoded song database (no DB) - representative YouTube video IDs for demo
# In production, you'd search YouTube API with query strings derived from preferences
SONG_DATABASE = [
    {"id": "dQw4w9WgXcQ", "title": "Sample Track 1", "mood": "energetic", "genre": "pop", "language": "English"},
    {"id": "kJQP7kiw5Fk", "title": "Sample Track 2", "mood": "happy", "genre": "pop", "language": "Spanish"},
    {"id": "RgKAFK5djSk", "title": "Sample Track 3", "mood": "relaxed", "genre": "melody", "language": "Tamil"},
    {"id": "9bZkp7q19f0", "title": "Sample Track 4", "mood": "energetic", "genre": "pop", "language": "Korean"},
    {"id": "OPf0YbXqDm0", "title": "Sample Track 5", "mood": "calm", "genre": "melody", "language": "Tamil"},
    {"id": "JGwWNGJdvx8", "title": "Sample Track 6", "mood": "romantic", "genre": "pop", "language": "English"},
    {"id": "fJ9rUzIMcZQ", "title": "Sample Track 7", "mood": "relaxed", "genre": "rock", "language": "English"},
    {"id": "CevxZvSJLk8", "title": "Sample Track 8", "mood": "happy", "genre": "melody", "language": "Tamil"},
    {"id": "2Vv-BfVoq4g", "title": "Sample Track 9", "mood": "calm", "genre": "melody", "language": "Hindi"},
    {"id": "YQHsXMglC9A", "title": "Sample Track 10", "mood": "energetic", "genre": "pop", "language": "English"},
]


def search_youtube(query: str, max_results: int = 10) -> list[dict]:
    try:
        youtube = get_youtube_client()
        search_response = youtube.search().list(
            q=query,
            part="snippet",
            type="video",
            maxResults=max_results,
            videoCategoryId="10",
        ).execute()

        results = []
        for item in search_response.get("items", []):
            vid = item["id"].get("videoId")
            if vid:
                results.append({
                    "id": vid,
                    "title": item["snippet"]["title"],
                })
        return results
    except HttpError:
        return []
    except Exception:
        return []


def get_video_details(video_ids: list[str]) -> list[dict]:
    if not video_ids:
        return []
    try:
        youtube = get_youtube_client()
        response = youtube.videos().list(
            part="snippet,statistics",
            id=",".join(video_ids[:50]),
        ).execute()

        items = response.get("items", [])
        return [
            {
                "id": i["id"],
                "title": i["snippet"]["title"],
                "views": int(i.get("statistics", {}).get("viewCount", 0)),
                "likes": int(i.get("statistics", {}).get("likeCount", 0)),
            }
            for i in items
        ]
    except Exception:
        return []


def fetch_playlist_songs(mood: str, genres: list[str], language: str, activity: str, count: int) -> list[dict]:
    api_key = os.getenv("YOUTUBE_API_KEY")
    if api_key:
        query_parts = [language, " ", " ".join(genres), " music", activity, mood]
        query = " ".join(filter(None, query_parts))
        search_results = search_youtube(query, max_results=count)
        if search_results:
            ids = [r["id"] for r in search_results]
            details = get_video_details(ids)
            return [{"id": d["id"], "title": d["title"], "views": d["views"], "likes": d["likes"]} for d in details]
    return fallback_playlist(mood, genres, language, count)


def fallback_playlist(mood: str, genres: list[str], language: str, count: int) -> list[dict]:
    genre_set = set(g.lower() for g in genres) if genres else set()
    scored = []
    for s in SONG_DATABASE:
        score = 0.0
        if s["mood"].lower() == mood.lower():
            score += 0.4
        if genre_set and any(g in s["genre"].lower() for g in genre_set):
            score += 0.3
        if language and language.lower() in s["language"].lower():
            score += 0.2
        score += 0.1
        scored.append((score, s))
    scored.sort(key=lambda x: -x[0])
    return [{"id": s["id"], "title": s["title"], "views": 0, "likes": 0} for _, s in scored[:count]]
