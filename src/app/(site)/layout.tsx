import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>

      <Footer />
    </>
  );
}
