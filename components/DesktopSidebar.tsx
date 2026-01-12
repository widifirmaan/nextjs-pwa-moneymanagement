"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wallet, Plus, PieChart, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function DesktopSidebar() {
    const pathname = usePathname()

    const navItems = [
        { icon: Home, label: 'Dashboard', href: '/' },
        { icon: Wallet, label: 'My Wallets', href: '/wallets' },
        { icon: PieChart, label: 'Analytics', href: '/stats' },
        { icon: User, label: 'Profile', href: '/profile' },
    ]

    return (
        <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 border-r border-white/5 bg-card/30 backdrop-blur-xl p-6">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-xl">
                    M
                </div>
                <div>
                    <h1 className="font-bold text-xl tracking-tight">MoneyFlow</h1>
                    <p className="text-xs text-muted-foreground">Finance Manager</p>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group",
                            pathname === item.href
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-white" : "group-hover:text-primary transition-colors")} />
                        <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                ))}

                <div className="pt-4 mt-4 border-t border-white/5">
                    <Link
                        href="/add"
                        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-secondary/50 text-foreground hover:bg-secondary transition-all group border border-white/5"
                    >
                        <div className="p-1 rounded-full bg-primary text-white">
                            <Plus className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-sm">Add Transaction</span>
                    </Link>
                </div>
            </nav>

            <div className="mt-auto">
                <button className="flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl text-muted-foreground hover:bg-white/5 hover:text-rose-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Log Out</span>
                </button>
            </div>
        </aside>
    )
}
