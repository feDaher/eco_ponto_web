import Link from 'next/link';
import { Compass, Leaf, UserPlus } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export function GuideCta() {
  return (
    <section
      aria-labelledby="guide-cta-heading"
      className="rounded-3xl bg-gradient-to-r from-surface-strong via-surface-alt to-brand-light p-6 sm:p-8 lg:p-12"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-6">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand-solid text-white">
            <Leaf aria-hidden="true" className="size-8" />
          </span>
          <div className="max-w-md space-y-2">
            <p className="text-xs font-bold tracking-wider text-brand uppercase">
              Cidadania e meio ambiente
            </p>
            <h2
              id="guide-cta-heading"
              className="text-2xl font-bold text-slate-900 lg:text-3xl"
            >
              Faça parte do EcoPonto
            </h2>
            <p className="leading-relaxed text-slate-600">
              Crie sua conta gratuita para acompanhar os pontos de coleta de
              Manhuaçu e as novidades da plataforma.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={ROUTES.register}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-solid px-6 py-3.5 font-medium text-white shadow-sm transition-colors hover:bg-brand-solid-hover"
          >
            <UserPlus aria-hidden="true" className="size-4" />
            Criar conta gratuita
          </Link>
          <Link
            href={ROUTES.map}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-card px-6 py-3.5 font-medium text-slate-900 transition-colors hover:bg-brand-light"
          >
            <Compass aria-hidden="true" className="size-5 text-brand" />
            Localizar no mapa
          </Link>
        </div>
      </div>
    </section>
  );
}
