import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, MapPin } from 'lucide-react';
import { GuideCta } from '@/components/education/GuideCta';
import { pluralize } from '@/lib/points';
import { ROUTES } from '@/lib/routes';
import { getGuideCategories } from '@/services/education';

const title = 'Aprender & Dicas | EcoPonto';
const description =
  'Guias de descarte correto por categoria de resíduo, com os pontos de coleta de Manhuaçu que recebem cada material.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: 'website', locale: 'pt_BR' },
};

export default async function EducationPage() {
  const guides = await getGuideCategories();

  return (
    <div className="bg-surface">
      <div className="container mx-auto space-y-12 px-4 py-8 md:py-12">
        <header className="max-w-3xl space-y-3">
          <p className="text-xs font-bold tracking-wider text-brand uppercase">
            Aprender & Dicas
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
            Guias de descarte por categoria
          </h1>
          <p className="leading-relaxed text-slate-600 lg:text-lg">
            Escolha o tipo de resíduo para ver como preparar, o que é aceito e
            onde entregar em Manhuaçu.
          </p>
        </header>

        <section aria-labelledby="guides-heading" className="space-y-4">
          <h2 id="guides-heading" className="sr-only">
            Guias disponíveis
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={ROUTES.educationCategory(guide.slug)}
                  className="group flex h-full flex-col gap-4 rounded-3xl border border-slate-100 bg-card p-6 shadow-sm transition-colors hover:border-brand-medium focus-visible:outline-2 focus-visible:outline-brand"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-light text-brand-muted">
                    <guide.icon aria-hidden="true" className="size-6" />
                  </span>
                  <span className="space-y-2">
                    <span className="block text-lg font-semibold text-slate-900">
                      {guide.label}
                    </span>
                    <span className="block text-sm leading-relaxed text-slate-600">
                      {guide.description}
                    </span>
                  </span>
                  <span className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <BookOpen aria-hidden="true" className="size-3.5" />
                      Leitura de {guide.readingMinutes} min
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin aria-hidden="true" className="size-3.5" />
                      {pluralize(
                        guide.pointCount,
                        'ponto de coleta',
                        'pontos de coleta'
                      )}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                    Ler guia
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <GuideCta />
      </div>
    </div>
  );
}
