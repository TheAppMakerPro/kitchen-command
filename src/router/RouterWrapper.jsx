import { HashRouter } from 'react-router-dom'

// Use HashRouter for all contexts - it works reliably in:
// - Web browsers (URLs will have #)
// - Tauri desktop apps
// - Capacitor mobile apps
// This is the simplest solution that works everywhere

export default function RouterWrapper({ children }) {
  return <HashRouter>{children}</HashRouter>
}
