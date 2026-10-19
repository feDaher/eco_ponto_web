import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export default function PointNotFound() {
  return (
    <section className="container mx-auto flex min-h-[50vh] max-w-2xl flex-col items-start justify-center px-4 py-16">
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 text-sm font-medium text-brand-dark">
        <MapPin aria-hidden="true" className="size-4" />
        Erro 404 · Ponto não encontrado
      </span>

      <h1 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">
        Não encontramos esse ponto de coleta.
      </h1>
      <p className="mt-3 max-w-lg text-slate-600">
        O endereço pode estar incorreto ou o ponto não está mais disponível.
        Confira o link ou procure outro ponto no mapa.
      </p>

      <Link
        href={ROUTES.map}
        className="mt-7 inline-flex min-h-10 items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Ver pontos de coleta
      </Link>
    </section>
  );
}
