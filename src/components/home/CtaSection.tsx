'use client';
import Image from 'next/image';
import Link from 'next/link';
import { UserPlus, MapPin, UserCheck, ShieldCheck } from 'lucide-react';
import { HOME_BY_ROLE, HOME_SECTIONS, ROUTES } from '@/lib/routes';
import { useAuth } from '@/context/AuthContext';

export const CtaSection = () => {
  const { status, user } = useAuth();

  const isAuthenticated = status === 'authenticated' && Boolean(user);
  const isStaff = isAuthenticated && user?.role !== 'CITIZEN';

  const getCtaContent = () => {
    if (!isAuthenticated || !user) {
      return {
        title: 'Pronto para fazer a diferença pelo meio ambiente?',
        description:
          'Junte-se a centenas de moradores de Manhuaçu. Cadastre-se gratuitamente, registre suas entregas e transforme lixo eletrônico em preservação real.',
        primaryHref: ROUTES.register,
        primaryLabel: 'Criar Conta Gratuita',
        PrimaryIcon: UserPlus,
      };
    }

    if (user.role === 'ADMIN') {
      return {
        title: 'Painel Administrativo do EcoPonto',
        description:
          'Você está conectado como Administrador. Acesse sua área de gestão para moderar avaliações, gerenciar pontos de coleta e acompanhar o sistema.',
        primaryHref: HOME_BY_ROLE.ADMIN,
        primaryLabel: 'Painel Admin',
        PrimaryIcon: ShieldCheck,
      };
    }

    if (user.role === 'COLLECTOR') {
      return {
        title: 'Área Operacional do Coletor',
        description:
          'Você está conectado como Coletor. Acesse seu painel para acompanhar coletas agendadas, validar entregas e gerenciar suas rotas.',
        primaryHref: HOME_BY_ROLE.COLLECTOR,
        primaryLabel: 'Painel do Coletor',
        PrimaryIcon: ShieldCheck,
      };
    }

    return {
      title: 'Que bom ter você de volta! Pronto para reciclar hoje?',
      description:
        'Encontre os pontos de coleta mais próximos de você, registre seu descarte e acompanhe o seu impacto ecológico.',
      primaryHref: HOME_BY_ROLE.CITIZEN,
      primaryLabel: 'Meu Painel',
      PrimaryIcon: UserCheck,
    };
  };

  const { title, description, primaryHref, primaryLabel, PrimaryIcon } =
    getCtaContent();

  return (
    <section className="w-full bg-background py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Card verde */}
        <div className="relative bg-brand-solid rounded-3xl p-8 sm:p-12 lg:p-16 text-white overflow-hidden shadow-xl border border-brand-deep grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bolas de efeito difuso */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -left-20 h-46 w-46 z-10 rounded-full bg-brand-light blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-20 h-46 w-86 z-10 rounded-full bg-brand-light blur-[140px]"
          />

          <div className="relative z-20 max-w-3xl space-y-6">
            {/* A tag em cima */}
            <div className="inline-flex items-center gap-2 px-3 py-1 text-white text-xs font-semibold">
              <Image
                src="/icons/ecoponto-logo-icon-white.png"
                alt=""
                width={28}
                height={25}
                className="h-auto w-8"
              />
              <span>EcoPonto</span>
            </div>

            {/* Título Principal */}
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-white leading-tight">
              {title}
            </h2>

            {/* Descrição */}
            <p className="text-sm sm:text-base text-brand-foreground leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          {/* Botões */}
          <div className="relative z-20 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-brand-medium hover:bg-brand-deep text-brand-foreground font-semibold text-sm transition-colors border border-brand-medium"
            >
              <PrimaryIcon className="w-4 h-4 text-brand-foreground" />
              <span>{primaryLabel}</span>
            </Link>

            <a
              href={`#${HOME_SECTIONS.map}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-brand-solid font-bold text-sm hover:bg-brand-pale transition-colors shadow-md"
            >
              <MapPin className="w-4 h-4 text-brand" />
              <span>
                {isStaff ? 'Ver Mapa de Pontos' : 'Buscar Pontos Agora'}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
