import { ColorScheme } from "@/lib/types"

declare module "next-auth" {
    interface User {
        colorScheme?: ColorScheme;
        expenseLimits?: {
            daily: number;
            weekly: number;
            monthly: number;
        };
    }

    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            colorScheme?: ColorScheme;
            expenseLimits?: {
                daily: number;
                weekly: number;
                monthly: number;
            };
        }
    }
}
