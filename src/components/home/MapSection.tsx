'use client';
import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Trash,
  Battery,
  Map,
  ExternalLink,
  SlidersHorizontal,
  Search,
} from 'lucide-react';

// Filtros
const categories = [
  { id: 'all', label: 'Todos os Itens', icon: SlidersHorizontal },
  { id: 'eletronics', label: 'Pilhas & Eletrônicos', icon: Battery },
  { id: 'recycles', label: 'Recicláveis', icon: Trash },
];

// Dados para simular até termos os reais
const nearbyPoints = [
  {
    id: 1,
    name: 'EcoPonto Central Manhuaçu',
    address: 'Rua Amaral Franco, 142 - Centro',
    distance: '0.4 km',
    tags: ['Baterias', 'Monitores', 'Laptops'],
    hours: 'Aberto até 18:00',
  },
  {
    id: 2,
    name: 'Ponto Parceiro Casas Bahia',
    address: 'Praça Cordovil Pinto, 88 - Centro',
    distance: '1.1 km',
    tags: ['Smartphones', 'Pilhas'],
    hours: 'Aberto até 19:00',
  },
];

export const MapSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cepInput, setCepInput] = useState('');

  const handleSearchCep = (e: React.FormEvent) => {
    e.preventDefault();
    // Pra no futuro fazer a busca com a API
    console.log('Buscando pontos para o CEP/Localização:', cepInput);
  };

  return (
    <section className="w-full bg-[#F8F9FF] py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Cabeçalho */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-[#36654A] text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#36654A]"></span>
              <span>REDE CREDENCIADA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-900 leading-tight">
              Mapa Interativo de Descarte
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
              Explore pontos autorizados com armazenamento controlado em
              Manhuaçu e arredores.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 w-full sm:w-auto pt-2 self-start">
            <a
              href="#map"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#36654A] text-white font-medium hover:bg-emerald-900 transition-colors shadow-sm"
            >
              <MapPin className="w-5 h-5 text-white" />
              <span>Ver Pontos Próximos de você</span>
            </a>
          </div>
        </div>

        {/* Cep e filtros */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Caixa de Busca por CEP */}
          <form onSubmit={handleSearchCep} className="relative flex-1 max-w-md">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
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

          {/* Categorias de Filtro */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                    isSelected
                      ? 'bg-[#36654A] text-white border-[#36654A] shadow-sm'
                      : 'bg-[#DEE9FC] text-slate-600 border-slate-200 hover:bg-slate-100/80'
                  }`}
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
          {/* Tela do mapa */}
          <div className="lg:col-span-8 relative min-h-[380px] lg:min-h-[460px] rounded-2xl bg-[#36654A] overflow-hidden border border-slate-100 flex flex-col justify-between p-4">
            {/* Fundo simulando o mapa */}
            <div
              className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"
              style={{ backgroundColor: '#e8f5e9' }}
            />

            {/* Status */}
            <div className="relative z-10 self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold shadow-sm border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#36654A] animate-pulse"></span>
              <span>12 Postos Ativos Hoje</span>
            </div>

            {/* Pins simulados */}
            <div className="absolute top-1/3 left-1/3 z-10 flex flex-col items-center group cursor-pointer">
              <div className="p-2 bg-emerald-700 text-white rounded-full shadow-lg ring-4 ring-emerald-200 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="mt-1 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] rounded font-medium backdrop-blur-xs">
                Central
              </span>
            </div>

            <div className="absolute bottom-1/3 right-1/4 z-10 flex flex-col items-center group cursor-pointer">
              <div className="p-2 bg-blue-600 text-white rounded-full shadow-lg ring-4 ring-blue-200 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="mt-1 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] rounded font-medium backdrop-blur-xs">
                Casas Bahia
              </span>
            </div>

            {/* Localização embaixo */}
            <div className="relative w-fit z-10 self-center sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-slate-700 text-xs font-medium shadow-sm border border-slate-100">
              <Navigation className="w-3.5 h-3.5 text-[#36654A]" />
              <span>
                {cepInput ? (
                  <>
                    Resultados para o CEP: <strong>{cepInput}</strong>
                  </>
                ) : (
                  <>
                    Sua Localização: <strong>Centro (detectada)</strong>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Destaques Próximos */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-xl">
                  Destaques Próximos
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Ver todos (15)
                </span>
              </div>

              {/* Cards de Pontos Próximos */}
              <div className="space-y-3">
                {nearbyPoints.map((point) => (
                  <div
                    key={point.id}
                    className="p-4 rounded-2xl bg-[#EFF4FF] border border-slate-100 hover:bg-slate-50 transition-colors space-y-3"
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
                      <span className="px-2 py-1 bg-[#C9EAD6] text-[#4D6B5B] text-[11px] font-semibold rounded-lg shrink-0">
                        {point.distance}
                      </span>
                    </div>

                    {/* Tags dos tipos de lixo aceitos */}
                    <div className="flex flex-wrap gap-1.5">
                      {point.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-white text-slate-600 text-[10px] font-medium rounded-md border border-slate-200/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/40">
                      <div className="flex items-center font-semibold gap-1.5 text-[#36654A]">
                        <span className="w-2 h-2 rounded-full bg-[#36654A]"></span>
                        <span>{point.hours}</span>
                      </div>
                      <a
                        href="#map"
                        className="font-semibold text-[#36654A] hover:text-emerald-900 inline-flex items-center gap-1"
                      >
                        <span>Traçar Rota</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão Navegação Completa */}
            <a
              href="#map"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#DEE9FC] hover:bg-slate-200 text-[#36654A] font-semibold text-xs sm:text-sm transition-colors"
            >
              <Map className="w-4 h-4 text-[#36654A]" />
              <span>Abrir Navegação Completa</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
