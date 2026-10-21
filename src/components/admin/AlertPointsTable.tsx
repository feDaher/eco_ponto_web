'use client';

import { useState } from 'react';
import {
  MapPin,
  Clock,
  CalendarClock,
  TriangleAlert,
  Pencil,
  Search,
  RefreshCw,
  ClockAlert,
} from 'lucide-react';

type PontoAlerta = {
  id: number;
  nome: string;
  endereco: string;
  horario: string;
  ultimaAtualizacao: string;
};

const pontos: PontoAlerta[] = [
  {
    id: 1,
    nome: 'EcoPonto Centro',
    endereco: 'Av. Getúlio Vargas, 120',
    horario: '08:00 - 17:00',
    ultimaAtualizacao: '12/08/2026',
  },
  {
    id: 2,
    nome: 'EcoPonto São Pedro',
    endereco: 'Rua das Flores, 85',
    horario: '08:00 - 18:00',
    ultimaAtualizacao: '28/08/2026',
  },
  {
    id: 3,
    nome: 'EcoPonto Coqueiro',
    endereco: 'Av. Brasil, 450',
    horario: '07:00 - 17:00',
    ultimaAtualizacao: '20/06/2026',
  },
  {
    id: 4,
    nome: 'EcoPonto Bom Pastor',
    endereco: 'Rua Principal, 210',
    horario: '08:00 - 16:00',
    ultimaAtualizacao: '18/07/2026',
  },
  {
    id: 5,
    nome: 'EcoPonto Santana',
    endereco: 'Rua Santana, 90',
    horario: '08:00 - 17:00',
    ultimaAtualizacao: '10/04/2026',
  },
  {
    id: 6,
    nome: 'EcoPonto Petrina',
    endereco: 'Av. Petrina, 300',
    horario: '09:00 - 18:00',
    ultimaAtualizacao: '02/05/2026',
  },
  {
    id: 7,
    nome: 'EcoPonto Matinha',
    endereco: 'Rua da Matinha, 45',
    horario: '08:00 - 17:00',
    ultimaAtualizacao: '25/07/2026',
  },
  {
    id: 8,
    nome: 'EcoPonto Santa Luzia',
    endereco: 'Av. Castelo Branco, 210',
    horario: '07:00 - 16:00',
    ultimaAtualizacao: '15/01/2026',
  },
];
export default function AlertPointsTable() {
  const [pagina, setPagina] = useState(1);
  const [pesquisa, setPesquisa] = useState('');
  const [situacaoSelecionada, setSituacaoSelecionada] = useState('Todas');
  const [tempoSelecionado, setTempoSelecionado] = useState('Todos');

  function calcularDias(data: string) {
    const [dia, mes, ano] = data.split('/').map(Number);

    const ultimaData = new Date(ano, mes - 1, dia);
    const hoje = new Date();

    ultimaData.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    const diferenca = hoje.getTime() - ultimaData.getTime();

    return Math.floor(diferenca / (1000 * 60 * 60 * 24));
  }

  function verificarSituacao(data: string) {
    const dias = calcularDias(data);

    if (dias > 60) {
      return 'Desatualizado';
    } else if (dias >= 45) {
      return 'Atualização próxima';
    }
  }

  const pontosFiltrados = pontos.filter((ponto) => {
    const texto = pesquisa.toLowerCase();

    const correspondePesquisa =
      ponto.nome.toLowerCase().includes(texto) ||
      ponto.endereco.toLowerCase().includes(texto);

    const situacao = verificarSituacao(ponto.ultimaAtualizacao);

    const correspondeSituacao =
      situacaoSelecionada === 'Todas' ||
      (situacaoSelecionada === 'Atualização próxima' &&
        situacao === 'Atualização próxima') ||
      (situacaoSelecionada === 'Desatualizado' && situacao === 'Desatualizado');

    const dias = calcularDias(ponto.ultimaAtualizacao);

    const correspondeTempo =
      tempoSelecionado === 'Todos' ||
      (tempoSelecionado === 'Mais de 60 dias' && dias > 60) ||
      (tempoSelecionado === 'Mais de 90 dias' && dias > 90) ||
      (tempoSelecionado === 'Mais de 180 dias' && dias > 180);

    return correspondePesquisa && correspondeSituacao && correspondeTempo;
  });

  const itensPorPagina = 5;

  const totalPaginas = Math.max(
    1,
    Math.ceil(pontosFiltrados.length / itensPorPagina)
  );

  const paginaAtual = Math.min(pagina, totalPaginas);

  const inicio = (paginaAtual - 1) * itensPorPagina;

  const pontosDaPagina = pontosFiltrados.slice(inicio, inicio + itensPorPagina);

  return (
    <div className="mt-5 w-full">
      <div className="w-full rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 flex-1 items-center gap-3 rounded-xl bg-[#EEF3FD] px-4">
            <Search size={20} className="shrink-0 text-gray-500" />

            <input
              type="text"
              placeholder="Buscar ponto de coleta ou endereço..."
              value={pesquisa}
              onChange={(e) => {
                setPesquisa(e.target.value);
                setPagina(1);
              }}
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
            />
          </div>

          <select
            value={situacaoSelecionada}
            onChange={(e) => {
              setSituacaoSelecionada(e.target.value);
              setPagina(1);
            }}
            className="h-10 flex-1 rounded-xl bg-[#EEF3FD] px-4 text-sm text-gray-800 outline-none"
          >
            <option value="Todas">Todas as situações</option>
            <option value="Atualização próxima">Atualização próxima</option>
            <option value="Desatualizado">Desatualizado</option>
          </select>

          <select
            value={tempoSelecionado}
            onChange={(e) => {
              setTempoSelecionado(e.target.value);
              setPagina(1);
            }}
            className="h-10 flex-1 rounded-xl bg-[#EEF3FD] px-4 text-sm text-gray-800 outline-none"
          >
            <option value="Todos">Todos os períodos</option>
            <option value="Mais de 60 dias">Mais de 60 dias</option>
            <option value="Mais de 90 dias">Mais de 90 dias</option>
            <option value="Mais de 180 dias">Mais de 180 dias</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setPesquisa('');
              setSituacaoSelecionada('Todas');
              setTempoSelecionado('Todos');
              setPagina(1);
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E2ECFA] text-[#477D63]"
            title="Limpar filtros"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="mt-7 w-full overflow-hidden rounded-2xl bg-white shadow-sm">
        <div
          className="
          grid
          grid-cols-[1.5fr_1.6fr_1.2fr_1.2fr_1.2fr_0.7fr]
          items-center
          gap-5
          bg-[#EEF3FD]
          px-5
          py-4
          text-sm
          font-semibold
          uppercase
          tracking-wide
          text-gray-700
        "
        >
          <div>PONTO DE COLETA</div>

          <div>ENDEREÇO</div>

          <div>
            HORÁRIO
            <br />
            ATUAL
          </div>

          <div>
            ÚLTIMA
            <br />
            ATUALIZAÇÃO
          </div>

          <div>SITUAÇÃO</div>

          <div className="text-center">AÇÃO</div>
        </div>

        {pontosDaPagina.map((ponto) => (
          <div
            key={ponto.id}
            className="
            grid
            grid-cols-[1.5fr_1.6fr_1.2fr_1.2fr_1.2fr_0.7fr]
            items-center
            gap-5
            border-b
            border-gray-100
            px-5
            py-6
          "
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                <MapPin size={22} className="text-orange-600" />
              </div>

              <div>
                <h3 className="text-[17px] font-semibold leading-tight text-[#172033]">
                  {ponto.nome}
                </h3>

                <p className="mt-1 text-[13px] text-gray-500">
                  Ponto de coleta
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={17} className="shrink-0 text-gray-400" />

              <p className="text-[14px] leading-tight text-gray-600">
                {ponto.endereco}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={18} className="text-gray-500" />

              <p className="text-[15px] font-medium text-[#172033]">
                {ponto.horario}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <CalendarClock size={18} className="text-gray-500" />

              <p className="text-[14px] text-gray-600">
                {ponto.ultimaAtualizacao}
              </p>
            </div>

            <div>
              {verificarSituacao(ponto.ultimaAtualizacao) ===
              'Desatualizado' ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-2 text-[13px] font-semibold text-red-700">
                  <TriangleAlert size={15} />
                  <span>Desatualizado</span>
                </div>
              ) : verificarSituacao(ponto.ultimaAtualizacao) ===
                'Atualização próxima' ? (
                <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-2 text-[13px] font-semibold text-amber-700">
                  <ClockAlert size={15} />
                  <span>Atualização próxima</span>
                </div>
              ) : null}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-[#EEF3FD] px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                <Pencil size={17} />
                Editar
              </button>
            </div>
          </div>
        ))}

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
    </div>
  );
}
