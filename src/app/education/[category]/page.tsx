import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { notFound } from 'next/navigation';

import { CategoryStrip } from '@/components/educacao/faixa-categorias';
import { AcceptedVsNotAccepted } from '@/components/educacao/guia/aceito-vs-nao-aceito';
import { AccreditedLocations } from '@/components/educacao/guia/locais-credenciados';
import { EnvironmentalImpact } from '@/components/educacao/guia/impacto-ambiental';
import { EsgCta } from '@/components/educacao/guia/cta-esg';
import { GuideFaq } from '@/components/educacao/guia/faq-guia';
import { GuideHeader } from '@/components/educacao/guia/cabecalho-guia';
import { StepByStep } from '@/components/educacao/guia/passo-a-passo';
import { findGuideBySlug } from '@/utils/guias';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const guide = await findGuideBySlug(category);

  if (!guide) {
    return { title: 'Guia não encontrado | EcoPonto' };
  }

  return {
    title: `${guide.tituloH1} | EcoPonto`,
    description: guide.subtitulo,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const guide = await findGuideBySlug(category);

  if (!guide) {
    notFound();
  }

  return (
    <div
      className={`${manrope.variable} space-y-2 bg-[#F8F9FF] [font-family:var(--font-manrope)]`}
    >
      <GuideHeader guide={guide} />
      <CategoryStrip categories={guide.categorias} activeSlug={guide.slug} />
      <StepByStep steps={guide.passos} />
      <AcceptedVsNotAccepted sorting={guide.triagem} />
      <EnvironmentalImpact impact={guide.impacto} />
      <AccreditedLocations locations={guide.locais} />
      <GuideFaq items={guide.faq} />
      <EsgCta cta={guide.ctaEsg} />
    </div>
  );
}
