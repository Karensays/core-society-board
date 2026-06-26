import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Police unique du projet — Poppins (CLAUDE.md section 2). Zéro autre police.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Core Society Board",
  description: "Tableau de bord de pilotage interne — Core Society",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={poppins.variable}>
      <body className="bg-page text-ink">{children}</body>
    </html>
  );
}
