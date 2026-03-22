import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mohamed Mg - Game Accounts Store",
  description: "Your trusted source for premium game accounts. Browse PUBG, Fortnite, FIFA accounts and more.",
  keywords: ["Game Accounts", "PUBG", "Fortnite", "FIFA", "Gaming", "Account Store"],
  authors: [{ name: "Mohamed Mg" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Mohamed Mg - Game Accounts Store",
    description: "Your trusted source for premium game accounts",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
