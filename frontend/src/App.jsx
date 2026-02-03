import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import PlaylistPage from './pages/PlaylistPage'

function ProtectedRoute({ children }) {
  const sessionId = localStorage.getItem('aurasense_session')
  if (!sessionId) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlist"
          element={
            <ProtectedRoute>
              <PlaylistPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/chat" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
