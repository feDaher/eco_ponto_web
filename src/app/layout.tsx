import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'EcoPonto Digital',
  description:
    'Encontre pontos de coleta de resíduos recicláveis e eletrônicos perto de você.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Header />
        {/* Cada página controla a própria largura (seções full-width ou container) */}
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
