import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "SION Ads — Vos pubs Meta, de l'idée au lancement", template: "%s · SION Ads" },
  description:
    "Analyse de marché, copies, prompts créatifs et campagnes Meta CBO en quelques minutes. Pensé pour le e-commerce africain : FCFA, Mobile Money, paiement à la livraison.",
};

export const viewport: Viewport = { themeColor: "#0b0c0e" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
