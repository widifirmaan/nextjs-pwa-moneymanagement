import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/db"

const DEV_BYPASS_AUTH =
    process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true" ||
    process.env.DEV_SKIP_AUTH === "true"

const googleClientId =
    process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID ?? process.env.GOOGLE_ID
const googleClientSecret =
    process.env.AUTH_GOOGLE_SECRET ??
    process.env.GOOGLE_CLIENT_SECRET ??
    process.env.GOOGLE_SECRET

if (!DEV_BYPASS_AUTH && (!googleClientId || !googleClientSecret)) {
    throw new Error(
        "Google OAuth client ID/secret is missing. Set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET (or GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET) in env."
    )
}

const providers = []

if (DEV_BYPASS_AUTH) {
    providers.push(
        Credentials({
            id: "dev-credentials",
            name: "Dev user login",
            credentials: {},
            authorize: async () => {
                return {
                    id: "dev-user-id",
                    name: "Dev User",
                    email: "dev@localhost",
                }
            },
        })
    )
}

if (googleClientId && googleClientSecret) {
    providers.push(
        Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
        })
    )
}

const nextAuth = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers,
    trustHost: true, // Tambahkan ini agar Auth.js otomatis mendeteksi host di Vercel
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id
                session.user.colorScheme = (user as any).colorScheme || "dark"
            }
            return session
        },
    },
})

export const { handlers, signIn, signOut } = nextAuth

export async function auth() {
    if (DEV_BYPASS_AUTH) {
        return {
            user: {
                id: "dev-user-id",
                name: "Dev User",
                email: "dev@localhost",
            },
            expires: new Date(Date.now() + 3600 * 1000).toISOString(),
        } as any
    }

    return nextAuth.auth()
}
