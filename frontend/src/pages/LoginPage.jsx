import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      if (data.success && data.session_id) {
        localStorage.setItem('aurasense_session', data.session_id)
        navigate('/chat')
      } else {
        setError(data.message || 'Invalid email or password')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">AuraSense</h1>
          <p className="text-violet-200 mt-2">AI-Powered Music Playlist</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-violet-100 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aurasense.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-violet-300/60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-violet-100 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-violet-300/60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                required
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        <p className="text-center text-violet-300/70 text-sm mt-6">
          Default: admin@aurasense.com / aurasense123
        </p>
      </div>
    </div>
  )
}
