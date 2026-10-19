import Link from 'next/link';
import {
  Lightbulb,
  Clock,
  ArrowRight,
  Wrench,
  Cpu,
  BatteryCharging,
} from 'lucide-react';
import { HOME_SECTIONS, ROUTES } from '@/lib/routes';

// Lista de artigos e tutoriais da seção
const educationArticles = [
  {
    id: 1,
    tag: 'DIY',
    tagColor: 'bg-brand-light text-brand-muted',
    bannerBg: 'bg-gradient-to-br from-emerald-100 to-teal-200 text-emerald-800',
    icon: Wrench,
    readTime: '5 min de leitura',
    difficulty: 'Fácil',
    title: 'Joias de Teclas Retro',
    description:
      'Transforme teclados mecânicos antigos em pingentes ecológicos, abotoaduras modernas e chaveiros industriais únicos.',
    linkText: 'Ler passo a passo',
    href: `${ROUTES.education}/diy`,
  },
  {
    id: 2,
    tag: 'Conhecimento',
    tagColor: 'bg-brand-light text-brand-muted',
    bannerBg: 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700',
    icon: Cpu,
    readTime: '12 min de leitura',
    difficulty: 'Médio',
    title: 'Relógio de Hard Drive',
    description:
      'Estilo industrial usando espelhos e pratos de HDs antigos para decorar salas ou escritórios sustentáveis.',
    linkText: 'Ver tutorial completo',
    href: `${ROUTES.education}/conhecimento`,
  },
  {
    id: 3,
    tag: 'Conhecimento',
    tagColor: 'bg-brand-light text-brand-muted',
    bannerBg: 'bg-gradient-to-br from-amber-100 to-orange-200 text-amber-800',
    icon: BatteryCharging,
    readTime: '4 min de leitura',
    difficulty: 'Difícil',
    title: 'Guia do Descarte Seguro de Baterias de Lítio',
    description:
      'Como isolar contatos elétricos com fita adesiva e prevenir combustão espontânea antes de levar ao ecoponto.',
    linkText: 'Aprender precauções',
    href: `${ROUTES.education}/conhecimento`,
  },
];

export const EducationSection = () => {
  return (
    <section
      id={HOME_SECTIONS.education}
      className="w-full bg-surface-alt py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-brand"></span>
              <span>CONHECIMENTO QUE TRANSFORMA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-900 leading-tight">
              Aprenda, Reutilize & Conscientize-se
            </h2>
          </div>

          <Link
            href={ROUTES.education}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            <span>Acessar Central de Tutoriais & Dicas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Fato ecológico do dia */}
        <div className="bg-brand text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-brand flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-brand-medium rounded-xl text-brand-light shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-brand-light">
              FATO ECOLÓGICO
            </span>
            <p className="text-xs sm:text-sm text-white leading-relaxed font-medium">
              &quot;Uma tonelada de iPhones descartados contém até 300 vezes
              mais ouro do que uma tonelada de minério bruto extraído de minas
              naturais.&quot;
            </p>
          </div>
        </div>

        {/* grid dos artigos e tutoriais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
          {educationArticles.map((article) => {
            const Icon = article.icon;

            return (
              <div
                key={article.id}
                className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* "Imagem dele" */}
                  <div
                    className={`relative h-48 w-full ${article.bannerBg} flex items-center justify-center p-6 overflow-hidden`}
                  >
                    {/* ícone que vai ficar na suposta imagem */}
                    <Icon className="w-16 h-16 opacity-80 group-hover:scale-110 transition-transform duration-300" />

                    {/* Tag em cima */}
                    <span
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-xs ${article.tagColor}`}
                    >
                      {article.tag}
                    </span>
                  </div>

                  {/* Conteúdo Interno */}
                  <div className="p-6 space-y-3">
                    {/* Tempo e Dificuldade */}
                    <div className="flex items-center gap-2 text-xs text-brand font-medium">
                      <Clock className="w-3.5 h-3.5 text-brand" />
                      <span>{article.readTime}</span>
                      <span>•</span>
                      <span>{article.difficulty}</span>
                    </div>

                    {/* Título */}
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand transition-colors">
                      {article.title}
                    </h3>

                    {/* Descrição */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                </div>

                {/* Link para leitura embaixo */}
                <div className="p-6 pt-0">
                  <Link
                    href={article.href}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-brand transition-colors"
                  >
                    <span>{article.linkText}</span>
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
