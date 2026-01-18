"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { GlassCard } from "@/components/ui/GlassCard"
import { LogOut, User, Mail, Shield, Palette, Check, CreditCard, Trash2, Pencil, X, Check as CheckIcon, Download } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "@/context/ThemeContext"
import { colorSchemes } from "@/context/ThemeContext"
import { cn } from "@/lib/utils"
import { useStore } from "@/context/StoreContext"

export default function Profile() {
    const { data: session } = useSession()
    const user = session?.user
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [isResetting, setIsResetting] = useState(false)
    const { colorScheme, setColorScheme } = useTheme()

    // iOS Detection
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const ios = /iphone|ipad|ipod/.test(userAgent) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
        setIsIOS(ios);

        const standalone = window.matchMedia('(display-mode: standalone)').matches;
        setIsStandalone(standalone);
    }, []);

    // Store Access
    const { savedCards, userName, updateUserName } = useStore()

    // Edit Name State
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');

    const displayName = userName || user?.name || "User";

    const handleSaveName = async () => {
        if (!tempName.trim()) return;
        await updateUserName(tempName);
        setIsEditingName(false);
    };

    return (
        <div className="p-6 md:p-8 xl:p-10 space-y-8 pt-10 min-h-screen pb-28 xl:pb-10 md:pt-8 md:max-w-4xl md:mx-auto xl:max-w-6xl xl:ml-[22rem] xl:mr-8 animate-in slide-in-from-bottom-5 duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Profile</h1>
            </div>

            {/* Grid layout for desktop */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left column */}
                <div className="space-y-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-[2px] shadow-xl shadow-fuchsia-500/20">
                            {user?.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.image} alt={displayName} className="w-full h-full rounded-full object-cover border-4 border-background" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center border-4 border-background">
                                    <User className="w-10 h-10 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        {/* Name Edit Section */}
                        <div className="text-center w-full max-w-[250px] relative min-h-[60px] flex flex-col items-center justify-center">
                            {isEditingName ? (
                                <div className="flex items-center gap-2 w-full animate-in zoom-in-95 duration-200">
                                    <input
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        maxLength={20}
                                        className="w-full bg-secondary border border-primary/50 rounded-xl px-3 py-2 text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveName();
                                            if (e.key === 'Escape') setIsEditingName(false);
                                        }}
                                    />
                                    <div className="flex gap-1">
                                        <button
                                            onClick={handleSaveName}
                                            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 transition-colors"
                                        >
                                            <CheckIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setIsEditingName(false)}
                                            className="p-2 rounded-lg bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="group relative flex items-center justify-center hover:bg-white/5 px-4 py-2 rounded-xl transition-all cursor-pointer" onClick={() => { setTempName(displayName); setIsEditingName(true); }}>
                                    <h2 className="text-xl font-bold truncate max-w-[200px]" title={displayName}>{displayName}</h2>
                                    <Pencil className="absolute right-4 w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider ml-1">General</h3>

                        <GlassCard className="p-0 overflow-hidden divide-y divide-white/5">
                            <div className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => { setTempName(displayName); setIsEditingName(true); }}>
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Name</p>
                                    <p className="text-xs text-muted-foreground">{displayName}</p>
                                </div>
                                <Pencil className="w-4 h-4 text-muted-foreground/50" />
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
                </div>

                {/* Right column */}
                <div className="space-y-8">



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
                                                <CheckIcon className="w-4 h-4 text-white" />
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
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Install Profile Button (iOS Safari Only) */}
                    {isIOS && !isStandalone && (
                        <a
                            href="/api/ios-profile"
                            onClick={() => {
                                // Mark as dismissed since they are installing it manually
                                localStorage.setItem('install-prompt-dismissed', Date.now().toString());
                            }}
                            className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold border border-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 mb-4"
                        >
                            <Download className="w-5 h-5" />
                            Install Web App Profile
                        </a>
                    )}

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
                        className="w-full p-4 rounded-xl bg-secondary text-foreground font-semibold border border-border hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm hover:shadow-md mb-4"
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

                    <button
                        onClick={async () => {
                            if (confirm("WARNING: All your data (wallets, transactions, categories) will be permanently deleted. Are you sure you want to reset and restart setup?")) {
                                setIsResetting(true)
                                try {
                                    const res = await fetch('/api/user/reset', { method: 'POST' });
                                    if (res.ok) {
                                        await signOut({ callbackUrl: "/login" });
                                    }
                                } catch (error) {
                                    console.error(error);
                                    setIsResetting(false);
                                }
                            }
                        }}
                        disabled={isResetting}
                        className="w-full p-4 rounded-xl bg-rose-500/10 text-rose-500 font-semibold border border-rose-500/20 hover:bg-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm hover:shadow-md"
                    >
                        {isResetting ? (
                            <>
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Resetting Data...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-5 h-5" />
                                Reset Data & Restart Setup
                            </>
                        )}
                    </button>

                    <div className="text-center text-xs text-muted-foreground mt-8">
                        <p>MoneW v0.1.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
