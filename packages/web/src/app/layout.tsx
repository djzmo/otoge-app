import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import BottomTabs from "@/components/BottomTabs";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "otoge.app",
    template: "%s | otoge.app",
  },
  description:
    "Find rhythm game arcades near you with otoge.app. Discover locations with beatmania IIDX, maimai DX, CHUNITHM, DDR, and more.",
  keywords: [
    "arcade",
    "rhythm games",
    "beatmania",
    "maimai",
    "chunithm",
    "ddr",
    "sound voltex",
    "jubeat",
  ],
  authors: [{ name: "djzmo" }],
  creator: "djzmo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://otoge.app",
    siteName: "otoge.app",
    title: "otoge.app - Find rhythm game arcades near you",
    description:
      "Discover arcade locations with your favorite rhythm games including beatmania IIDX, maimai DX, CHUNITHM, DDR, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "otoge.app - Find rhythm game arcades near you",
    description:
      "Discover arcade locations with your favorite rhythm games including beatmania IIDX, maimai DX, CHUNITHM, DDR, and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ErrorBoundary>
          {children}
          <BottomTabs />
        </ErrorBoundary>
      </body>
    </html>
  );
}
