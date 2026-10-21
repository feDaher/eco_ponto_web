import type { UserRole } from '@/types/user';

// Fonte única das rotas da aplicação: use sempre estas constantes em vez de
// escrever o caminho "na mão" nos componentes.
export const ROUTES = {
  home: '/',
  map: '/map',
  education: '/education',
  educationCategory: (slug: string) => `/education/${slug}`,
  account: '/account',
  login: '/login',
  register: '/register',
  admin: '/admin',
  adminPoints: '/admin/points',
  adminUsers: '/admin/users',
  adminCategories: '/admin/categories',
  collector: '/collector',
  point: (slug: string) => `/points/${slug}`,
} as const;

// Âncoras das seções da home (usadas em `id` e nos links `#...`)
export const HOME_SECTIONS = {
  howItWorks: 'how-it-works',
  map: 'map',
  education: 'education',
} as const;

export const GUIDE_SECTIONS = {
  steps: 'steps',
  sorting: 'sorting',
  impact: 'impact',
  locations: 'locations',
  faq: 'faq',
} as const;

export const COLLECTOR_SECTIONS = {
  overview: 'overview',
  receipt: 'receipt',
  history: 'history',
  point: 'point',
  hours: 'hours',
  categories: 'categories',
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: 'Início', href: ROUTES.home },
  { label: 'Locais de Coleta', href: ROUTES.map },
  { label: 'Aprender & Dicas', href: ROUTES.education },
  { label: 'Minha Conta', href: ROUTES.account },
];

export const HOME_BY_ROLE: Record<UserRole, string> = {
  ADMIN: ROUTES.admin,
  COLLECTOR: ROUTES.collector,
  CITIZEN: ROUTES.account,
};

export function safeRedirect(path: string | null | undefined) {
  return path && path.startsWith('/') && !path.startsWith('//') ? path : null;
}
