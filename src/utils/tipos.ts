export type WasteCategory =
  'Plástico' | 'Eletrônico' | 'Papel' | 'Vidro' | 'Metal';

export interface CollectionSchedule {
  dia: string;
  aberto: boolean;
  inicio?: string;
  fim?: string;
  observacao?: string;
}

export interface AcceptedItem {
  nome: string;
  categoria: WasteCategory;
  descricao: string;
  icone?: string;
}

export interface AdditionalPointInfo {
  estacionamento?: string[];
  descarteSeguro?: string[];
  comprovantes?: string[];
}

export interface Review {
  id: number;
  usuario: string;
  nota: 1 | 2 | 3 | 4 | 5;
  comentario: string;
  data: string;
  localizacaoUsuario?: string;
}

export interface WasteDestination {
  descricao: string;

  materialRecicladoToneladas?: number;

  percentualRejeitos?: number;

  familiasBeneficiadas?: number;

  cooperativasParceiras?: number;

  relatorioUrl?: string;
}

export interface CollectionPoint {
  id: number;

  slug: string;

  nome: string;

  descricao: string;

  responsavel: string;

  imagemPrincipal: string;

  status: {
    verificado: boolean;

    monitorado: boolean;

    ultimaVerificacao: string;

    ultimaAtualizacao: string;
  };

  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    fusoHorario?: string;
    cobertura?: {
      raioKm?: number;
      descricao?: string;
    };

    latitude: number;
    longitude: number;
  };

  contato: {
    whatsapp: {
      autorizado: boolean;
      numero?: string;
    };
  };

  horarios: CollectionSchedule[];

  categorias: WasteCategory[];

  itensAceitos: AcceptedItem[];

  capacidade: {
    limitePessoaFisica?: number;
    quantidadeMinimaEmpresa?: number;
    observacaoEmpresa?: string;
    unidade: 'kg' | 'unidade' | 'litros';
  };

  regras: string[];

  avaliacoes: Review[];

  informacoesAdicionais?: AdditionalPointInfo;

  destinacao?: WasteDestination;
}
