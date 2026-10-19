import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PointCapacityRules } from '@/components/ponto/capacidade-regras-ponto';
import { PointReviews } from '@/components/ponto/avaliacoes-ponto';
import { PointHeader } from '@/components/ponto/cabecalho-ponto';
import { PointDestination } from '@/components/ponto/destinacao-ponto';
import { PointHours } from '@/components/ponto/horarios-ponto';
import { PointAdditionalInfo } from '@/components/ponto/informacoes-adicionais-ponto';
import { AcceptedItems } from '@/components/ponto/itens-aceitos-ponto';
import { PointLocation } from '@/components/ponto/localizacao-ponto';
import { RegistrationSuggestionForm } from '@/components/ponto/formulario-sugestao-cadastral';
import { findPointBySlug } from '@/utils/pontos';

type PointPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PointPageProps): Promise<Metadata> {
  const { id } = await params;
  const point = await findPointBySlug(id);

  if (!point) {
    return { title: 'Ponto não encontrado | EcoPonto' };
  }

  const description = `${point.description} Endereço: ${point.address.street}, ${point.address.number}, ${point.address.neighborhood}, ${point.address.city} - ${point.address.state}.`;

  return {
    title: `${point.name} | EcoPonto`,
    description,
    openGraph: {
      title: `${point.name} | EcoPonto`,
      description,
      type: 'website',
      images: [point.mainImage],
    },
  };
}

export default async function PointPage({ params }: PointPageProps) {
  const { id } = await params;
  const point = await findPointBySlug(id);

  if (!point) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PointHeader point={point} />

      <PointLocation point={point} />

      <PointAdditionalInfo additionalInfo={point.additionalInfo} />

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <PointHours schedules={point.schedules} />
        <PointCapacityRules capacity={point.capacity} rules={point.rules} />
      </div>

      <AcceptedItems
        items={point.acceptedItems}
        categories={point.categories}
      />

      <PointDestination destination={point.destination} />

      <RegistrationSuggestionForm pointName={point.name} />

      <PointReviews reviews={point.reviews} pointName={point.name} />
    </div>
  );
}
