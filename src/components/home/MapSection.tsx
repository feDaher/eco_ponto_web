import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { HOME_SECTIONS, ROUTES } from '@/lib/routes';
import { MapExplorer } from './MapExplorer';

// Seção renderizada no servidor; só o MapExplorer (filtros, busca) roda no cliente
export const MapSection = () => {
  return (
    <section
      id={HOME_SECTIONS.map}
      className="w-full bg-surface py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-brand text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-brand"></span>
              <span>REDE CREDENCIADA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              Mapa Interativo de Descarte
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
              Explore pontos autorizados com armazenamento controlado em
              Manhuaçu e arredores.
            </p>
          </div>

          <Link
            href={ROUTES.map}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-brand text-white font-medium hover:bg-brand-dark transition-colors shadow-sm"
          >
            <MapPin className="w-5 h-5 text-white" />
            <span>Ver Pontos Próximos de você</span>
          </Link>
        </div>

        <MapExplorer />
      </div>
    </section>
  );
};
