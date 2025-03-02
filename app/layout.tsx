"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading"; // Import your spinner component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Detect page changes

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // Delay for smooth transition
    return () => clearTimeout(timeout);
  }, [pathname]); // Run effect when pathname changes

  return (
    <html lang="en">
      <body>
        {loading && <Loading />}
        {children}
      </body>
    </html>
  );
}
