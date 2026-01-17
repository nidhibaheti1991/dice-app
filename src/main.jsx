import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PremiumProvider } from './contexts/PremiumContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PremiumProvider>
      <App />
    </PremiumProvider>
  </StrictMode>,
)
