import Link from 'next/link';
import { Construction } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

type ComingSoonProps = {
  title: string;
  description?: string;
};

// Placeholder para páginas que ainda não foram implementadas
export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <section className="container mx-auto flex flex-col items-center gap-4 px-4 py-24 text-center">
      <div className="rounded-2xl bg-brand-light p-4 text-brand-muted">
        <Construction className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
      <p className="max-w-md text-sm text-slate-600 sm:text-base">
        {description ?? 'Esta página está em construção. Volte em breve!'}
      </p>
      <Link
        href={ROUTES.home}
        className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
      >
        Voltar para o início
      </Link>
    </section>
  );
}
