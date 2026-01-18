import React from 'react'
import ReactDOM from 'react-dom/client'
import RouterWrapper from './router/RouterWrapper'
import App from './App'
import { AppProvider } from './context/AppContext'
import { AccessibilityProvider } from './context/AccessibilityContext'
import { OfflineProvider } from './context/OfflineContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterWrapper>
      <AccessibilityProvider>
        <AppProvider>
          <OfflineProvider>
            <App />
          </OfflineProvider>
        </AppProvider>
      </AccessibilityProvider>
    </RouterWrapper>
  </React.StrictMode>,
)
