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
            <div className="w-full max-w-md bg-background/95 backdrop-blur-xl border-t border-border px-6 py-3 flex items-center justify-between pointer-events-auto pb-6 shadow-[0_-5px_30px_-10px_rgba(0,0,0,0.1)]">
                {navItems.map((item) => (
                    <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 group w-12 pt-2">
                        <item.icon className={cn("w-6 h-6 transition-colors", pathname === item.href ? "text-primary fill-current" : "text-muted-foreground group-hover:text-primary/70")} />
                        <span className={cn("text-[10px] font-medium transition-colors", pathname === item.href ? "text-primary" : "text-muted-foreground")}>{item.label}</span>
                    </Link>
                ))}

                <div className="relative -top-8 text-center p-1.5 rounded-full bg-background/20 backdrop-blur-sm">
                    <Link href="/add" className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-transform ring-4 ring-background">
                        <Plus className="w-8 h-8" />
                    </Link>
                </div>

                {navItems2.map((item) => (
                    <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 group w-12 pt-2">
                        <item.icon className={cn("w-6 h-6 transition-colors", pathname === item.href ? "text-primary fill-current" : "text-muted-foreground group-hover:text-primary/70")} />
                        <span className={cn("text-[10px] font-medium transition-colors", pathname === item.href ? "text-primary" : "text-muted-foreground")}>{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
