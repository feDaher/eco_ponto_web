export type PillVariant = 'emerald' | 'sky' | 'slate';

export type MetaPill = {
  texto: string;
  icone: string;
  variante: PillVariant;
};

export type StepBadgeVariant =
  'danger' | 'success' | 'neutral' | 'info' | 'forest';

export type RecyclingStep = {
  numero: number;
  titulo: string;
  icone: string;
  descricao: string;
  badge: {
    texto: string;
    icone: string;
    variante: StepBadgeVariant;
  };
};

export type SortingItem = {
  icone: string;
  titulo: string;
  descricao: string;
};

export type SortingCategory = {
  titulo: string;
  descricao: string;
  iconePrincipal: string;
  cor: 'emerald' | 'red';
  itens: SortingItem[];
};

export type ImpactStat = {
  valor: string;
  label: string;
};

export type LogisticsPanel = {
  titulo: string;
  descricao: string;
};

export type EnvironmentalImpact = {
  pillTopo: string;
  pillIcone: string;
  titulo: string;
  descricao: string;
  estatisticas: ImpactStat[];
  painelLogistica: LogisticsPanel;
};

export type LocationBadgeVariant = 'emerald' | 'sky';

export type CollectionLocation = {
  nome: string;
  badge: { texto: string; variante: LocationBadgeVariant };
  endereco: string;
  icone: string;
  corIcone: LocationBadgeVariant;
  statusOpen: string;
  tipoAceito: string;
};

export type MapPlaceholder = {
  titulo: string;
  pillRegiao: string;
  descricao: string;
  labelPin: string;
  raioAtendimento: string;
  acessoPublico: string;
};

export type AccreditedLocations = {
  overline: string;
  titulo: string;
  subtitulo: string;
  linkTodosPostos: string;
  mapa: MapPlaceholder;
  postos: CollectionLocation[];
};

export type FaqItem = {
  pergunta: string;
  resposta: string;
};

export type EsgCta = {
  overline: string;
  titulo: string;
  descricao: string;
  botaoPrincipal: { texto: string; href: string };
  botaoSecundario: { texto: string; href: string };
};

export type GuideCategory = {
  slug: string;
  rotulo: string;
  icone: string;
  postos: string;
};

export type DisposalGuide = {
  slug: string;
  tituloH1: string;
  palavraDestaque: string;
  subtitulo: string;
  pillsHero: MetaPill[];
  ctaResumo: { texto: string; anchor: string };
  passos: RecyclingStep[];
  triagem: {
    overline: string;
    titulo: string;
    subtitulo: string;
    aceitos: SortingCategory;
    naoAceitos: SortingCategory;
  };
  impacto: EnvironmentalImpact;
  locais: AccreditedLocations;
  faq: FaqItem[];
  ctaEsg: EsgCta;
  categorias: GuideCategory[];
};
