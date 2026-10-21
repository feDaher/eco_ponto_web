import type { LucideIcon } from 'lucide-react';
import type { Material } from '@/types/api';

export type GuideTone = 'brand' | 'accent' | 'neutral';

export type GuideTag = {
  label: string;
  icon: LucideIcon;
  tone: GuideTone;
};

export type GuideSummaryStep = {
  title: string;
  text: string;
};

export type StepNoteTone = 'warning' | 'success' | 'neutral';

export type GuideStep = {
  title: string;
  icon: LucideIcon;
  description: string;
  note: {
    text: string;
    icon: LucideIcon;
    tone: StepNoteTone;
  };
};

export type SortingItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type SortingGroup = {
  title: string;
  description: string;
  items: SortingItem[];
};

export type ImpactStat = {
  value: string;
  label: string;
};

export type GuideFaqItem = {
  question: string;
  answer: string;
};

export type GuideSectionHeading = {
  eyebrow: string;
  title: string;
  description: string;
};

export type DisposalGuide = {
  slug: string;
  material: Material;
  label: string;
  icon: LucideIcon;
  title: string;
  highlight: string;
  description: string;
  updatedAt: string;
  readingMinutes: number;
  tags: GuideTag[];
  summary: {
    title: string;
    steps: GuideSummaryStep[];
  };
  steps: GuideSectionHeading & {
    reference: string;
    items: GuideStep[];
  };
  sorting: GuideSectionHeading & {
    accepted: SortingGroup;
    rejected: SortingGroup;
  };
  impact: {
    tag: string;
    title: string;
    description: string;
    stats: ImpactStat[];
    panel: {
      title: string;
      description: string;
    };
  };
  locations: GuideSectionHeading;
  faq: GuideSectionHeading & {
    items: GuideFaqItem[];
  };
};

export type GuideCategory = {
  slug: string;
  label: string;
  icon: LucideIcon;
  description: string;
  readingMinutes: number;
  pointCount: number;
};
