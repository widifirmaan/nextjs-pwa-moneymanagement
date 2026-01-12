"use client"
import React, { useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wallet, Plus, PieChart, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"

export function DesktopSidebar() {
    const pathname = usePathname()
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Gentler springs for the large sidebar
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useMotionTemplate`${mouseYSpring}deg`;
    const rotateY = useMotionTemplate`${mouseXSpring}deg`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Reduced rotation range for the large sidebar (max 5 degrees)
        const rX = (mouseY / height - 0.5) * 10 * -1;
        const rY = (mouseX / width - 0.5) * 10;

        x.set(rY);
        y.set(rX);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const navItems = [
        { icon: Home, label: 'Dashboard', href: '/' },
        { icon: Wallet, label: 'My Wallets', href: '/wallets' },
        { icon: PieChart, label: 'Analytics', href: '/stats' },
        { icon: User, label: 'Profile', href: '/profile' },
    ]

    return (
        <motion.aside
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="hidden md:flex flex-col w-80 h-[96vh] fixed left-4 top-[2vh] rounded-[32px] glass border-white/5 p-6 z-50 shadow-2xl group overflow-visible will-change-transform"
        >
            {/* 3D Glow Effect */}
            <div
                style={{
                    transform: "translateZ(30px)",
                    background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 60%)"
                }}
                className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay"
            />

            {/* Content Container with slight depth */}
            <div style={{ transform: "translateZ(20px)" }} className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-10 px-2 mt-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/30">
                        M
                    </div>
                    <div>
                        <h1 className="font-bold text-2xl tracking-tight text-white">MoneyFlow</h1>
                        <p className="text-sm text-white/50 font-medium">Finance Manager</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group/item",
                                pathname === item.href
                                    ? "bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/5"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", pathname === item.href ? "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "group-hover/item:text-blue-400 transition-colors")} />
                            <span className="font-semibold text-[15px]">{item.label}</span>
                        </Link>
                    ))}

                    <div className="pt-6 mt-6 border-t border-white/5">
                        <Link
                            href="/add"
                            className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white hover:scale-[1.02] transition-all group/btn border border-white/10 shadow-lg shadow-blue-900/20 backdrop-blur-xl"
                        >
                            <div className="p-1 rounded-full bg-white/20 text-white">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-[15px]">Add Transaction</span>
                        </Link>
                    </div>
                </nav>

                <div className="mt-auto">
                    <button className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-white/60 hover:bg-white/5 hover:text-red-400 transition-colors group/logout">
                        <LogOut className="w-6 h-6 group-hover/logout:drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
                        <span className="font-semibold text-[15px]">Log Out</span>
                    </button>
                </div>
            </div>
        </motion.aside>
    )
}
