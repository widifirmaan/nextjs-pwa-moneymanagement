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
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  maximumScale: 1,
  width: 'device-width',
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#09090b',
};

export const metadata: Metadata = {
  title: "MoneW - Smart Finance",
  description: "Modern Money Management App",
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
