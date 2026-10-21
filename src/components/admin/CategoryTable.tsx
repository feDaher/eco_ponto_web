'use client';

import { useState } from 'react';

import {
  Battery,
  Laptop,
  Smartphone,
  Cable,
  Monitor,
  TriangleAlert,
  Leaf,
  CircleCheck,
  LockKeyhole,
  Pencil,
  CirclePause,
  Truck,
  Search,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react';

import EditCategoryModal from './EditCategoryModal';

type Categoria = {
  id: number;

  nome: string;
  codigoIbama: string;
  informacoes: string[];

  icone: 'battery' | 'laptop' | 'smartphone' | 'cable' | 'monitor';
  corIcone: 'red' | 'green';

  classe: 'Classe I' | 'Classe II A' | 'Classe II B';
  descricaoClasse: string;
  descricaoPericulosidade: string[];

  destinador: string;
  licenca: string[];

  processo: string[];

  visibilidade: 'ativo' | 'bloqueio';
  descricaoVisibilidade?: string[];
};

const categorias: Categoria[] = [
  {
    id: 1,

    nome: 'Baterias, Células de Lítio & Pilhas',

    codigoIbama: '16 06 01*',

    informacoes: ['Lotes com triagem', 'selada'],

    icone: 'battery',
    corIcone: 'red',

    classe: 'Classe I',
    descricaoClasse: 'Perigoso',

    descricaoPericulosidade: ['NBR 10004:', 'Tóxico/Corrosivo'],

    destinador: 'CicloLimpo Reciclagem Química',

    licenca: ['Licença FEAM nº', '2048/2022'],

    processo: ['Hidrometalurgia &', 'Recuperação de', 'Chumbo/Cobalto'],

    visibilidade: 'ativo',
  },

  {
    id: 2,

    nome: 'Computadores, Laptops & Placas-Mãe (TI)',

    codigoIbama: '16 02 14',

    informacoes: ['Linha Verde TI'],

    icone: 'laptop',
    corIcone: 'green',

    classe: 'Classe II A',
    descricaoClasse: 'Não Inerte',

    descricaoPericulosidade: ['Sem risco químico', 'primário'],

    destinador: 'E-Tec Reversa Manhuaçu',

    licenca: ['Licença FEAM nº', '8831/2021'],

    processo: ['Descaracterização', 'mecânica & refino de', 'metais nobres'],

    visibilidade: 'ativo',
  },

  {
    id: 3,

    nome: 'Smartphones & Celulares Antigos',

    codigoIbama: '16 02 16',

    informacoes: ['Logística Reversa', 'Prioritária'],

    icone: 'smartphone',
    corIcone: 'green',

    classe: 'Classe II A',
    descricaoClasse: 'Não Inerte',

    descricaoPericulosidade: ['Bateria destacada', 'na triagem'],

    destinador: 'TechRecycle MG',

    licenca: ['Licença SUPRAM-', 'ZM nº 119/2023'],

    processo: ['Trituração segura &', 'descaracterização de', 'memória LGPD'],

    visibilidade: 'ativo',
  },

  {
    id: 4,

    nome: 'Cabos, Fontes & Conectores',

    codigoIbama: '17 04 11',

    informacoes: ['Cobre e Polímeros'],

    icone: 'cable',
    corIcone: 'green',

    classe: 'Classe II B',
    descricaoClasse: 'Inerte',

    descricaoPericulosidade: ['Alto valor de', 'reciclagem', 'cooperativa'],

    destinador: 'Cooperativa Regional de Catadores',

    licenca: ['Convênio', 'Municipal PM-MANH nº', '44/2024'],

    processo: ['Granulação de cobre', '& reinserção', 'industrial de PVC'],

    visibilidade: 'ativo',
  },

  {
    id: 5,

    nome: 'Monitores CRT & Telas Antigas',

    codigoIbama: '16 02 13*',

    informacoes: ['Vidro com Chumbo &', 'Fósforo'],

    icone: 'monitor',
    corIcone: 'red',

    classe: 'Classe I',
    descricaoClasse: 'Perigoso',

    descricaoPericulosidade: ['Vidro plumbífero', 'de alta toxicidade'],

    destinador: 'Minas Metais Especiais S.A.',

    licenca: ['Licença Federal', 'IBAMA nº', '771/2020'],

    processo: ['Despressurização', 'controlada &', 'vitrificação inerte'],

    visibilidade: 'bloqueio',

    descricaoVisibilidade: ['Inativo no mapa geral'],
  },

  {
    id: 6,

    nome: 'Impressoras & Equipamentos de Escritório',

    codigoIbama: '16 02 14',

    informacoes: ['Equipamentos eletrônicos', 'de pequeno porte'],

    icone: 'laptop',
    corIcone: 'green',

    classe: 'Classe II A',
    descricaoClasse: 'Não Inerte',

    descricaoPericulosidade: ['Sem risco químico', 'primário'],

    destinador: 'EcoTech Reciclagem',

    licenca: ['Licença FEAM nº', '5120/2024'],

    processo: ['Desmontagem', 'e separação', 'de componentes'],

    visibilidade: 'ativo',
  },
];

const icones: Record<Categoria['icone'], LucideIcon> = {
  battery: Battery,
  laptop: Laptop,
  smartphone: Smartphone,
  cable: Cable,
  monitor: Monitor,
};

export default function CategoryTable() {
  const [pagina, setPagina] = useState(1);
  const [pesquisa, setPesquisa] = useState('');
  const [classeSelecionada, setClasseSelecionada] = useState('Todas');
  const [statusSelecionado, setStatusSelecionado] = useState('Todos');

  const [listaCategorias, setListaCategorias] =
    useState<Categoria[]>(categorias);

  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(
    null
  );

  const categoriasFiltradas = listaCategorias.filter((categoria) => {
    const textoPesquisa = pesquisa.toLowerCase();

    const correspondePesquisa =
      categoria.nome.toLowerCase().includes(textoPesquisa) ||
      categoria.codigoIbama.toLowerCase().includes(textoPesquisa) ||
      categoria.descricaoPericulosidade
        .join(' ')
        .toLowerCase()
        .includes(textoPesquisa);

    const correspondeClasse =
      classeSelecionada === 'Todas' || categoria.classe === classeSelecionada;

    const correspondeStatus =
      statusSelecionado === 'Todos' ||
      (statusSelecionado === 'Ativo' && categoria.visibilidade === 'ativo') ||
      (statusSelecionado === 'Inativo' &&
        categoria.visibilidade === 'bloqueio');

    return correspondePesquisa && correspondeClasse && correspondeStatus;
  });

  const itensPorPagina = 5;

  const totalPaginas = Math.max(
    1,
    Math.ceil(categoriasFiltradas.length / itensPorPagina)
  );

  const paginaAtual = Math.min(pagina, totalPaginas);

  const inicio = (paginaAtual - 1) * itensPorPagina;

  const categoriasDaPagina = categoriasFiltradas.slice(
    inicio,
    inicio + itensPorPagina
  );
  return (
    <div className="mt-5 w-full">
      <div className="mt-5 w-full">
        <div className="w-full rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-8">
            <div className="flex h-10 flex-1 items-center gap-3 rounded-xl bg-[#EEF3FD] px-4">
              <Search size={20} className="shrink-0 text-gray-500" />

              <input
                type="text"
                placeholder="Filtrar categoria, resíduo ou NBR..."
                value={pesquisa}
                onChange={(e) => {
                  setPesquisa(e.target.value);
                  setPagina(1);
                }}
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
              />
            </div>

            <select
              value={classeSelecionada}
              onChange={(e) => {
                setClasseSelecionada(e.target.value);
                setPagina(1);
              }}
              className="h-10 flex-1 rounded-xl bg-[#EEF3FD] px-4 text-sm text-gray-800 outline-none"
            >
              <option value="Todas">Todas as Classes de Risco</option>
              <option value="Classe I">Classe I</option>
              <option value="Classe II A">Classe II - A</option>
              <option value="Classe II B">Classe II - B</option>
            </select>

            <select
              value={statusSelecionado}
              onChange={(e) => {
                setStatusSelecionado(e.target.value);
                setPagina(1);
              }}
              className="h-10 flex-1 rounded-xl bg-[#EEF3FD] px-4 text-sm text-gray-800 outline-none"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setPesquisa('');
                setClasseSelecionada('Todas');
                setStatusSelecionado('Todos');
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
          grid-cols-[2.1fr_1.35fr_1.35fr_1.55fr_1.25fr_0.8fr]
          items-center
          gap-6
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
            <div>CATEGORIA & IDENTIFICAÇÃO</div>

            <div>
              PERICULOSIDADE
              <br />
              (ABNT)
            </div>

            <div>
              DESTINADOR
              <br />
              HOMOLOGADO
            </div>

            <div>
              PROCESSO DE
              <br />
              VALORIZAÇÃO
            </div>

            <div>
              VISIBILIDADE NO
              <br />
              MAPA
            </div>

            <div className="text-center">
              AÇÕES
              <br />
              OPERACIONAIS
            </div>
          </div>

          {categoriasDaPagina.map((categoria) => {
            const Icone = icones[categoria.icone];

            return (
              <div
                key={categoria.id}
                className="
              grid
              grid-cols-[2.1fr_1.35fr_1.35fr_1.55fr_1.25fr_0.8fr]
              gap-6
              border-b
              border-gray-100
              px-5
              py-6
            "
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      categoria.corIcone === 'red' ? 'bg-red-50' : 'bg-green-50'
                    }`}
                  >
                    <Icone
                      size={25}
                      strokeWidth={1.8}
                      className={
                        categoria.corIcone === 'red'
                          ? 'text-red-600'
                          : 'text-green-700'
                      }
                    />
                  </div>

                  <div>
                    <h3 className="text-[21px] font-semibold leading-tight text-[#172033]">
                      {categoria.nome}
                    </h3>

                    <p className="mt-1 text-[14px] leading-tight text-gray-500">
                      Código IBAMA: {categoria.codigoIbama}
                    </p>

                    {categoria.informacoes.map((informacao, index) => (
                      <p
                        key={index}
                        className="text-[14px] leading-tight text-gray-500"
                      >
                        {index === 0 ? '• ' : ''}
                        {informacao}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[14px] font-medium ${
                      categoria.classe === 'Classe I'
                        ? 'bg-red-100 text-red-700'
                        : categoria.classe === 'Classe II A'
                          ? 'bg-blue-100 text-gray-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {categoria.classe === 'Classe I' ? (
                      <TriangleAlert size={16} />
                    ) : (
                      <Leaf size={16} />
                    )}

                    <span>
                      {categoria.classe}
                      <br />({categoria.descricaoClasse})
                    </span>
                  </div>

                  <p className="mt-2 text-[14px] leading-tight text-gray-600">
                    {categoria.descricaoPericulosidade.map((texto, index) => (
                      <span key={index}>
                        {texto}
                        {index <
                          categoria.descricaoPericulosidade.length - 1 && (
                          <br />
                        )}
                      </span>
                    ))}
                  </p>
                </div>

                <div>
                  <p className="text-[16px] font-medium leading-tight text-[#172033]">
                    {categoria.destinador}
                  </p>

                  <p className="mt-1 text-[14px] leading-tight text-gray-600">
                    {categoria.licenca.map((texto, index) => (
                      <span key={index}>
                        {texto}
                        {index < categoria.licenca.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>

                <div className="flex items-center">
                  <p className="text-[16px] leading-snug text-[#172033]">
                    {categoria.processo.map((texto, index) => (
                      <span key={index}>
                        {texto}
                        {index < categoria.processo.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>

                <div className="flex items-center">
                  {categoria.visibilidade === 'ativo' ? (
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-2 text-[14px] font-medium text-green-700">
                      <CircleCheck size={15} />

                      <span>
                        Ativo no
                        <br />
                        Mapa Geral
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-red-100 px-3 py-2 text-[14px] font-semibold text-red-700">
                      <LockKeyhole size={15} />

                      <span>
                        {categoria.descricaoVisibilidade?.map(
                          (texto, index) => (
                            <span key={index}>
                              {texto}
                              {index <
                                (categoria.descricaoVisibilidade?.length ?? 0) -
                                  1 && <br />}
                            </span>
                          )
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCategoriaEditando(categoria)}
                    className="text-gray-600 hover:text-green-700"
                    title="Editar categoria"
                  >
                    <Pencil size={20} />
                  </button>

                  <button
                    type="button"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <CirclePause size={20} />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
            <p className="text-sm text-gray-600">
              Exibindo página {pagina} de {totalPaginas}
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
                      pagina === numeroPagina
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
      {categoriaEditando && (
        <EditCategoryModal
          categoria={categoriaEditando}
          onClose={() => setCategoriaEditando(null)}
          onSave={(categoriaAtualizada) => {
            setListaCategorias((categoriasAtuais) =>
              categoriasAtuais.map((categoria) =>
                categoria.id === categoriaAtualizada.id
                  ? categoriaAtualizada
                  : categoria
              )
            );

            setCategoriaEditando(null);
          }}
        />
      )}
    </div>
  );
}
