"use client"

import { useSession, signOut } from "next-auth/react"
import { GlassCard } from "@/components/ui/GlassCard"
import { LogOut, User, Mail, Shield } from "lucide-react"

export default function Profile() {
    const { data: session } = useSession()
    const user = session?.user

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
                </GlassCard>
            </div>

            <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full p-4 rounded-xl bg-rose-500/10 text-rose-500 font-semibold border border-rose-500/20 hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2"
            >
                <LogOut className="w-5 h-5" />
                Sign Out
            </button>

            <div className="text-center text-xs text-muted-foreground mt-8">
                <p>MoneyManagement v0.1.0</p>
            </div>
        </div>
    )
}
