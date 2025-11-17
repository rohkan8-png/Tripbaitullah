import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UmrahKu - Temukan Paket Umroh Terbaik",
  description: "Aplikasi web untuk menemukan paket umroh dari berbagai travel penyelenggara terpercaya. Nikmati kemudahan memilih paket umroh sesuai kebutuhan Anda.",
  keywords: ["umroh", "travel umroh", "paket umroh", "haji", "ibadah", "muslim", "travel"],
  authors: [{ name: "UmrahKu Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "UmrahKu - Temukan Paket Umroh Terbaik",
    description: "Aplikasi web untuk menemukan paket umroh dari berbagai travel penyelenggara terpercaya",
    url: "https://umrahku.com",
    siteName: "UmrahKu",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UmrahKu - Temukan Paket Umroh Terbaik",
    description: "Aplikasi web untuk menemukan paket umroh dari berbagai travel penyelenggara terpercaya",
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
        <Toaster />
      </body>
    </html>
  );
}
