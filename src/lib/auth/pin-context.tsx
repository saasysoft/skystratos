'use client'

import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'skystratos-auth'

interface AuthContextValue {
  isAuthenticated: boolean
  setAuthenticated: (value: boolean) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Sync from sessionStorage after hydration
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored === 'true') setIsAuthenticated(true)
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, String(isAuthenticated))
    } catch {
      // sessionStorage unavailable
    }
  }, [isAuthenticated])

  const setAuthenticated = (value: boolean) => {
    setIsAuthenticated(value)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
