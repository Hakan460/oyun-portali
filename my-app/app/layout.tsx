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
  title: "PORTAL X | Yeni Nesil Web & Unity WebGL Oyun Portalı",
  description: "En popüler Unity WebGL ve 3D tarayıcı oyunlarını ücretsiz oyna. İndirme yok, kurulum yok, kesintisiz 60 FPS oyun deneyimi!",
  keywords: ["oyun portalı", "unity webgl oyunları", "online oyunlar", "3d tarayıcı oyunları", "ücretsiz oyunlar"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#08090d] text-zinc-100">{children}</body>
    </html>
  );
}

