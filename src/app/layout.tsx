import type { Metadata, Viewport } from "next";
import { BUSINESS } from "@/config/business";
import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import Header from "@/layouts/header/Header";
import Footer from "@/layouts/footer/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: BUSINESS.name, template: `%s | ${BUSINESS.name}` },
  description: BUSINESS.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: BUSINESS.name,
    title: BUSINESS.name,
    description: BUSINESS.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
