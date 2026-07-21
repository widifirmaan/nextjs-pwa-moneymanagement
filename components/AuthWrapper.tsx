"use client"
import { useAuth } from "@/context/AuthContext"
import Login from "@/app/login/page"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
    }

    if (!user) {
        return <Login />
    }

    return <>{children}</>
}
