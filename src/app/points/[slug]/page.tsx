import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AcceptedItems } from '@/components/point/AcceptedItems';
import { PointAdditionalInfo } from '@/components/point/PointAdditionalInfo';
import { PointCapacityRules } from '@/components/point/PointCapacityRules';
import { PointDestination } from '@/components/point/PointDestination';
import { PointHeader } from '@/components/point/PointHeader';
import { PointHours } from '@/components/point/PointHours';
import { PointLocation } from '@/components/point/PointLocation';
import { PointReviews } from '@/components/point/PointReviews';
import { SuggestionForm } from '@/components/point/SuggestionForm';
import { VerificationNotice } from '@/components/point/VerificationNotice';
import { averageRating } from '@/lib/points';
import { getPointBySlug } from '@/services/api';
import type { PointDetails, Weekday } from '@/types/api';

const getPoint = cache(getPointBySlug);

const SCHEMA_DAYS: Record<Weekday, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

type PointPageProps = {
  params: Promise<{ slug: string }>;
};

function getDescription(point: PointDetails) {
  return `${point.description} Endereço: ${point.address} - ${point.neighborhood}, ${point.city}.`;
}

function buildJsonLd(point: PointDetails) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RecyclingCenter',
    name: point.name,
    description: point.description,
    image: point.imageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: point.address,
      addressLocality: point.city,
      postalCode: point.cep,
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: point.lat,
      longitude: point.lng,
    },
    openingHoursSpecification: point.schedule.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.weekdays.map((day) => SCHEMA_DAYS[day]),
      opens: hours.opens,
      closes: hours.closes,
    })),
    aggregateRating:
      point.reviews.length > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: averageRating(point.reviews).toFixed(1),
            reviewCount: point.reviews.length,
          }
        : undefined,
  };
}

export async function generateMetadata({
  params,
}: PointPageProps): Promise<Metadata> {
  const { slug } = await params;
  const point = await getPoint(slug);

  if (!point) {
    return {
      title: 'Ponto não encontrado | EcoPonto',
      robots: { index: false },
    };
  }

  const title = `${point.name} | EcoPonto`;
  const description = getDescription(point);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
      images: point.imageUrl ? [point.imageUrl] : undefined,
    },
  };
}

export default async function PointPage({ params }: PointPageProps) {
  const { slug } = await params;
  const point = await getPoint(slug);

  if (!point) notFound();

  return (
    <div className="bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(point)).replace(/</g, '\\u003c'),
        }}
      />

      <div className="container mx-auto space-y-6 px-4 py-8 md:py-12">
        <PointHeader point={point} />
        <VerificationNotice verification={point.verification} />
        <PointLocation point={point} />
        <PointAdditionalInfo info={point.additionalInfo} />

        <div className="grid items-start gap-6 lg:grid-cols-2">
          <PointHours
            schedule={point.schedule}
            closedOnHolidays={point.closedOnHolidays}
          />
          <PointCapacityRules capacity={point.capacity} rules={point.rules} />
        </div>

        <AcceptedItems
          items={point.acceptedItems}
          materials={point.materials}
        />
        <PointDestination destination={point.destination} />
        <PointReviews reviews={point.reviews} pointName={point.name} />
        <SuggestionForm pointName={point.name} />
      </div>
    </div>
  );
}
