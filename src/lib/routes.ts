// Fonte única das rotas da aplicação: use sempre estas constantes em vez de
// escrever o caminho "na mão" nos componentes.
export const ROUTES = {
  home: '/',
  map: '/map',
  education: '/education',
  account: '/account',
  login: '/login',
  register: '/register',
  admin: '/admin',
} as const;

// Âncoras das seções da home (usadas em `id` e nos links `#...`)
export const HOME_SECTIONS = {
  howItWorks: 'how-it-works',
  map: 'map',
  education: 'education',
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
