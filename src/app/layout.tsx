import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Everwood Cloud | Conversaciones y FAQs",
  description:
    "Plataforma cloud para carga de conversaciones historicas, metadatos, historial y sugerencias de FAQs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="app-shell">
          <header className="site-header">
            <div>
              <p className="eyebrow">Proyecto Integrador</p>
              <h1 className="site-title">Everwood Cloud</h1>
            </div>
            <nav className="nav-links">
              <Link href="/">Inicio</Link>
              <Link href="/historial">Historial</Link>
              <Link href="/metricas">Metricas</Link>
            </nav>
          </header>

          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
