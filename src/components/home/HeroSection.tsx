import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  BookOpen,
  Trees,
  Houses,
  Recycle,
  UserPlus,
  LogIn,
  BatteryPlus,
} from 'lucide-react';
import { HOME_SECTIONS, ROUTES } from '@/lib/routes';

interface HeroSectionProps {
  isLoggedIn?: boolean;
}

export const HeroSection = ({ isLoggedIn = false }: HeroSectionProps) => {
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-brand text-white font-medium hover:bg-brand-dark transition-colors shadow-sm"
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

        {/* Conteúdo da coluna da direta: É dinâmico pra logado e não logado */}
        <div className="relative z-20 lg:col-span-5 w-full">
          {isLoggedIn ? (
            /* Usuário logado */
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand rounded-lg">
                    <Recycle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      Painel Comunitário
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                      <span className="text-xs text-slate-500">
                        Atualizado em tempo real
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações de coleta do usuário */}
              <div className="bg-brand text-white rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs tracking-wider uppercase text-brand-foreground font-semibold">
                    Lixo Eletrônico Recuperado
                  </span>
                  <Recycle className="w-5 h-5 text-brand-light opacity-80" />
                </div>

                <div>
                  <div className="text-3xl font-bold">
                    42.8{' '}
                    <span className="text-lg font-normal text-brand-light">
                      kg salvos
                    </span>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="space-y-1.5">
                  <div className="w-full bg-brand-medium rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-brand-pale h-2.5 rounded-full"
                      style={{ width: '78%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-brand-foreground">
                    <span>Meta Mensal: 50 kg</span>
                    <span className="font-semibold text-brand-foreground">
                      78% concluído
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-cards de métricas pequenas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-alt p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div className="p-2 bg-brand-light rounded-xl w-fit text-brand-muted mb-2">
                    <Trees className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">
                      3 Árvores
                    </p>
                    <p className="text-xs text-slate-500">
                      Preservadas de mineração
                    </p>
                  </div>
                </div>

                <div className="bg-surface-alt p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div className="p-2 bg-surface-strong rounded-xl w-fit text-brand-muted mb-2">
                    <Houses className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">
                      +15 Pontos
                    </p>
                    <p className="text-xs text-slate-500">
                      Parceiros certificados
                    </p>
                  </div>
                </div>
              </div>

              {/* Atividade Recente */}
              <div className="bg-surface p-3.5 rounded-2xl border border-slate-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-light rounded-xl text-slate-600">
                    <BatteryPlus className="w-4 h-4 text-brand-muted" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      Carlos M.{' '}
                      <span className="font-normal text-slate-600">
                        entregou 4 baterias
                      </span>
                    </p>
                    <p className="text-slate-400">
                      Há 12 minutos • Ponto Centro
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-brand px-2 py-1">
                  +40 pts
                </span>
              </div>
            </div>
          ) : (
            /* Usuário não logado */
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-brand rounded-2xl flex items-center justify-center shadow-inner">
                <Image
                  src="/icons/ecoponto-logo-icon-white.png"
                  alt=""
                  width={28}
                  height={25}
                  className="h-auto w-8"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Acompanhe seu Impacto Pessoal
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Cadastre-se para ter acesso ao conteúdo personalizado,
                  acompanhar suas metas de reciclagem, acumular pontos
                  ecológicos e receber recompensas!
                </p>
              </div>

              {/* Botões de Autenticação */}
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href={ROUTES.register}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Cadastrar-se Gratuitamente</span>
                </Link>

                <Link
                  href={ROUTES.login}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-ink font-medium text-sm hover:bg-slate-200 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Já tenho uma conta (Entrar)</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
