"use client"
import { useSession } from "next-auth/react"
import Login from "@/app/login/page"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { status } = useSession();

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (status === "unauthenticated") {
        return <Login />;
    }

    return <>{children}</>;
}
