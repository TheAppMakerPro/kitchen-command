import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AppProvider } from './context/AppContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { OfflineProvider } from './context/OfflineContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AccessibilityProvider>
        <AppProvider>
          <OfflineProvider>
            <App />
          </OfflineProvider>
        </AppProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
