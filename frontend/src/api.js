const API_BASE = import.meta.env.VITE_API_URL || '/api'

function getAuthHeaders() {
  const sessionId = localStorage.getItem('aurasense_session')
  return {
    'Content-Type': 'application/json',
    ...(sessionId && { Authorization: `Bearer ${sessionId}` }),
  }
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

export async function chat(message, history = []) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ message, history }),
  })
  if (!res.ok) throw new Error('Unauthorized')
  return res.json()
}

export async function createPlaylist({ mood, genre, language, activity, duration }) {
  const res = await fetch(`${API_BASE}/playlist/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      mood,
      genre: Array.isArray(genre) ? genre : [genre],
      language,
      activity,
      duration,
    }),
  })
  if (!res.ok) throw new Error('Unauthorized')
  return res.json()
}
