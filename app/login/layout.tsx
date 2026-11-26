import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in or create your MoneW personal finance account.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    url: "https://money.widifirmaan.web.id/login",
    title: "Sign In | MoneW",
    description: "Sign in or create your MoneW personal finance account.",
    images: ["/monew-logo.png"],
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
