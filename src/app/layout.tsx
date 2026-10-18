import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TRIDENTE Perfumería — Tu esencia. Tu presencia.",
  description:
    "TRIDENTE Perfumería. Prototipo de experiencia visual en desarrollo.",
};

export const viewport: Viewport = {
  themeColor: "#060507",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${cormorant.variable} ${manrope.variable} antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
