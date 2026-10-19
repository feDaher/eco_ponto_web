import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function PointNotFound() {
  // Página exibida quando o ponto de coleta não é encontrado
  return (
    // centralizar o conteúdo e mostra as mensagens
    <section className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-start justify-center py-16">
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900">
        <MapPin aria-hidden="true" className="size-4" />
        Erro 404 · Ponto não encontrado
      </span>

      <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">
        Não encontramos esse ponto de coleta.
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        O endereço pode estar incorreto ou o ponto não está mais disponível.
        Confira o link ou volte ao início para continuar navegando.
      </p>

      <Link
        href="/"
        className="mt-7 inline-flex min-h-10 items-center gap-2 rounded-md bg-emerald-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-900"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Voltar ao início
      </Link>
    </section>
  );
}
