'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Navigation,
  Trash,
  Battery,
  Map as MapIcon,
  ExternalLink,
  SlidersHorizontal,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';

type CategoryId = 'all' | 'electronics' | 'recyclables';

type Category = {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
};

type CollectionPoint = {
  id: number;
  name: string;
  shortName: string;
  address: string;
  distance: string;
  category: Exclude<CategoryId, 'all'>;
  tags: string[];
  hours: string;
  // Posição do pin no mapa simulado (classes Tailwind)
  pinPosition: string;
  pinColor: string;
};

const categories: Category[] = [
  { id: 'all', label: 'Todos os Itens', icon: SlidersHorizontal },
  { id: 'electronics', label: 'Pilhas & Eletrônicos', icon: Battery },
  { id: 'recyclables', label: 'Recicláveis', icon: Trash },
];

// Dados para simular até termos os reais (virão de services/api.ts)
const nearbyPoints: CollectionPoint[] = [
  {
    id: 1,
    name: 'EcoPonto Central Manhuaçu',
    shortName: 'Central',
    address: 'Rua Amaral Franco, 142 - Centro',
    distance: '0.4 km',
    category: 'electronics',
    tags: ['Baterias', 'Monitores', 'Laptops'],
    hours: 'Aberto até 18:00',
    pinPosition: 'top-1/3 left-1/3',
    pinColor: 'bg-emerald-700 ring-emerald-200',
  },
  {
    id: 2,
    name: 'Ponto Parceiro Casas Bahia',
    shortName: 'Casas Bahia',
    address: 'Praça Cordovil Pinto, 88 - Centro',
    distance: '1.1 km',
    category: 'electronics',
    tags: ['Smartphones', 'Pilhas'],
    hours: 'Aberto até 19:00',
    pinPosition: 'bottom-1/3 right-1/4',
    pinColor: 'bg-blue-600 ring-blue-200',
  },
];

function getDirectionsUrl(address: string) {
  const destination = encodeURIComponent(`${address}, Manhuaçu - MG`);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}

export function MapExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [cepInput, setCepInput] = useState('');
  const [searchedCep, setSearchedCep] = useState('');

  const visiblePoints =
    selectedCategory === 'all'
      ? nearbyPoints
      : nearbyPoints.filter((point) => point.category === selectedCategory);

  const handleSearchCep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: buscar os pontos na API a partir do CEP/bairro
    setSearchedCep(cepInput.trim());
  };

  return (
    <>
      {/* CEP e filtros */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <form
          onSubmit={handleSearchCep}
          role="search"
          className="relative flex-1 max-w-md"
        >
          <label htmlFor="cep-search" className="sr-only">
            CEP ou bairro
          </label>
          <div className="relative flex items-center">
            <Search
              aria-hidden="true"
              className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none"
            />
            <input
              id="cep-search"
              type="text"
              placeholder="Digite seu CEP ou Bairro (ex: 36900-000)"
              value={cepInput}
              onChange={(e) => setCepInput(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 bg-white border border-slate-200 rounded-full text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-full transition-colors"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Categorias de filtro */}
        <div
          role="group"
          aria-label="Filtrar por categoria"
          className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 [scrollbar-width:none]"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border',
                  isSelected
                    ? 'bg-brand text-white border-brand shadow-sm'
                    : 'bg-surface-strong text-slate-600 border-slate-200 hover:bg-slate-100/80'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mapa e lista dos pontos próximos */}
      <div className="bg-white rounded-3xl p-4 lg:p-6 shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Mapa simulado */}
        <div className="lg:col-span-8 relative min-h-[380px] lg:min-h-[460px] rounded-2xl bg-brand overflow-hidden border border-slate-100 flex flex-col justify-between p-4">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40 bg-emerald-50 bg-[radial-gradient(var(--color-emerald-500)_1px,transparent_1px)] [background-size:16px_16px]"
          />

          {/* Status */}
          <div className="relative z-10 self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold shadow-sm border border-slate-100">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
            <span>12 Postos Ativos Hoje</span>
          </div>

          {/* Pins simulados */}
          {visiblePoints.map((point) => (
            <div
              key={point.id}
              className={cn(
                'absolute z-10 flex flex-col items-center group',
                point.pinPosition
              )}
            >
              <div
                className={cn(
                  'p-2 text-white rounded-full shadow-lg ring-4 group-hover:scale-110 transition-transform',
                  point.pinColor
                )}
              >
                <MapPin className="w-5 h-5" />
              </div>
              <span className="mt-1 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] rounded font-medium backdrop-blur-xs">
                {point.shortName}
              </span>
            </div>
          ))}

          {/* Localização */}
          <div
            aria-live="polite"
            className="relative w-fit z-10 self-center sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-slate-700 text-xs font-medium shadow-sm border border-slate-100"
          >
            <Navigation className="w-3.5 h-3.5 text-brand" />
            <span>
              {searchedCep ? (
                <>
                  Resultados para: <strong>{searchedCep}</strong>
                </>
              ) : (
                <>
                  Sua Localização: <strong>Centro (detectada)</strong>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Destaques próximos */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xl">
                Destaques Próximos
              </h3>
              <Link
                href={ROUTES.map}
                className="text-xs text-slate-500 font-medium hover:text-brand"
              >
                Ver todos
              </Link>
            </div>

            <ul className="space-y-3">
              {visiblePoints.length === 0 && (
                <li className="p-4 rounded-2xl bg-surface-alt text-sm text-slate-500 text-center">
                  Nenhum ponto encontrado para esta categoria.
                </li>
              )}

              {visiblePoints.map((point) => (
                <li
                  key={point.id}
                  className="p-4 rounded-2xl bg-surface-alt border border-slate-100 hover:bg-slate-50 transition-colors space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {point.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {point.address}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-brand-light text-brand-muted text-[11px] font-semibold rounded-lg shrink-0">
                      {point.distance}
                    </span>
                  </div>

                  {/* Tipos de lixo aceitos */}
                  <div className="flex flex-wrap gap-1.5">
                    {point.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-white text-slate-600 text-[10px] font-medium rounded-md border border-slate-200/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/40">
                    <div className="flex items-center font-semibold gap-1.5 text-brand">
                      <span className="w-2 h-2 rounded-full bg-brand"></span>
                      <span>{point.hours}</span>
                    </div>
                    <a
                      href={getDirectionsUrl(point.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand hover:text-brand-dark inline-flex items-center gap-1"
                    >
                      <span>Traçar Rota</span>
                      <ExternalLink aria-hidden="true" className="w-3 h-3" />
                      <span className="sr-only">(abre em nova aba)</span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={ROUTES.map}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface-strong hover:bg-slate-200 text-brand font-semibold text-xs sm:text-sm transition-colors"
          >
            <MapIcon className="w-4 h-4 text-brand" />
            <span>Abrir Navegação Completa</span>
          </Link>
        </div>
      </div>
    </>
  );
}
