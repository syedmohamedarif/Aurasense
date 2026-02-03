import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { chat, createPlaylist } from '../api'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your music buddy. Tell me your mood, favorite genre, language, what you're up to, and how long you want to listen. I'll create a playlist just for you!" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatingPlaylist, setGeneratingPlaylist] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(scrollToBottom, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setMessages((m) => [...m, { role: 'user', content: text }])
    setLoading(true)

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const result = await chat(text, history)

      if (result.intent === 'CREATE_PLAYLIST') {
        const reply = `Got it! Creating a ${result.duration || 30}-minute playlist: ${result.mood || 'chill'} ${(result.genre || []).join(', ')} ${result.language || ''} music for ${result.activity || 'listening'}.`
        setMessages((m) => [...m, { role: 'assistant', content: reply }])
        setGeneratingPlaylist(true)
        try {
          const playlistRes = await createPlaylist({
            mood: result.mood || 'relaxed',
            genre: result.genre || ['melody'],
            language: result.language || 'English',
            activity: result.activity || 'listening',
            duration: result.duration || 30,
          })
          navigate('/playlist', { state: { songs: playlistRes.songs } })
        } catch {
          setMessages((m) => [
            ...m,
            { role: 'assistant', content: "Couldn't generate the playlist right now. Please try again." },
          ])
        } finally {
          setGeneratingPlaylist(false)
        }
      } else {
        const reply = result.response || "I'm here to help! Tell me more about your music preferences."
        setMessages((m) => [...m, { role: 'assistant', content: reply }])
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: "Something went wrong. Make sure you're still logged in." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('aurasense_session')
    navigate('/login')
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-950">
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <h1 className="text-xl font-bold text-white">AuraSense</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-violet-300 hover:text-white transition"
        >
          Logout
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                msg.role === 'user'
                  ? 'bg-violet-600 text-white rounded-br-md'
                  : 'bg-slate-700/80 text-slate-100 rounded-bl-md'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700/80 rounded-2xl rounded-bl-md px-4 py-2.5">
              <span className="text-violet-300">Thinking...</span>
            </div>
          </div>
        )}
        {generatingPlaylist && (
          <div className="flex justify-start">
            <div className="bg-slate-700/80 rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-2">
              <span className="animate-pulse w-2 h-2 rounded-full bg-violet-400" />
              <span className="text-violet-300">Creating your playlist...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Tell me your mood, genre, language..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
