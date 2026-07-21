"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface User {
    id: string
    email: string
    name: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, name: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const logout = useCallback(() => {
        localStorage.removeItem('monew_token')
        setToken(null)
        setUser(null)
    }, [])

    useEffect(() => {
        const savedToken = localStorage.getItem('monew_token')
        if (!savedToken) {
            setIsLoading(false)
            return
        }

        setToken(savedToken)
        fetch('/api/auth/profile', {
            headers: { Authorization: `Bearer ${savedToken}` },
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    setUser({ id: data.id, email: data.email, name: data.name })
                } else {
                    logout()
                }
            })
            .catch(() => logout())
            .finally(() => setIsLoading(false))
    }, [logout])

    const login = useCallback(async (email: string, password: string) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Login failed' }))
            throw new Error(err.error || 'Login failed')
        }
        const data = await res.json()
        localStorage.setItem('monew_token', data.token)
        setToken(data.token)
        setUser(data.user)
    }, [])

    const register = useCallback(async (email: string, password: string, name: string) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
        })
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Registration failed' }))
            throw new Error(err.error || 'Registration failed')
        }
        const data = await res.json()
        localStorage.setItem('monew_token', data.token)
        setToken(data.token)
        setUser(data.user)
    }, [])

    const apiToken = token

    return (
        <AuthContext.Provider value={{ user, token: apiToken, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
