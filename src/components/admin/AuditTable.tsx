'use client';

import { useState } from 'react';
import {
  Search,
  RefreshCw,
  Eye,
  X,
  PlusCircle,
  Pencil,
  Clock,
  Ban,
  RotateCcw,
} from 'lucide-react';

type AcaoAuditoria =
  | 'Categoria criada'
  | 'Categoria editada'
  | 'Categoria desativada'
  | 'Categoria reativada'
  | 'Horário atualizado';

type RegistroAuditoria = {
  id: number;
  dataHora: string;
  administrador: string;
  acao: AcaoAuditoria;
  registro: string;
  tipoRegistro: 'Categoria' | 'Ponto de coleta';
  detalhes: string;
  valorAnterior?: string;
  valorNovo?: string;
};

const registros: RegistroAuditoria[] = [
  {
    id: 1,
    dataHora: '20/10/2026 16:00',
    administrador: 'Ana Silva',
    acao: 'Horário atualizado',
    registro: 'EcoPonto São Pedro',
    tipoRegistro: 'Ponto de coleta',
    detalhes: 'O horário de funcionamento do ponto foi alterado.',
    valorAnterior: '08:00 - 17:00',
    valorNovo: '08:00 - 18:00',
  },
  {
    id: 2,
    dataHora: '20/10/2026 15:25',
    administrador: 'Maria Souza',
    acao: 'Categoria desativada',
    registro: 'Monitores CRT',
    tipoRegistro: 'Categoria',
    detalhes: 'A categoria foi desativada no painel administrativo.',
    valorAnterior: 'Ativa',
    valorNovo: 'Inativa',
  },
  {
    id: 3,
    dataHora: '20/10/2026 14:45',
    administrador: 'Ana Silva',
    acao: 'Categoria editada',
    registro: 'Computadores e notebooks',
    tipoRegistro: 'Categoria',
    detalhes: 'O nome da categoria foi atualizado.',
    valorAnterior: 'Computadores',
    valorNovo: 'Computadores e notebooks',
  },
  {
    id: 4,
    dataHora: '19/10/2026 11:30',
    administrador: 'Maria Souza',
    acao: 'Horário atualizado',
    registro: 'EcoPonto Centro',
    tipoRegistro: 'Ponto de coleta',
    detalhes: 'O horário de funcionamento do ponto foi alterado.',
    valorAnterior: '08:00 - 17:00',
    valorNovo: '08:00 - 18:00',
  },
  {
    id: 5,
    dataHora: '18/10/2026 10:15',
    administrador: 'Ana Silva',
    acao: 'Categoria criada',
    registro: 'Pilhas e baterias',
    tipoRegistro: 'Categoria',
    detalhes: 'Uma nova categoria de resíduos foi cadastrada.',
    valorNovo: 'Categoria criada',
  },
  {
    id: 6,
    dataHora: '15/10/2026 09:40',
    administrador: 'Maria Souza',
    acao: 'Categoria reativada',
    registro: 'Cabos e conectores',
    tipoRegistro: 'Categoria',
    detalhes: 'A categoria voltou a ficar disponível.',
    valorAnterior: 'Inativa',
    valorNovo: 'Ativa',
  },
  {
    id: 7,
    dataHora: '05/10/2026 13:20',
    administrador: 'Ana Silva',
    acao: 'Horário atualizado',
    registro: 'EcoPonto Santana',
    tipoRegistro: 'Ponto de coleta',
    detalhes: 'O horário de funcionamento do ponto foi alterado.',
    valorAnterior: '08:00 - 16:00',
    valorNovo: '08:00 - 17:00',
  },
];

const iconesAcao: Record<AcaoAuditoria, typeof PlusCircle> = {
  'Categoria criada': PlusCircle,
  'Categoria editada': Pencil,
  'Categoria desativada': Ban,
  'Categoria reativada': RotateCcw,
  'Horário atualizado': Clock,
};

function obterData(dataHora: string) {
  const [data] = dataHora.split(' ');
  const [dia, mes, ano] = data.split('/').map(Number);
  return new Date(ano, mes - 1, dia);
}

export default function AuditHistoryTable() {
  const [pesquisa, setPesquisa] = useState('');
  const [acaoSelecionada, setAcaoSelecionada] = useState('Todas');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('Todos');
  const [pagina, setPagina] = useState(1);
  const [registroSelecionado, setRegistroSelecionado] =
    useState<RegistroAuditoria | null>(null);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const registrosFiltrados = registros.filter((registro) => {
    const texto = pesquisa.toLowerCase();

    const correspondePesquisa =
      registro.administrador.toLowerCase().includes(texto) ||
      registro.registro.toLowerCase().includes(texto);

    const correspondeAcao =
      acaoSelecionada === 'Todas' || registro.acao === acaoSelecionada;

    const dataRegistro = obterData(registro.dataHora);
    const dias = Math.floor(
      (hoje.getTime() - dataRegistro.getTime()) / (1000 * 60 * 60 * 24)
    );

    const correspondePeriodo =
      periodoSelecionado === 'Todos' ||
      (periodoSelecionado === '7' && dias <= 7 && dias >= 0) ||
      (periodoSelecionado === '30' && dias <= 30 && dias >= 0);

    return correspondePesquisa && correspondeAcao && correspondePeriodo;
  });

  const itensPorPagina = 5;
  const totalPaginas = Math.max(
    1,
    Math.ceil(registrosFiltrados.length / itensPorPagina)
  );
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const registrosDaPagina = registrosFiltrados.slice(
    inicio,
    inicio + itensPorPagina
  );

  function limparFiltros() {
    setPesquisa('');
    setAcaoSelecionada('Todas');
    setPeriodoSelecionado('Todos');
    setPagina(1);
  }

  return (
    <div className="mt-5 w-full">
      {/* CARTÃO BRANCO DA PESQUISA E DOS FILTROS */}
      <div className="w-full rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex h-10 flex-1 items-center gap-3 rounded-xl bg-[#EEF3FD] px-4">
            <Search size={20} className="shrink-0 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar administrador ou registro..."
              value={pesquisa}
              onChange={(e) => {
                setPesquisa(e.target.value);
                setPagina(1);
              }}
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
            />
          </div>

          <select
            value={acaoSelecionada}
            onChange={(e) => {
              setAcaoSelecionada(e.target.value);
              setPagina(1);
            }}
            className="h-10 flex-1 rounded-xl bg-[#EEF3FD] px-4 text-sm text-gray-800 outline-none"
          >
            <option value="Todas">Todas as ações</option>
            <option value="Categoria criada">Categoria criada</option>
            <option value="Categoria editada">Categoria editada</option>
            <option value="Categoria desativada">Categoria desativada</option>
            <option value="Categoria reativada">Categoria reativada</option>
            <option value="Horário atualizado">Horário atualizado</option>
          </select>

          <select
            value={periodoSelecionado}
            onChange={(e) => {
              setPeriodoSelecionado(e.target.value);
              setPagina(1);
            }}
            className="h-10 flex-1 rounded-xl bg-[#EEF3FD] px-4 text-sm text-gray-800 outline-none"
          >
            <option value="Todos">Todos os períodos</option>
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
          </select>

          <button
            type="button"
            onClick={limparFiltros}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E2ECFA] text-[#477D63]"
            title="Limpar filtros"
            aria-label="Limpar filtros"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="mt-7 w-full overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="grid grid-cols-[1.35fr_1.2fr_1.45fr_1.5fr_0.75fr] items-center gap-4 bg-[#EEF3FD] px-5 py-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
          <div>DATA E HORA</div>
          <div>ADMINISTRADOR</div>
          <div>AÇÃO REALIZADA</div>
          <div>REGISTRO ALTERADO</div>
          <div className="text-center">DETALHES</div>
        </div>

        {registrosDaPagina.length > 0 ? (
          registrosDaPagina.map((registro) => {
            const IconeAcao = iconesAcao[registro.acao];

            return (
              <div
                key={registro.id}
                className="grid grid-cols-[1.35fr_1.2fr_1.45fr_1.5fr_0.75fr] items-center gap-4 border-b border-gray-100 bg-white px-5 py-5"
              >
                <div className="text-sm text-gray-600">{registro.dataHora}</div>

                <div className="text-sm font-medium text-[#172033]">
                  {registro.administrador}
                </div>

                <div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                      registro.acao === 'Categoria criada' ||
                      registro.acao === 'Categoria reativada'
                        ? 'bg-green-100 text-green-700'
                        : registro.acao === 'Categoria desativada'
                          ? 'bg-red-100 text-red-700'
                          : registro.acao === 'Categoria editada'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <IconeAcao size={15} />
                    {registro.acao}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-[#172033]">
                    {registro.registro}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {registro.tipoRegistro}
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setRegistroSelecionado(registro)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-800"
                    title="Ver detalhes"
                  >
                    <Eye size={18} />
                    <span>Ver</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-5 py-10 text-center text-sm text-gray-500">
            Nenhum registro encontrado.
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
          <p className="text-sm text-gray-600">
            Exibindo página {paginaAtual} de {totalPaginas}
          </p>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPaginas }, (_, index) => {
              const numeroPagina = index + 1;

              return (
                <button
                  key={numeroPagina}
                  type="button"
                  onClick={() => setPagina(numeroPagina)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    paginaAtual === numeroPagina
                      ? 'bg-green-800 text-white'
                      : 'bg-[#F1F4FA] text-gray-700'
                  }`}
                >
                  {numeroPagina}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {registroSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-detalhes"
            className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="titulo-detalhes"
                  className="text-xl font-semibold text-[#172033]"
                >
                  Detalhes do registro
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Informações da ação realizada no painel.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRegistroSelecionado(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Fechar detalhes"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Data e hora</p>
                <p className="mt-1 font-medium text-[#172033]">
                  {registroSelecionado.dataHora}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Administrador</p>
                <p className="mt-1 font-medium text-[#172033]">
                  {registroSelecionado.administrador}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Ação realizada</p>
                <p className="mt-1 font-medium text-[#172033]">
                  {registroSelecionado.acao}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Registro alterado</p>
                <p className="mt-1 font-medium text-[#172033]">
                  {registroSelecionado.registro} (
                  {registroSelecionado.tipoRegistro})
                </p>
              </div>

              <div>
                <p className="text-gray-500">Descrição</p>
                <p className="mt-1 text-[#172033]">
                  {registroSelecionado.detalhes}
                </p>
              </div>

              {registroSelecionado.valorAnterior && (
                <div>
                  <p className="text-gray-500">Valor anterior</p>
                  <p className="mt-1 font-medium text-[#172033]">
                    {registroSelecionado.valorAnterior}
                  </p>
                </div>
              )}

              {registroSelecionado.valorNovo && (
                <div>
                  <p className="text-gray-500">Novo valor</p>
                  <p className="mt-1 font-medium text-[#172033]">
                    {registroSelecionado.valorNovo}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-7 flex justify-end">
              <button
                type="button"
                onClick={() => setRegistroSelecionado(null)}
                className="rounded-xl bg-green-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-900"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
