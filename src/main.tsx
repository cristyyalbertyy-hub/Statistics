import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { AuthGate } from './components/AuthGate'
import { SYLLABUS_TITLE } from './data/syllabus'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AuthGate appTitle={SYLLABUS_TITLE}>
        <App />
      </AuthGate>
    </AuthProvider>
  </StrictMode>,
)
