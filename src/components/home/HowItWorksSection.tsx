import Link from 'next/link';
import { Navigation, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { HOME_SECTIONS, ROUTES } from '@/lib/routes';

const steps = [
  {
    number: '01',
    icon: Navigation,
    title: 'Localize um Ponto',
    description:
      'Encontre o ecoponto ou estabelecimento parceiro mais próximo com rotas traçadas, horários de funcionamento e itens válidos.',
    linkText: 'Ver mapa de rotas',
    href: `#${HOME_SECTIONS.map}`,
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Descarte com Segurança',
    description:
      'Leve seus dispositivos quebrados ou sem uso: computadores, pilhas, monitores e periféricos. Descarte rápido e sem burocracia.',
    linkText: 'O que descartar',
    href: `#${HOME_SECTIONS.education}`,
  },
  {
    number: '03',
    icon: Award,
    title: 'Acompanhe seu Impacto',
    description:
      'Ganhe pontos ecológicos pelo app, suba de nível como Guardião Digital e receba certificados de redução de pegada de carbono.',
    linkText: 'Saber mais',
    href: ROUTES.account,
  },
];

export const HowItWorksSection = () => {
  return (
    <section
      id={HOME_SECTIONS.howItWorks}
      className="w-full bg-surface-alt py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-brand text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-brand"></span>
              <span>PASSO A PASSO CONSCIENTE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-900 leading-tight">
              Como o EcoPonto simplifica sua ação ecológica
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
            Criamos um circuito seguro de descarte que beneficia tanto a
            comunidade quanto as cooperativas de reciclagem credenciadas.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 w-full items-stretch">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative bg-white rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex-1 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-surface-accent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  <span className="text-3xl lg:text-4xl font-extrabold text-brand tracking-tight block">
                    {step.number}
                  </span>

                  <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg lg:text-xl font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100/80 relative z-10">
                  <Link
                    href={step.href}
                    className="inline-flex items-center gap-2 text-xs lg:text-sm font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors"
                  >
                    <span>{step.linkText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
