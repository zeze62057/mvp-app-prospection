import type { Metadata } from "next";
import { Fraunces, Public_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  // Base des URL absolues (OpenGraph, sitemap) : NEXT_PUBLIC_URL_SITE en
  // production, repli sur l'adresse Vercel actuelle.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_URL_SITE ?? "https://vivier-academies-zeze62057.vercel.app"
  ),
  title: {
    default: "Vivier Academies",
    template: "%s — Vivier Academies",
  },
  description: "Le vivier des talents IA francophones",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${publicSans.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
