import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Debajit Goswami — Founder & CEO | Singularity Horizon Technologies Pvt. Ltd.",
  description: "Official portfolio of Debajit Goswami, Founder & CEO of Singularity Horizon Technologies Pvt. Ltd. Engineering OrionHelix AI — the Multiverse of Artificial Intelligence.",
};

import OrionHelixAssistant from "@/components/ai/OrionHelixAssistant";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
          {children}
          <OrionHelixAssistant />
      </body>
    </html>
  );
}
