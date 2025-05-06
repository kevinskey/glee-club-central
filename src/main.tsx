
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './providers/ThemeProvider'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);
