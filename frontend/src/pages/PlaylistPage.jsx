import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function PlaylistPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const songs = state?.songs || []
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentSong = songs[currentIndex]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <button
          onClick={() => navigate('/chat')}
          className="text-violet-300 hover:text-white transition"
        >
          ← Back to Chat
        </button>
        <h1 className="text-xl font-bold">Your Playlist</h1>
        <div className="w-20" />
      </header>

      <div className="max-w-2xl mx-auto p-6">
        {songs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p>No songs in this playlist.</p>
            <button
              onClick={() => navigate('/chat')}
              className="mt-4 text-violet-400 hover:text-violet-300"
            >
              Create a playlist in Chat
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-2xl overflow-hidden bg-slate-800/50 border border-white/10 mb-6">
              <div className="aspect-video">
                {currentSong && (
                  <iframe
                    title="YouTube player"
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${currentSong.id}?autoplay=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                )}
              </div>
              <p className="text-slate-300 text-sm px-4 py-2">YouTube</p>
            </div>

            <div className="space-y-2">
              {songs.map((song, i) => (
                <button
                  key={song.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${
                    i === currentIndex
                      ? 'bg-violet-600/40 border border-violet-500/50'
                      : 'bg-slate-800/50 border border-transparent hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-slate-400 w-6">{i + 1}.</span>
                  <span className="flex-1 truncate">{song.title}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
