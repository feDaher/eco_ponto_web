import { mockGuides } from '@/data/mockGuides';
import { getPoints } from '@/services/api';
import type { DisposalGuide, GuideCategory } from '@/types/education';

export async function getGuideSlugs(): Promise<string[]> {
  return mockGuides.map((guide) => guide.slug);
}

export async function getGuideBySlug(
  slug: string
): Promise<DisposalGuide | null> {
  return mockGuides.find((guide) => guide.slug === slug) ?? null;
}

export async function getGuideCategories(): Promise<GuideCategory[]> {
  return Promise.all(
    mockGuides.map(async ({ slug, label, icon, material }) => {
      const points = await getPoints({ materials: [material] });
      return { slug, label, icon, pointCount: points.length };
    })
  );
}
