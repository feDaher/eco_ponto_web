'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UserManagementPaginationProps {
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export default function UserManagementPagination({
  currentPage = 1,
  totalPages = 4,
  pageSize = 6,
  totalCount = 24,
  onPageChange,
  onPageSizeChange,
}: UserManagementPaginationProps) {
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageButtons = () => {
    const buttons = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            type="button"
            onClick={() => onPageChange && onPageChange(i)}
            className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition ${
              currentPage === i
                ? 'bg-[#2d6a4f] font-bold text-white'
                : 'border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-100'
            }`}
          >
            {i}
          </button>
        );
      }
      return buttons;
    }

    for (let i = 1; i <= 4; i++) {
      buttons.push(
        <button
          key={i}
          type="button"
          onClick={() => onPageChange && onPageChange(i)}
          className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition ${
            currentPage === i
              ? 'bg-[#2d6a4f] font-bold text-white'
              : 'border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-100'
          }`}
        >
          {i}
        </button>
      );
    }

    buttons.push(
      <span key="ellipsis" className="px-1 text-slate-400">
        ...
      </span>
    );

    buttons.push(
      <button
        key={totalPages}
        type="button"
        onClick={() => onPageChange && onPageChange(totalPages)}
        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs transition ${
          currentPage === totalPages
            ? 'bg-[#2d6a4f] font-bold text-white'
            : 'border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-100'
        }`}
      >
        {totalPages}
      </button>
    );

    return buttons;
  };

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 p-4 text-xs text-slate-500 sm:flex-row">
      {/* Contagem e Seleção de Linhas */}
      <div>
        Mostrando{' '}
        <strong className="text-slate-800">
          {startItem}–{endItem}
        </strong>{' '}
        de <strong className="text-slate-800">{totalCount.toLocaleString('pt-BR')}</strong>{' '}
        usuários cadastrados
        <span className="mx-2 text-slate-300">|</span>
        Linhas por página:{' '}
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
          className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-semibold text-slate-700 focus:outline-none"
        >
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={24}>24</option>
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={handlePrevious}
          className={`flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 ${
            currentPage === 1
              ? 'cursor-not-allowed bg-white text-slate-400 opacity-60'
              : 'bg-white font-semibold text-slate-700 transition hover:bg-slate-100'
          }`}
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Anterior
        </button>

        {renderPageButtons()}

        <button
          type="button"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={handleNext}
          className={`flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 ${
            currentPage === totalPages || totalPages === 0
              ? 'cursor-not-allowed bg-white text-slate-400 opacity-60'
              : 'bg-white font-semibold text-slate-700 transition hover:bg-slate-100'
          }`}
        >
          Próxima <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}