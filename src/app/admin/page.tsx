'use client';

import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  Leaf,
  RefreshCw,
  Settings,
  Users,
} from 'lucide-react';

import { EcoPontoIcon } from '@/components/icons/EcoPontoIcon';

/* =========================================================
   DADOS MOCKADOS
   ========================================================= */

const dashboardData = {
  activePoints: 18,
  totalCollected: 4820,
  registeredGuardians: 3428,
  esgCompliance: 99.4,
  co2Saved: 8.24,
};

const categories = [
  {
    name: 'Baterias, Células de Lítio & Pilhas',
    value: '1.480 kg',
    percent: 31,
    color: '#36654A',
  },
  {
    name: 'Computadores, Laptops & Placas-Mãe',
    value: '1.250 kg',
    percent: 26,
    color: '#4F7F62',
  },
  {
    name: 'Smartphones & Celulares Antigos',
    value: '840 kg',
    percent: 17,
    color: '#476555',
  },
  {
    name: 'Cabos, Fontes & Fios Nobres',
    value: '690 kg',
    percent: 14,
    color: '#5C7C65',
  },
  {
    name: 'Monitores & Telas',
    value: '560 kg',
    percent: 12,
    color: '#718078',
  },
];

const urnas = [
  {
    name: 'Praça Cordovi (EcoPonto Central)',
    percent: 88,
    status: '88% Cheia',
    critical: true,
  },
  {
    name: 'Drogaria Pacheco (Centro Comercial)',
    percent: 85,
    status: '85% Cheia',
    critical: true,
  },
  {
    name: 'EcoPonto Norte',
    percent: 42,
    status: '42% Ocupada',
    critical: false,
  },
];

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export default function AdminDashboardPage() {
  return (
    <div className="w-full">
      {/* =====================================================
          TOPO DO DASHBOARD
          ===================================================== */}

      <section className="mb-6 flex items-start justify-between gap-6">
        <div>
          {/* Badge */}
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#C9EAD6] px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#36654A]" />

            <span className="text-[10px] font-semibold text-[#36654A]">
              Painel de Inteligência Municipal
            </span>
          </div>

          {/* Título */}
          <h1 className="text-[24px] font-bold leading-tight tracking-[-0.5px] text-[#121C2A]">
            Visão Executiva & Gestão Operacional
          </h1>

          {/* Descrição */}
          <p className="mt-1 max-w-[570px] text-[11px] leading-4 text-[#5E6861]">
            Monitoramento consolidado dos ecopontos do Polo Regional Manhuaçu
            <span className="mx-1">•</span>
            Atualização em tempo real
          </p>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2 pt-4">
          <div className="flex items-center rounded-full bg-[#DEE9FC] p-1">
            <button
              type="button"
              className="rounded-full px-3 py-1 text-[10px] font-semibold text-[#414943]"
            >
              Últimos 7 dias
            </button>

            <button
              type="button"
              className="rounded-full bg-[#36654A] px-3 py-1 text-[10px] font-semibold text-white shadow-sm"
            >
              Este Mês (Outubro/2025)
            </button>

            <button
              type="button"
              className="rounded-full px-3 py-1 text-[10px] font-semibold text-[#414943]"
            >
              Ano 2025
            </button>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-[#36654A] shadow-sm"
          >
            <Download className="h-3 w-3" />
            Exportar Relatório ESG
          </button>
        </div>
      </section>

      {/* =====================================================
          KPIs
          ===================================================== */}

      <section className="grid grid-cols-4 gap-3">
        {/* KPI 1 */}
        <div className="rounded-xl border border-[#E3EAF4] bg-white p-4 shadow-[0_2px_10px_rgba(28,58,39,0.04)]">
          <div className="flex items-start justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-[#414943]">
              Pontos ativos
            </p>

            <div className="rounded-lg bg-[#DDF1E4] p-2">
              <EcoPontoIcon className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-end gap-1">
              <span className="text-[27px] font-bold leading-none text-[#121C2A]">
                {dashboardData.activePoints}
              </span>

              <span className="mb-0.5 text-[9px] text-[#414943]">
                pontos homologados
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              <span className="rounded-full bg-[#C9EAD6] px-2 py-0.5 text-[8px] font-bold text-[#36654A]">
                +8.0%
              </span>

              <span className="text-[8px] text-[#717972]">
                vs. mês anterior
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-[#E3EAF4] bg-white p-4 shadow-[0_2px_10px_rgba(28,58,39,0.04)]">
          <div className="flex items-start justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-[#414943]">
              Total coletado
            </p>

            <div className="rounded-lg bg-[#DDF1E4] p-2">
              <RefreshCw className="h-4 w-4 text-[#36654A]" />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-end gap-1">
              <span className="text-[27px] font-bold leading-none text-[#121C2A]">
                {dashboardData.totalCollected.toLocaleString('pt-BR')}
              </span>

              <span className="mb-0.5 text-[10px] font-bold text-[#36654A]">
                kg
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              <span className="rounded-full bg-[#C9EAD6] px-2 py-0.5 text-[8px] font-bold text-[#36654A]">
                +18.4%
              </span>

              <span className="text-[8px] text-[#717972]">
                vs. mês anterior
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-[#E3EAF4] bg-white p-4 shadow-[0_2px_10px_rgba(28,58,39,0.04)]">
          <div className="flex items-start justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-[#414943]">
              Guardiões cadastrados
            </p>

            <div className="rounded-lg bg-[#DEE9FC] p-2">
              <Users className="h-4 w-4 text-[#36654A]" />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-end gap-1">
              <span className="text-[27px] font-bold leading-none text-[#121C2A]">
                {dashboardData.registeredGuardians.toLocaleString('pt-BR')}
              </span>

              <span className="mb-0.5 text-[8px] text-[#414943]">
                cidadões & empresas
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              <span className="rounded-full bg-[#C9EAD6] px-2 py-0.5 text-[8px] font-bold text-[#36654A]">
                +312 novos
              </span>

              <span className="text-[8px] text-[#717972]">neste ciclo</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-[#E3EAF4] bg-white p-4 shadow-[0_2px_10px_rgba(28,58,39,0.04)]">
          <div className="flex items-start justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-[#414943]">
              Conformidade ESG
            </p>

            <div className="rounded-lg bg-[#DDF1E4] p-2">
              <Settings className="h-4 w-4 text-[#36654A]" />
            </div>
          </div>

          <div className="mt-5">
            <span className="text-[27px] font-bold leading-none text-[#36654A]">
              {dashboardData.esgCompliance}%
            </span>

            <div className="mt-2 flex items-center gap-1.5">
              <span className="rounded-full bg-[#C9EAD6] px-2 py-0.5 text-[8px] font-bold text-[#36654A]">
                Aterro Zero
              </span>

              <span className="text-[8px] text-[#717972]">100% Rastreável</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PARTE INFERIOR
          ===================================================== */}

      <section className="mt-4 grid grid-cols-[1.55fr_0.85fr] gap-3">
        {/* ===================================================
            COLETA POR CATEGORIA
            =================================================== */}

        <div className="rounded-xl border border-[#E3EAF4] bg-white p-4 shadow-[0_2px_10px_rgba(28,58,39,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <div className="rounded-lg bg-[#DDF1E4] p-1.5">
                <EcoPontoIcon className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-[13px] font-bold text-[#121C2A]">
                  Coleta por Categoria de Resíduo
                </h2>

                <p className="text-[9px] text-[#717972]">
                  Distribuição ponderada do volume segregado em Outubro
                </p>
              </div>
            </div>

            <div className="rounded-md bg-[#EEF2F7] px-2 py-1 text-right">
              <p className="text-[7px] font-semibold text-[#717972]">Total</p>
              <p className="text-[8px] font-bold text-[#121C2A]">4.820 kg</p>
            </div>
          </div>

          {/* Barra geral */}
          <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-[#E7EDF2]">
            {categories.map((category) => (
              <div
                key={category.name}
                style={{
                  width: `${category.percent}%`,
                  backgroundColor: category.color,
                }}
              />
            ))}
          </div>

          {/* Categorias */}
          <div className="mt-3 flex flex-col gap-1.5">
            {categories.map((category) => (
              <div
                key={category.name}
                className="rounded-lg bg-[#F5F8FB] px-2.5 py-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: category.color,
                      }}
                    />

                    <span className="truncate text-[8px] font-semibold text-[#121C2A]">
                      {category.name}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-[8px] font-bold text-[#121C2A]">
                      {category.value}
                    </span>

                    <span
                      className="rounded-full px-1.5 py-0.5 text-[7px] font-bold"
                      style={{
                        backgroundColor: `${category.color}20`,
                        color: category.color,
                      }}
                    >
                      {category.percent}%
                    </span>
                  </div>
                </div>

                <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#E1E8EF]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${category.percent}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================
            COLUNA DIREITA
            =================================================== */}

        <div className="flex flex-col gap-3">
          {/* IMPACTO ECOLÓGICO */}
          <div className="relative overflow-hidden rounded-xl bg-[#36654A] p-4 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-wide text-[#BFE6CB]">
                  Impacto Ecológico Direto
                </p>

                <p className="mt-1 text-[24px] font-bold leading-none">
                  {dashboardData.co2Saved}t de CO₂
                </p>

                <p className="mt-1 text-[8px] text-[#E8F5EC]">
                  evitadas na atmosfera de Manhuaçu
                </p>
              </div>

              <div className="rounded-xl bg-white/15 p-2">
                <Leaf className="h-5 w-5 text-[#C9EAD6]" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-2">
              <span className="text-[8px] text-white">
                Equivalente a 580 árvores preservadas
              </span>

              <span className="rounded-full bg-[#C9EAD6] px-2 py-1 text-[7px] font-bold text-[#36654A]">
                ESG A+
              </span>
            </div>
          </div>

          {/* CAPACIDADE DAS URNAS */}
          <div className="rounded-xl border border-[#E3EAF4] bg-white p-4 shadow-[0_2px_10px_rgba(28,58,39,0.04)]">
            <div className="flex items-start justify-between border-b border-[#E3EAF4] pb-2">
              <div className="flex items-start gap-2">
                <div className="rounded-lg bg-[#FFE3E0] p-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-[#BA1A1A]" />
                </div>

                <div>
                  <h2 className="text-[13px] font-bold text-[#121C2A]">
                    Capacidade das Urnas 24h
                  </h2>

                  <p className="text-[8px] text-[#717972]">
                    Telemetria dos postos municipais
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-[#FFE3E0] px-2 py-1 text-[7px] font-bold text-[#BA1A1A]">
                2 Urnas Cheias
              </span>
            </div>

            <div className="mt-2 flex flex-col gap-2">
              {urnas.map((urna) => (
                <div
                  key={urna.name}
                  className="rounded-lg border border-[#E5EBF1] bg-[#F6F8FA] p-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-1">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          urna.critical ? 'bg-[#BA1A1A]' : 'bg-[#36654A]'
                        }`}
                      />

                      <span className="truncate text-[8px] font-semibold text-[#121C2A]">
                        {urna.name}
                      </span>
                    </div>

                    <span
                      className={`text-[7px] font-bold ${
                        urna.critical ? 'text-[#BA1A1A]' : 'text-[#36654A]'
                      }`}
                    >
                      {urna.status}
                    </span>
                  </div>

                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#E0E7ED]">
                    <div
                      className={`h-full rounded-full ${
                        urna.critical ? 'bg-[#BA1A1A]' : 'bg-[#36654A]'
                      }`}
                      style={{
                        width: `${urna.percent}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          RODAPÉ / AÇÕES
          ===================================================== */}

      <section className="mt-4 flex items-center justify-between rounded-xl border border-[#E3EAF4] bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-[#DDF1E4] p-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#36654A]" />
          </div>

          <div>
            <p className="text-[10px] font-bold text-[#121C2A]">
              Sistema operando normalmente
            </p>

            <p className="text-[8px] text-[#717972]">
              Todos os serviços municipais estão funcionando.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-[#EEF2F7] px-3 py-1.5 text-[8px] font-semibold text-[#414943]"
          >
            <Filter className="h-3 w-3" />
            Filtrar
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-[#36654A] px-3 py-1.5 text-[8px] font-semibold text-white"
          >
            <Download className="h-3 w-3" />
            Exportar Relatório
          </button>
        </div>
      </section>
    </div>
  );
}
