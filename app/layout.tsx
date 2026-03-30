import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthGuard from "./AuthGuard"; // Kalkanı import ettik

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Birikiton Üretim Ağı",
  description: "Merkezi Stok ve Proje Yönetim Sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {/* Tüm sistemi kalkanın içine aldık */}
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}