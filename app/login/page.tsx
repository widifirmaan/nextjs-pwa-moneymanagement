"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function Login() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSignIn = async () => {
        setIsLoading(true)
        try {
            await signIn("google", { callbackUrl: "/" })
        } catch (error) {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
            >
                <source src="/login-bg.mp4" type="video/mp4" />
            </video>

            {/* Mesh Gradient Overlay for Aesthetics (visible if video fails or on top) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-tl from-black via-purple-950/50 to-indigo-950/50" />

            {/* Animated Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px] animate-pulse z-0" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px] animate-pulse delay-1000 z-0" />

            <div className="relative z-10 w-full max-w-sm p-6">
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl rounded-[32px] p-8 md:p-10 text-center animate-in slide-in-from-bottom-10 zoom-in-95 duration-700 relative overflow-hidden group">

                    {/* Glass reflections */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                    {/* Logo Section */}
                    <div className="relative mb-8 group-hover:scale-105 transition-transform duration-500">
                        <div className="w-28 h-28 mx-auto rounded-[24px] p-0.5 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 shadow-xl shadow-indigo-500/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/monew-logo.png"
                                alt="MoneW Logo"
                                className="w-full h-full rounded-[22px] object-cover bg-black"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 mb-10">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome to MoneW</h1>
                        <p className="text-sm text-blue-200/60 font-medium">Manage your wealth with elegance</p>
                    </div>

                    <button
                        onClick={handleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 px-4 rounded-xl hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl shadow-white/10 disabled:opacity-60 disabled:cursor-not-allowed group/btn"
                    >
                        {isLoading ? (
                            <>
                                <svg className="w-5 h-5 animate-spin text-black" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 transition-transform group-hover/btn:rotate-12" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>

                    <p className="mt-8 text-xs text-white/20 font-mono tracking-wider">
                        SECURE • PRIVATE • SMART
                    </p>
                </div>


            </div>
        </div>
    )
}
