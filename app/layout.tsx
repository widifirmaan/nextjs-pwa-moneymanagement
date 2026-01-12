import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/context/StoreContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";
import MobileLayout from "@/components/layout/MobileLayout";
import { BottomNav } from "@/components/BottomNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import Providers from "@/components/Providers";
import AuthWrapper from "@/components/AuthWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MoneW - Smart Finance",
  description: "Modern Money Management App",
  manifest: "/manifest.json",
  viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover",
  themeColor: "#09090b",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthWrapper>
            <ThemeProvider>
              <StoreProvider>
                <MobileLayout>
                  <DesktopSidebar />
                  {children}
                  <BottomNav />
                </MobileLayout>
              </StoreProvider>
            </ThemeProvider>
          </AuthWrapper>
        </Providers>
      </body>
    </html>
  );
}
