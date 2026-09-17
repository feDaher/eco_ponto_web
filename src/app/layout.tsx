import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EcoPonto Digital",
  description: "Find collection points for recyclable and electronic waste near you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
