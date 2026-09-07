// FILE: src/main.tsx
// PURPOSE: Application entry point mounting the root App component into the DOM.
// PHASE: 5 | DEPENDS ON: src/App.tsx, src/index.css | LAST TOUCHED: Phase 5

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Mounts the React application in StrictMode for resilient rendering and life-cycle validation.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

