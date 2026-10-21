import { BookOpen, Clock, Leaf, Send, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/utils/utils';
import type { DisposalGuide } from '@/utils/tipos-guia';

const heroIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Clock,
  Leaf,
  ShieldCheck,
};

type GuideHeaderProps = {
  guide: DisposalGuide;
};

export function GuideHeader({ guide }: GuideHeaderProps) {
  const titleParts = guide.tituloH1.split(guide.palavraDestaque);

  return (
    <section className="pt-6">
      {/* Pills meta */}
      <div className="mb-3 flex flex-wrap gap-2">
        {guide.pillsHero.map((pill, index) => {
          const Icon = heroIcons[pill.icone];

          return (
            <span
              key={index}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                pill.variante === 'emerald' && 'bg-[#C9EAD6] text-[#36654A]',
                pill.variante === 'sky' && 'bg-[#D6E2F5] text-[#3A4A63]',
                pill.variante === 'slate' &&
                  'border border-[#DCE2EC] bg-[#F1F3F7] text-[#3A4553]'
              )}
            >
              {Icon && <Icon className="size-3.5" />}
              {pill.texto}
            </span>
          );
        })}
      </div>

      {/* Título principal */}
      <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight lg:text-4xl xl:text-5xl">
        {titleParts[0]}
        <span className="text-emerald-700 underline underline-offset-4 decoration-2 decoration-emerald-500/40">
          {guide.palavraDestaque}
        </span>
        {titleParts[1]}
      </h1>

      {/* Subtítulo */}
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground lg:text-lg">
        {guide.subtitulo}
      </p>

      {/* Card de resumo rápido */}
      <div className="mt-8 grid items-start gap-6 rounded-2xl border-[#F8F9FF] bg-card p-6 lg:grid-cols-[1fr_auto] lg:p-8">
        <div>
          <div className="inline-flex items-center gap-3">
            <Image
              src="/icons/ecoponto-logo-icon.png"
              alt="EcoPonto"
              width={48}
              height={48}
              className="size-12"
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              RESUMO RÁPIDO • DESTAQUE DE BUSCA
            </span>
          </div>

          <h2 className="mt-3 text-xl font-semibold lg:text-2xl">
            Como descartar pilhas e baterias em Manhuaçu em 30 segundos:
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[#414943]">
            <strong>1. Isole os dois polos</strong> com qualquer fita adesiva
            transparente ou isolante; <strong>2. Não misture</strong> baterias
            estufadas com pilhas normais; <strong>3. Deposite</strong> nas urnas
            gratuitas do EcoPonto Central (Rua Amaral Franco) ou redes parceiras
            no centro de Manhuaçu.
          </p>
        </div>

        <div className="mt-4 lg:mt-0">
          <a
            href={guide.ctaResumo.anchor}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
          >
            <Send className="size-4" />
            {guide.ctaResumo.texto}
          </a>
        </div>
      </div>
    </section>
  );
}
