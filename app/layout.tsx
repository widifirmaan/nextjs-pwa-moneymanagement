import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/context/StoreContext";
import "./globals.css";
import MobileLayout from "@/components/layout/MobileLayout";
import { BottomNav } from "@/components/BottomNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoneyFlow",
  description: "Financial management app",
  manifest: "/manifest.json",
  viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover",
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <StoreProvider>
          <MobileLayout>
            <DesktopSidebar />
            {children}
            <BottomNav />
          </MobileLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
