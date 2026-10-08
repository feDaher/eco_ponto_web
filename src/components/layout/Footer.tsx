import Image from 'next/image';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { ROUTES, type NavItem } from '@/lib/routes';

type FooterGroup = {
  title: string;
  links: NavItem[];
};

// TODO: as páginas institucionais e legais ainda não existem (retornam 404)
const footerGroups: FooterGroup[] = [
  {
    title: 'Navegação',
    links: [
      { label: 'Início', href: ROUTES.home },
      { label: 'Encontrar Pontos', href: ROUTES.map },
      { label: 'Aprender & Dicas', href: ROUTES.education },
      { label: 'Métricas de Impacto', href: ROUTES.account },
    ],
  },
  {
    title: 'Institucional',
    links: [
      { label: 'Sobre a Iniciativa', href: '/sobre' },
      { label: 'Cooperativas Parceiras', href: '/cooperativas' },
      { label: 'Fale Conosco', href: '/contato' },
      // Oculto a pedido do Felipe, descomentar se formos utilizar
      // { label: 'Relatório de Sustentabilidade', href: '/relatorio' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Política de Privacidade', href: '/privacidade' },
      { label: 'Termos de Uso', href: '/termos' },
      { label: 'Política de Cookies', href: '/cookies' },
      { label: 'Conformidade LGPD', href: '/lgpd' },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 bg-surface-alt px-6 pt-12 pb-6 text-slate-700 md:px-16">
      <div className="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4">
        {/* Logo e descrição */}
        <div className="flex flex-col items-center space-y-4 text-center sm:items-start sm:text-left">
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2 text-xl font-bold text-brand"
          >
            <Image
              src="/icons/logo.png"
              alt=""
              width={28}
              height={25}
              className="h-auto w-8"
            />
            <span>EcoPonto</span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-slate-600">
            Promovendo o descarte consciente e a reciclagem de lixo eletrônico
            para proteger os ecossistemas urbanos e rurais do Brasil.
          </p>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title} className="text-center sm:text-left">
            <h3 className="mb-4 text-xs font-semibold tracking-wider text-slate-900 uppercase">
              {group.title}
            </h3>
            <nav aria-label={`${group.title} (rodapé)`}>
              <ul className="space-y-2.5 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-slate-900 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-slate-300/60 pt-6 text-center text-xs text-slate-600 sm:flex-row sm:text-left">
        <p>© {currentYear} EcoPonto. Todos os direitos reservados.</p>
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <Globe className="h-4 w-4 text-slate-600" />
          <span>Manhuaçu, MG</span>
        </div>
      </div>
    </footer>
  );
}
