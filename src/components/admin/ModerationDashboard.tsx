'use client';

import React, { useState, useMemo } from 'react';
import { useEvaluations } from '@/components/admin/EvaluationContext';
import { Evaluation } from '@/data/mockModeration';
import {
  Star,
  Globe,
  EyeOff,
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  MapPin,
} from 'lucide-react';

export default function ModerationDashboard() {
  const { evaluations, toggleVisibility } = useEvaluations();

  const [activeTab, setActiveTab] = useState<'all' | 'visible' | 'hidden'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalCount = evaluations.length;
  const visibleCount = evaluations.filter(
    (e: Evaluation) => e.status === 'visible'
  ).length;
  const hiddenCount = evaluations.filter(
    (e: Evaluation) => e.status === 'hidden'
  ).length;

  const averageStars = useMemo(() => {
    if (totalCount === 0) return '0.0';
    const sum = evaluations.reduce(
      (acc: number, curr: Evaluation) => acc + curr.stars,
      0
    );
    return (sum / totalCount).toFixed(1);
  }, [evaluations, totalCount]);

  const percentVisible = useMemo(() => {
    if (totalCount === 0) return '0.0';
    return ((visibleCount / totalCount) * 100).toFixed(1);
  }, [visibleCount, totalCount]);

  const percentHidden = useMemo(() => {
    if (totalCount === 0) return '0.0';
    return ((hiddenCount / totalCount) * 100).toFixed(1);
  }, [hiddenCount, totalCount]);

  const count1Star = evaluations.filter(
    (e: Evaluation) => e.stars === 1
  ).length;
  const count2Star = evaluations.filter(
    (e: Evaluation) => e.stars === 2
  ).length;
  const count3to5Star = evaluations.filter(
    (e: Evaluation) => e.stars >= 3
  ).length;

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((item: Evaluation) => {
      if (activeTab === 'visible' && item.status !== 'visible') return false;
      if (activeTab === 'hidden' && item.status !== 'hidden') return false;

      if (starFilter === 1 && item.stars !== 1) return false;
      if (starFilter === 2 && item.stars !== 2) return false;
      if (starFilter === 3 && item.stars < 3) return false;

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchAuthor = item.author.toLowerCase().includes(query);
        const matchComment = item.comment.toLowerCase().includes(query);
        const matchCode = item.code.toLowerCase().includes(query);
        return matchAuthor || matchComment || matchCode;
      }

      return true;
    });
  }, [evaluations, activeTab, starFilter, searchQuery]);

  const totalPages = Math.ceil(filteredEvaluations.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredEvaluations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleTabChange = (tab: 'all' | 'visible' | 'hidden') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleStarFilterChange = (filter: number | 'all') => {
    setStarFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-surface-accend min-h-screen text-ink space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Auditoria & Moderação de Avaliações
          </h1>
          <p className="text-sm text-ink">
            Comentários são publicados automaticamente no mapa. Monitore os
            relatos públicos e oculte ou remova conteúdos impróprios quando
            necessário.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background p-5 rounded-xl border border-surface shadow-sm relative">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-ink uppercase tracking-wider">
              Total de Avaliações
            </span>
            <div className="bg-surface-accent p-2 rounded-lg text-ink">
              <MessageSquare size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">
            {totalCount}
          </p>
          <div className="mt-4 flex items-center text-xs text-ink gap-1">
            <Star size={14} className="fill-brand text-brand" />
            <span>
              Média: <strong>{averageStars} / 5.0</strong>
            </span>
          </div>
        </div>

        <div className="bg-background p-5 rounded-xl border border-surface shadow-sm relative">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-ink uppercase tracking-wider">
              Publicadas no Mapa
            </span>
            <div className="bg-brand-light p-2 rounded-lg text-brand-muted">
              <Globe size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-brand mt-2">
            {visibleCount}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-ink">
            <span>
              <strong>{percentVisible}%</strong> ativas no app
            </span>
            <span className="bg-brand-light text-ink px-2 py-0.5 rounded font-medium">
              Visíveis
            </span>
          </div>
        </div>

        <div className="bg-background p-5 rounded-xl border border-surface shadow-sm relative">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-ink uppercase tracking-wider">
              Ocultadas Manualmente
            </span>
            <div className="bg-surface-accent p-2 rounded-lg text-ink">
              <EyeOff size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-2">
            {hiddenCount}
          </p>
          <p className="mt-4 text-xs text-ink">
            <strong>{percentHidden}%</strong> do total
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleTabChange('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'all'
              ? 'bg-brand text-surface'
              : 'bg-background border border-surface-strong text-ink hover:bg-surface'
          }`}
        >
          <span>Todas as Avaliações (Recentes)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'all' ? 'bg-brand-medium text-surface' : 'bg-surface-strong text-ink'}`}
          >
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('visible')}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'visible'
              ? 'bg-brand text-surface'
              : 'bg-background border border-surface-strong text-ink hover:bg-surface'
          }`}
        >
          <span>Visíveis no Mapa</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'visible' ? 'bg-brand-medium text-surface' : 'bg-surface-strong text-ink'}`}
          >
            {visibleCount}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('hidden')}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'hidden'
              ? 'bg-brand text-surface'
              : 'bg-background border border-surface-strong text-ink hover:bg-surface'
          }`}
        >
          <span>Ocultadas</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${activeTab === 'hidden' ? 'bg-brand-medium text-surface' : 'bg-surface-strong text-ink'}`}
          >
            {hiddenCount}
          </span>
        </button>
      </div>

      <div className="bg-background p-4 rounded-xl border border-surface shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por termo no comentário, nome do cidadão ou ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm border border-surface-accend rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-ink w-full md:w-auto overflow-x-auto">
          <span>Classificação:</span>
          <button
            onClick={() => handleStarFilterChange('all')}
            className={`px-3 py-1.5 rounded-md ${starFilter === 'all' ? 'bg-brand text-surface' : 'bg-surface border border-surface-strong text-ink hover:bg-surface-accent'}`}
          >
            Todas
          </button>
          <button
            onClick={() => handleStarFilterChange(1)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${starFilter === 1 ? 'bg-brand text-surface' : 'bg-surface border border-surface-strong text-ink hover:bg-surface-accent'}`}
          >
            1{' '}
            <Star size={12} fill={starFilter === 1 ? 'currentColor' : 'none'} />{' '}
            ({count1Star})
          </button>
          <button
            onClick={() => handleStarFilterChange(2)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${starFilter === 2 ? 'bg-brand text-surface' : 'bg-surface border border-surface-strong text-ink hover:bg-surface-accent'}`}
          >
            2{' '}
            <Star size={12} fill={starFilter === 2 ? 'currentColor' : 'none'} />{' '}
            ({count2Star})
          </button>
          <button
            onClick={() => handleStarFilterChange(3)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${starFilter === 3 ? 'bg-brand text-surface' : 'bg-surface border border-surface-strong text-ink hover:bg-surface-accent'}`}
          >
            3–5{' '}
            <Star size={12} fill={starFilter === 3 ? 'currentColor' : 'none'} />{' '}
            ({count3to5Star})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedItems.length === 0 ? (
          <div className="bg-background p-8 rounded-xl border border-surface text-center text-ink">
            Nenhuma avaliação encontrada para os filtros selecionados.
          </div>
        ) : (
          paginatedItems.map((item: Evaluation) => (
            <div
              key={item.id}
              className="bg-background p-5 rounded-xl border border-surface shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface text-ink font-bold flex items-center justify-center text-sm">
                    {item.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground text-sm">
                        {item.author}
                      </h3>
                      <span className="bg-brand-light text-brand text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                      {item.stats && (
                        <span className="text-xs text-surface-accend">
                          • {item.stats}
                        </span>
                      )}
                    </div>
                    <p className="flex items-center gap-1 text-xs text-ink mt-0.5">
                      <MapPin size={12} /> {item.location} • {item.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      item.status === 'visible'
                        ? 'bg-brand-light text-brand'
                        : 'bg-surface-strong text-ink'
                    }`}
                  >
                    {item.status === 'visible' ? (
                      <Globe size={12} />
                    ) : (
                      <EyeOff size={12} />
                    )}
                    {item.status === 'visible' ? 'Visível no Mapa' : 'Ocultado'}
                  </span>
                  <span className="text-xs text-ink font-mono">
                    {item.code}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 font-bold text-ink">
                  <Star size={14} className="fill-brand text-brand " />
                  <span>
                    {item.stars.toFixed(1)} Estrela{item.stars > 1 ? 's' : ''}
                  </span>
                </div>
                {item.tag && (
                  <span className="text-ink text-xs">• {item.tag}</span>
                )}
              </div>

              <div className="bg-surface p-4 rounded-lg border border-surface-accent text-sm text-ink font-medium relative">
                {item.comment}
                <span className="absolute right-4 bottom-2 text-2xl text-surface-strong font-serif font-bold">
                  ”
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisibility(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      item.status === 'visible'
                        ? 'bg-surface-accent hover:bg-surface-strong text-ink'
                        : 'bg-brand hover:bg-brand-dark text-background'
                    }`}
                  >
                    {item.status === 'visible' ? (
                      <>
                        <EyeOff size={14} /> Ocultar do Mapa
                      </>
                    ) : (
                      <>
                        <Globe size={14} /> Reexibir no Mapa
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between items-center bg-background p-4 rounded-xl border border-surface-accent text-xs text-ink">
        <span>
          Exibindo {filteredEvaluations.length > 0 ? startIndex + 1 : 0} até{' '}
          {Math.min(startIndex + itemsPerPage, filteredEvaluations.length)} de{' '}
          {filteredEvaluations.length} avaliações filtradas
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-surface-accent hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-lg text-xs font-medium ${
                currentPage === page
                  ? 'bg-brand text-background'
                  : 'hover:bg-surface-accent text-ink'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-surface-accent hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
