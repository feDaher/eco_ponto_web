import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuideCategoryNav } from '@/components/education/GuideCategoryNav';
import { GuideCta } from '@/components/education/GuideCta';
import { GuideFaq } from '@/components/education/GuideFaq';
import { GuideHeader } from '@/components/education/GuideHeader';
import { GuideImpact } from '@/components/education/GuideImpact';
import { GuideLocations } from '@/components/education/GuideLocations';
import { GuideSorting } from '@/components/education/GuideSorting';
import { GuideSteps } from '@/components/education/GuideSteps';
import { getPoints } from '@/services/api';
import {
  getGuideBySlug,
  getGuideCategories,
  getGuideSlugs,
} from '@/services/education';

const getGuide = cache(getGuideBySlug);

type EducationCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const slugs = await getGuideSlugs();
  return slugs.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: EducationCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const guide = await getGuide(category);

  if (!guide) {
    return {
      title: 'Guia não encontrado | EcoPonto',
      robots: { index: false },
    };
  }

  const title = `${guide.title} | EcoPonto`;

  return {
    title,
    description: guide.description,
    openGraph: {
      title,
      description: guide.description,
      type: 'article',
      locale: 'pt_BR',
    },
  };
}

export default async function EducationCategoryPage({
  params,
}: EducationCategoryPageProps) {
  const { category } = await params;
  const guide = await getGuide(category);

  if (!guide) notFound();

  const [categories, points] = await Promise.all([
    getGuideCategories(),
    getPoints({ materials: [guide.material] }),
  ]);

  return (
    <div className="bg-surface">
      <div className="container mx-auto space-y-12 px-4 py-8 md:py-12">
        <GuideCategoryNav categories={categories} activeSlug={guide.slug} />
        <GuideHeader guide={guide} pointCount={points.length} />
        <GuideSteps steps={guide.steps} />
        <GuideSorting sorting={guide.sorting} />
        <GuideImpact impact={guide.impact} />
        <GuideLocations heading={guide.locations} points={points} />
        <GuideFaq faq={guide.faq} />
        <GuideCta />
      </div>
    </div>
  );
}
