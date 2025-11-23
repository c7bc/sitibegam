import type { Metadata } from "next";
import { Baskervville, Lato } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const baskervville = Baskervville({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-baskervville",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "SITIBEGAM - Sindicato dos Trabalhadores de Bebidas em Geral",
  description: "SITIBEGAM - Sindicato dos Trabalhadores de Bebidas em Geral - Página Inicial",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${baskervville.variable} ${lato.variable} font-sans antialiased`}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
