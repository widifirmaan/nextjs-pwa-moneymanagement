"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wallet, Plus, PieChart, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
    const pathname = usePathname()

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Wallet, label: 'Wallet', href: '/wallets' },
    ]
    const navItems2 = [
        { icon: PieChart, label: 'Stats', href: '/stats' },
        { icon: User, label: 'Profile', href: '/profile' },
    ]

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="w-full max-w-md bg-background/90 backdrop-blur-xl border-t border-white/5 px-6 py-3 flex items-center justify-between pointer-events-auto pb-6">
                {navItems.map((item) => (
                    <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 group w-12">
                        <item.icon className={cn("w-6 h-6 transition-colors", pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-primary/70")} />
                        <span className={cn("text-[10px] font-medium transition-colors", pathname === item.href ? "text-primary" : "text-muted-foreground")}>{item.label}</span>
                    </Link>
                ))}

                <div className="relative -top-8 text-center p-1 rounded-full bg-background border-4 border-background">
                    <Link href="/add" className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95 transition-transform">
                        <Plus className="w-8 h-8" />
                    </Link>
                </div>

                {navItems2.map((item) => (
                    <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 group w-12">
                        <item.icon className={cn("w-6 h-6 transition-colors", pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-primary/70")} />
                        <span className={cn("text-[10px] font-medium transition-colors", pathname === item.href ? "text-primary" : "text-muted-foreground")}>{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
