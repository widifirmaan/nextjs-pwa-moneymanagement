"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Mail, Lock, User, ArrowRight, ShieldCheck, PieChart, CreditCard, AlertCircle } from "lucide-react"

export default function Login() {
    const { user, login, register } = useAuth()
    const router = useRouter()
    const [isRegister, setIsRegister] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [rememberAccount, setRememberAccount] = useState(false)

    useEffect(() => {
        if (user) {
            router.push("/")
        }
    }, [user, router])

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
                await register(email, password, name.trim() || email.split("@")[0])
            } else {
                await login(email, password)
            }
        } catch (err: unknown) {
            setError((err instanceof Error ? err.message : "") || "Authentication failed. Please check your credentials.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-background text-foreground overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
            {/* Ambient Warm Glows matching MoneW Coklat Jawa aesthetic */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md lg:max-w-5xl">
                <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
                    
                    {/* Left Column: MoneW Branding & Feature Highlights (Desktop) */}
                    <div className="hidden lg:flex lg:col-span-7 flex-col justify-center space-y-8 pr-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-3xl shadow-xl shadow-primary/30 border border-white/10">
                                M
                            </div>
                            <div>
                                <span className="text-3xl font-extrabold tracking-tight text-foreground">MoneW</span>
                                <p className="text-sm font-medium text-muted-foreground">Smart Money Management</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                                Take Full Control of Your <span className="text-gradient">Personal Wealth</span>
                            </h1>
                            <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
                                Manage bank accounts, virtual cards, cash, and digital wallets in one unified, elegant, and private dashboard.
                            </p>
                        </div>

                        {/* Feature Badges */}
                        <div className="space-y-3.5 max-w-lg">
                            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-xl shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                    <CreditCard className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">Multi-Wallet & Card Management</h3>
                                    <p className="text-xs text-muted-foreground">Support for BCA, Mandiri, Jenius, GoPay, and custom e-wallets.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-xl shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                    <PieChart className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">Interactive Expense Analytics</h3>
                                    <p className="text-xs text-muted-foreground">Visual spending categories, monthly analytics, and budget thresholds.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-xl shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">Private & Offline-Ready</h3>
                                    <p className="text-xs text-muted-foreground">Secure receipt storage and instant offline access anywhere.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Authentication Card */}
                    <div className="lg:col-span-5 w-full">
                        <div className="glass-card rounded-[32px] p-8 sm:p-10 border border-border/70 shadow-2xl relative overflow-hidden backdrop-blur-3xl bg-card/80">
                            {/* Top subtle highlight */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                            {/* Mobile-only brand header */}
                            <div className="flex flex-col items-center mb-6 lg:hidden">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-xl shadow-primary/30 mb-3 border border-white/10">
                                    M
                                </div>
                                <span className="font-bold text-2xl text-foreground">MoneW</span>
                                <p className="text-xs text-muted-foreground">Smart Money Management</p>
                            </div>

                            {/* Form Header */}
                            <div className="text-center lg:text-left space-y-1 mb-6">
                                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                                    {isRegister ? "Create Account" : "Sign In"}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {isRegister ? "Join MoneW to start managing your wealth" : "Welcome back! Enter your details to continue"}
                                </p>
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <div className="mb-5 p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span className="flex-1 text-left text-xs sm:text-sm font-medium">{error}</span>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {isRegister && (
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                placeholder="e.g. Widi Firmansyah"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                required={isRegister}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/40 border border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/40 border border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/40 border border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                                        <input
                                            type="checkbox"
                                            checked={rememberAccount}
                                            onChange={e => setRememberAccount(e.target.checked)}
                                            className="w-4 h-4 rounded border-border bg-secondary/50 text-primary focus:ring-primary/30 accent-primary cursor-pointer"
                                        />
                                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                                            Remember email
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3.5 px-4 rounded-xl hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-xl shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-3"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin text-primary-foreground" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            <span>{isRegister ? "Creating account..." : "Signing in..."}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{isRegister ? "Create Account" : "Sign In to MoneW"}</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Mode Switcher */}
                            <div className="mt-6 text-center text-xs text-muted-foreground">
                                <span>{isRegister ? "Already have an account?" : "Don't have an account yet?"} </span>
                                <button
                                    type="button"
                                    onClick={() => { setIsRegister(!isRegister); setError("") }}
                                    className="text-accent hover:text-foreground font-semibold transition-colors underline-offset-4 hover:underline ml-1"
                                >
                                    {isRegister ? "Sign In" : "Register now"}
                                </button>
                            </div>

                            {/* Security Footer */}
                            <div className="mt-8 pt-4 border-t border-border/40 text-center">
                                <p className="text-[11px] text-muted-foreground/60 font-mono tracking-widest uppercase">
                                    SECURE • PRIVATE • SMART
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
