"use client"

export default function MobileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            <div className="w-full min-h-screen relative pb-24 md:pb-0 md:pl-72 transition-all duration-300">
                {children}
            </div>
        </div>
    )
}
