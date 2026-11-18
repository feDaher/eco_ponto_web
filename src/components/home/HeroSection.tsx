import { BookOpen, MapPin, Recycle } from 'lucide-react';
import { HOME_SECTIONS } from '@/lib/routes';
import { HeroAuthPanel } from './HeroAuthPanel';

export const HeroSection = () => {
  return (
    <section className="relative w-full bg-surface py-8 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent),linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [mask-composite:intersect]">
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Bolas de efeito difuso */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 z-10 rounded-full bg-brand-light blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-20 z-10 h-[30rem] w-[30rem] rounded-full bg-brand-light blur-[140px]"
        />

        {/* Conteúdo da coluna da esquerda */}
        <div className="relative z-20 lg:col-span-7 flex flex-col items-start space-y-6">
          {/* Essa tag aí em cima */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-light text-brand-muted text-xs sm:text-sm font-medium tracking-wide">
            <Recycle className="w-4 h-4 text-brand-muted" />
            <span>REDE OFICIAL DE LOGÍSTICA REVERSA</span>
          </div>

          {/* Título marcante e descrição */}
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Dê o destino certo ao seu{' '}
            <span className="text-brand">lixo eletrônico</span>.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Conectamos cidadãos e empresas a pontos de coleta certificados em
            Manhuaçu e região. Descarte celulares, baterias, computadores e
            monitores com segurança ambiental e rastreabilidade total.
          </p>

          {/* Botões para descer pra outras partes do home */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2">
            <a
              href={`#${HOME_SECTIONS.map}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-brand-solid text-white font-medium hover:bg-brand-solid-hover transition-colors shadow-sm"
            >
              <MapPin className="w-5 h-5 text-white" />
              <span>Explorar Mapa de Coleta</span>
            </a>
            <a
              href={`#${HOME_SECTIONS.education}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-surface-strong text-ink font-medium hover:bg-slate-200 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-ink" />
              <span>Aprender sobre Reciclagem</span>
            </a>
          </div>

          {/* Estatísticas genéricas */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-slate-100 w-full max-w-xl">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-brand">100%</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Rastreabilidade LGPD
              </p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-brand">Rápido</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Mapeamento de Pontos
              </p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-brand">Zero</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Contaminação no Solo
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-20 w-full lg:col-span-5">
          <HeroAuthPanel />
        </div>
      </div>
    </section>
  );
};
