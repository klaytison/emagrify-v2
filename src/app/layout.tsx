import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "../lib/fonts";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SupabaseProvider } from "@/providers/SupabaseProvider";
import { Toaster } from "@/components/ui/use-toast"; // 🟩 Toasts do Shadcn

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emagrify - Transforme seu corpo e sua vida",
  description:
    "Plataforma completa para perda de peso, ganho de massa muscular e transformação de vida com dietas personalizadas, treinos e acompanhamento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script src="/lasy-bridge.js" strategy="beforeInteractive" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Tema global + Supabase */}
        <ThemeProvider>
          <SupabaseProvider>
            {children}

            {/* 🟩 Toasts globais funcionando no app inteiro */}
            <Toaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
