"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { GlassCard } from "@/components/ui/GlassCard"
import { LogOut, User, Mail, Shield, Palette, Check, CreditCard } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "@/context/ThemeContext"
import { colorSchemes } from "@/context/ThemeContext"
import { cn } from "@/lib/utils"
import { useStore } from "@/context/StoreContext"

export default function Profile() {
    const { data: session } = useSession()
    const user = session?.user
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const { colorScheme, setColorScheme } = useTheme()

    // Expense Limits State
    const { savedCards } = useStore()

    return (
        <div className="p-6 space-y-8 pt-10 min-h-screen pb-28 md:pb-10 md:pt-8 md:max-w-xl md:mx-auto animate-in slide-in-from-bottom-5 duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Profile</h1>
            </div>

            <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-[2px] shadow-xl shadow-fuchsia-500/20">
                    {user?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.image} alt={user.name || "User"} className="w-full h-full rounded-full object-cover border-4 border-background" />
                    ) : (
                        <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center border-4 border-background">
                            <User className="w-10 h-10 text-muted-foreground" />
                        </div>
                    )}
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider ml-1">General</h3>

                <GlassCard className="p-0 overflow-hidden divide-y divide-white/5">
                    <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">Name</p>
                            <p className="text-xs text-muted-foreground">{user?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">Email</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">Account ID</p>
                            <p className="text-xs text-muted-foreground font-mono">{user?.id?.slice(0, 8)}...</p>
                        </div>
                    </div>
                    <Link href="/cards" className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">My Cards</p>
                            <p className="text-xs text-muted-foreground">{savedCards?.length || 0} cards saved</p>
                        </div>
                    </Link>
                </GlassCard>
            </div>



            {/* Theme Selector */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 ml-1">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Color Scheme</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {(Object.keys(colorSchemes) as Array<keyof typeof colorSchemes>).map((scheme) => {
                        const colors = colorSchemes[scheme];
                        const isSelected = colorScheme === scheme;

                        return (
                            <button
                                key={scheme}
                                onClick={() => setColorScheme(scheme)}
                                className={cn(
                                    "relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 active:scale-95",
                                    isSelected
                                        ? "border-primary shadow-lg shadow-primary/20 scale-105"
                                        : "border-border hover:border-primary/50"
                                )}
                                style={{
                                    background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.card} 100%)`
                                }}
                            >
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <div
                                            className="w-8 h-8 rounded-lg shadow-md"
                                            style={{ backgroundColor: colors.primary }}
                                        />
                                        <div
                                            className="w-8 h-8 rounded-lg shadow-md"
                                            style={{ backgroundColor: colors.accent }}
                                        />
                                        <div
                                            className="w-8 h-8 rounded-lg shadow-md"
                                            style={{ backgroundColor: colors.secondary }}
                                        />
                                    </div>
                                    <div>
                                        <p
                                            className="font-semibold text-sm"
                                            style={{ color: colors.foreground }}
                                        >
                                            {colors.name}
                                        </p>
                                        <p
                                            className="text-xs capitalize opacity-60"
                                            style={{ color: colors.foreground }}
                                        >
                                            {scheme}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={async () => {
                    setIsLoggingOut(true)
                    try {
                        await signOut({ callbackUrl: "/login" })
                    } catch (error) {
                        setIsLoggingOut(false)
                    }
                }}
                disabled={isLoggingOut}
                className="w-full p-4 rounded-xl bg-rose-500/10 text-rose-500 font-semibold border border-rose-500/20 hover:bg-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm hover:shadow-md"
            >
                {isLoggingOut ? (
                    <>
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing out...
                    </>
                ) : (
                    <>
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </>
                )}
            </button>

            <div className="text-center text-xs text-muted-foreground mt-8">
                <p>MoneW v0.1.0</p>
            </div>
        </div>
    )
}
