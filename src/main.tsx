import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/great-vibes/vietnamese-400.css'
import '@fontsource/great-vibes/latin-400.css'
import '@fontsource/cormorant-garamond/vietnamese-500.css'
import '@fontsource/cormorant-garamond/vietnamese-500-italic.css'
import '@fontsource/cormorant-garamond/vietnamese-600.css'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/latin-500-italic.css'
import '@fontsource/cormorant-garamond/latin-600.css'
import '@fontsource/be-vietnam-pro/vietnamese-300.css'
import '@fontsource/be-vietnam-pro/vietnamese-400.css'
import '@fontsource/be-vietnam-pro/vietnamese-500.css'
import '@fontsource/be-vietnam-pro/latin-300.css'
import '@fontsource/be-vietnam-pro/latin-400.css'
import '@fontsource/be-vietnam-pro/latin-500.css'
import './styles/base.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
