import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderDev from "@/components/header-dev";
import ConvexClientProvider from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AImage - Biblioteca de Prompts y Generador de Imágenes AI",
  description:
    "Explora y edita los prompts mas populares del momento para transformar tus fotos en estilos únicos (anime, cartoon, realista y más). Genera imágenes al instante o guarda tus favoritos. Powered by AI.",
  keywords: [
    "AI prompts",
    "prompt library",
    "image generator",
    "anime AI",
    "cartoon AI",
    "AI art",
    "LuisRoftl",
  ],
  authors: [{ name: "LuisRoftl", url: "https://luisroftl.vercel.app" }],
  openGraph: {
    title: "AImage - Biblioteca y Generador de Imágenes AI",
    description:
      "Convierte tus fotos en estilos sorprendentes con prompts listos para usar. Biblioteca gratis + generación de imágenes directa con IA.",
    url: "https://aimage.vercel.app",
    siteName: "AImage",
    images: [
      {
        url: "https://aimage.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "AImage - Biblioteca y Generador de Imágenes AI",
      },
    ],
    locale: "es_ES",
    type: "website",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-h-screen`}
      >
        <div className="fixed left-0 top-0 -z-10 h-full w-full">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
          </div>
        </div>
        <div className="relative mx-auto h-screen w-full max-w-7xl px-6 md:px-8 lg:px-12">
          <ClerkProvider
            appearance={{
              baseTheme: shadcn,
              layout: { logoImageUrl: "./ia-logo.png" },
            }}
          >
            <ConvexClientProvider>
              <HeaderDev />
              {children}
            </ConvexClientProvider>
          </ClerkProvider>
        </div>
      </body>
    </html>
  );
}
