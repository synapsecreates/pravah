// FILE: src/main.tsx
// PURPOSE: Application entry point mounting the root App component wrapped in BrowserRouter into the DOM.
// PHASE: 8 | DEPENDS ON: src/App.tsx, src/index.css, react-router-dom | LAST TOUCHED: Phase 8

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

// Mounts the React application in StrictMode with BrowserRouter for client-side routing.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
