import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const accentItalic = Instrument_Serif({
  variable: "--font-accent-italic",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const corps = IBM_Plex_Sans({
  variable: "--font-corps",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Chatllow — Diagnostic IA pour décideurs",
  description:
    "Le premier cas d'usage IA qui mérite d'être lancé, identifié en autonomie. Diagnostic gratuit pour dirigeants et décideurs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${corps.variable} ${mono.variable} ${accentItalic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
