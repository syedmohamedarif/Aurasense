import json
import os
from typing import Optional
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))


SYSTEM_PROMPT = """You are a friendly music playlist assistant. You help users discover music playlists based on their preferences.

Your role:
- Greet warmly and ask about their mood, preferred genre, language, activity, and how long they want to listen
- Extract preferences from natural conversation
- Return ONLY valid JSON when you have enough information to create a playlist

Rules:
- Never mention APIs, platforms, or technical terms
- Be conversational and empathetic
- When you have: mood, genre(s), language, activity, and duration (in minutes) - return the JSON
- Duration defaults to 30 if not specified
- Genre can be a list like ["pop", "melody"] or single genre
- Valid intents: "CHAT", "CREATE_PLAYLIST", "CLARIFY"

When creating playlist, return ONLY this JSON (no markdown, no extra text):
{"intent": "CREATE_PLAYLIST", "mood": "<mood>", "genre": ["<genre1>", "<genre2>"], "language": "<language>", "activity": "<activity>", "duration": <number>}

For casual chat or when needing more info, return:
{"intent": "CHAT", "response": "<your friendly message>"}

Or to clarify:
{"intent": "CLARIFY", "response": "<question to user>"}"""


def parse_chatbot_response(text: str) -> dict:
    text = text.strip()
    start = text.find("{")
    if start >= 0:
        depth = 0
        for i in range(start, len(text)):
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
                if depth == 0:
                    try:
                        return json.loads(text[start : i + 1])
                    except json.JSONDecodeError:
                        break
    return {"intent": "CHAT", "response": text}


def chat(user_message: str, history: list[dict]) -> dict:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for h in history:
        messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": user_message})

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.7,
        )
        content = response.choices[0].message.content
        return parse_chatbot_response(content)
    except Exception as e:
        return {"intent": "CHAT", "response": "I'm having a little trouble right now. Could you try again?"}
