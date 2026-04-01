"use client"
import { useSession } from "next-auth/react"
import Login from "@/app/login/page"

const isDevBypass =
    process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true" &&
    (typeof window !== "undefined" &&
        ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname))

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { status } = useSession();

    if (isDevBypass) {
        return <>{children}</>
    }

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (status === "unauthenticated") {
        return <Login />
    }

    return <>{children}</>
}
