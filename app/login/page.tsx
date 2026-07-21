"use client"
import { useState, useEffect, FormEvent } from "react"
import { useAuth } from "@/context/AuthContext"

export default function Login() {
    const { login, register } = useAuth()
    const [isRegister, setIsRegister] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [rememberAccount, setRememberAccount] = useState(false)

    useEffect(() => {
        const savedEmail = localStorage.getItem('monew_remembered_email')
        if (savedEmail) {
            setEmail(savedEmail)
            setRememberAccount(true)
        }
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        try {
            if (rememberAccount) {
                localStorage.setItem('monew_remembered_email', email)
            } else {
                localStorage.removeItem('monew_remembered_email')
            }
            if (isRegister) {
                await register(email, password, name || email.split("@")[0])
            } else {
                await login(email, password)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 z-0">
                <source src="/login-bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 z-0 bg-gradient-to-tl from-black via-purple-950/50 to-indigo-950/50" />
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] animate-pulse z-0" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px] animate-pulse delay-1000 z-0" />

            <div className="relative z-10 w-full max-w-sm p-6">
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl rounded-[32px] p-8 md:p-10 text-center animate-in slide-in-from-bottom-10 zoom-in-95 duration-700">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                    <div className="relative mb-8">
                        <div className="w-28 h-28 mx-auto rounded-[24px] p-0.5 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 shadow-xl shadow-indigo-500/20">
                            <img src="/monew-logo.png" alt="MoneW Logo" className="w-full h-full rounded-[22px] object-cover bg-black" />
                        </div>
                    </div>

                    <div className="space-y-2 mb-8">
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            {isRegister ? "Create Account" : "Welcome to MoneW"}
                        </h1>
                        <p className="text-sm text-blue-200/60 font-medium">
                            {isRegister ? "Start managing your wealth" : "Manage your wealth with elegance"}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isRegister && (
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors"
                        />

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberAccount}
                                onChange={e => setRememberAccount(e.target.checked)}
                                className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500/50 focus:ring-offset-0"
                            />
                            <span className="text-sm text-white/50">Remember account</span>
                        </label>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 px-4 rounded-xl hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin text-black" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    <span>{isRegister ? "Creating..." : "Signing in..."}</span>
                                </>
                            ) : (
                                <span>{isRegister ? "Create Account" : "Sign In"}</span>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-white/40">
                        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            onClick={() => { setIsRegister(!isRegister); setError("") }}
                            className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                        >
                            {isRegister ? "Sign In" : "Register"}
                        </button>
                    </p>

                    <p className="mt-8 text-xs text-white/20 font-mono tracking-wider">
                        SECURE • PRIVATE • SMART
                    </p>
                </div>
            </div>
        </div>
    )
}
