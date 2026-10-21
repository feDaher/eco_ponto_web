'use client';

import { useState } from 'react';

import { Download, Plus, Archive, ClockAlert, History } from 'lucide-react';

import MetricCard from '@/components/admin/MetricCard';
import CategoryTable from '@/components/admin/CategoryTable';
import AlertPointsTable from '@/components/admin/AlertPointsTable';
import NewCategoryModal from '@/components/admin/NewCategoryModal';
import AuditTable from '@/components/admin/AuditTable';

export default function CategoriasPage() {
  const [aba, setAba] = useState(1);
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div className="pt-1 px-12 bg-[#F8F9FF]">
      <div className="flex items-center gap-3 mb-2">
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
          ● Painel de Configuração Operacional
        </span>

        <span className="text-gray-400">•</span>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="max-w-xl text-3xl font-semibold leading-tight text-gray-900">
            Gestão de Categorias e Horários de Coleta
          </h1>

          <p className="mt-2 max-w-xl text-base leading-snug text-gray-600">
            Administre as categorias de resíduos eletrônicos homologados,
            diretrizes de destinação licenciada e atualize a malha horária dos
            ecopontos com sinalização de desatualização cadastral.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-sm"
          >
            <Download size={17} />
            Exportar Parâmetros (CSV/PDF)
          </button>

          <button
            type="button"
            onClick={() => setModalAberto(true)}
            className="flex items-center gap-2 rounded-xl bg-[#36654A] px-4 py-3 text-sm font-medium text-white"
          >
            <Plus size={18} />
            Nova Categoria de Resíduo
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-5">
        <MetricCard tipo={1} />
        <MetricCard tipo={2} />
        <MetricCard tipo={3} />
        <MetricCard tipo={4} />
      </div>

      <div className="mt-5 flex justify-center gap-5">
        <button
          type="button"
          onClick={() => setAba(1)}
          className={`inline-flex w-fit items-center gap-3 rounded-2xl px-5 py-1 ${
            aba === 1
              ? 'bg-green-800 text-white'
              : 'bg-white text-gray-700 shadow-sm'
          }`}
        >
          <Archive size={21} />
          <span className="text-lg font-medium">
            Categorias de Resíduos (CRUD)
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              aba === 1 ? 'bg-white/20' : 'bg-gray-100'
            }`}
          >
            8
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAba(2)}
          className={`inline-flex w-fit gap-3 rounded-2xl px-5 py-3 text-left ${
            aba === 2
              ? 'bg-green-800 text-white'
              : 'bg-white text-gray-700 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2">
            <ClockAlert size={20} />
            <span className="text-lg font-medium">
              Pontos com Horários em Alerta
            </span>
          </div>
          <span
            className={`rounded-full px-4 py-1 text-sm font-semibold ${
              aba === 2 ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
            }`}
          >
            4 pendentes
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAba(3)}
          className={`flex w-fit items-center gap-2 rounded-2xl px-5 py-3 text-left ${
            aba === 3
              ? 'bg-green-800 text-white'
              : 'bg-white text-gray-700 shadow-sm'
          }`}
        >
          <History size={18} />
          <span className="text-lg font-medium">Histórico de Auditoria</span>
        </button>
      </div>

      {aba === 1 && <CategoryTable />}

      {aba === 2 && <AlertPointsTable />}

      {aba === 3 && <AuditTable />}
      {modalAberto && (
        <NewCategoryModal onClose={() => setModalAberto(false)} />
      )}
    </div>
  );
}
