import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/context/StoreContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";
import MobileLayout from "@/components/layout/MobileLayout";
import { BottomNav } from "@/components/BottomNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { InstallPrompt } from "@/components/InstallPrompt";
import Providers from "@/components/Providers";
import AuthWrapper from "@/components/AuthWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  viewportFit: 'cover',
  themeColor: '#09090b',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://money.widifirmaan.web.id'),
  title: {
    default: "MoneW - Smart Money Management",
    template: "%s | MoneW",
  },
  description: "Personal finance Progressive Web App for tracking multi-wallet balances, expenses, receipts, spending limits, and saved cards.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://money.widifirmaan.web.id/",
    siteName: "MoneW",
    title: "MoneW - Smart Money Management",
    description: "Track multi-wallet balances, expenses, receipt images, spending limits, and saved cards across devices.",
    images: ["/monew-logo.png"],
  },
  twitter: {
    card: "summary",
    title: "MoneW - Smart Money Management",
    description: "Track multi-wallet balances, expenses, receipt images, spending limits, and saved cards across devices.",
    images: ["/monew-logo.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: '/monew-logo.png',
    shortcut: '/monew-logo.png',
    apple: '/monew-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthWrapper>
            <ThemeProvider>
              <StoreProvider>
                <MobileLayout>
                  <DesktopSidebar />
                  {children}
                  <BottomNav />
                  <InstallPrompt />
                </MobileLayout>
              </StoreProvider>
            </ThemeProvider>
          </AuthWrapper>
        </Providers>
      </body>
    </html>
  );
}
