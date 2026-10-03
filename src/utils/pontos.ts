import { CollectionPoint } from './tipos';

const points: CollectionPoint[] = [
  {
    id: 1,

    slug: 'ecoponto-central-manhuacu',

    nome: 'EcoPonto Central Manhuaçu',

    descricao:
      'Ponto de coleta destinado ao recebimento, triagem e encaminhamento de materiais recicláveis e resíduos eletrônicos.',

    responsavel: 'Cooperativa Regional de Catadores de Manhuaçu',

    imagemPrincipal: '/imagens/ecoponto-central.jpg',

    status: {
      verificado: true,

      monitorado: true,

      ultimaVerificacao: '2026-09-08',

      ultimaAtualizacao: '2026-09-10',
    },

    endereco: {
      rua: 'Rua Amaral Franco',

      numero: '142',

      bairro: 'Centro',

      cidade: 'Manhuaçu',

      estado: 'MG',

      fusoHorario: 'America/Sao_Paulo',

      cobertura: {
        raioKm: 15,

        descricao: 'Atendimento principal em Manhuaçu e bairros próximos.',
      },

      latitude: -20.2573,

      longitude: -42.0331,
    },

    contato: {
      whatsapp: {
        autorizado: true,

        numero: '5533999999999',
      },
    },

    horarios: [
      {
        dia: 'Segunda a Sexta',

        aberto: true,

        inicio: '08:00',

        fim: '18:00',
      },

      {
        dia: 'Sábado',

        aberto: true,

        inicio: '08:00',

        fim: '12:00',
      },

      {
        dia: 'Domingos e Feriados',

        aberto: false,

        observacao: 'Fechado para atendimento geral',
      },
    ],

    categorias: ['Plástico', 'Eletrônico', 'Papel', 'Vidro', 'Metal'],

    itensAceitos: [
      {
        nome: 'Laptops & PCs',

        categoria: 'Eletrônico',

        descricao: 'Notebooks, desktops e servidores',
      },

      {
        nome: 'Celulares',

        categoria: 'Eletrônico',

        descricao: 'Smartphones e tablets',
      },

      {
        nome: 'Baterias & Pilhas',

        categoria: 'Eletrônico',

        descricao: 'Pilhas AA, AAA e baterias de equipamentos',
      },

      {
        nome: 'Cabos & Fios',

        categoria: 'Metal',

        descricao: 'Carregadores, fios de cobre e cabos',
      },

      {
        nome: 'Monitores & TVs',

        categoria: 'Eletrônico',

        descricao: 'LED, LCD e CRT até 40 polegadas',
      },

      {
        nome: 'Eletrodomésticos',

        categoria: 'Eletrônico',

        descricao: 'Micro-ondas, liquidificadores e pequenos aparelhos',
      },
    ],

    capacidade: {
      limitePessoaFisica: 50,

      quantidadeMinimaEmpresa: 100,

      observacaoEmpresa:
        'Para cargas e condições especiais, consulte o responsável. O volume é combinado caso a caso.',

      unidade: 'kg',
    },

    informacoesAdicionais: {
      estacionamento: ['Vagas gratuitas', 'Área para carga e descarga'],

      descarteSeguro: [
        'Destruição segura de dados em equipamentos eletrônicos',
        'Orientações de descarte em conformidade com a LGPD',
      ],

      comprovantes: ['Comprovante digital', 'Comprovante físico'],
    },

    regras: [
      'Materiais volumosos devem ser agendados previamente.',

      'Não são aceitos resíduos perigosos.',

      'Materiais devem estar separados por categoria.',

      'Não descarte lâmpadas fluorescentes no local.',

      'O local não recebe resíduos orgânicos.',
    ],

    avaliacoes: [
      {
        id: 1,

        usuario: 'Marcos Andrade',

        nota: 5,

        comentario:
          'Atendimento super ágil, entreguei duas caixas com baterias e notebooks velhos e consegui resolver tudo rapidamente.',

        data: '2026-09-22',

        localizacaoUsuario: 'Manhuaçu - Centro',
      },

      {
        id: 2,

        usuario: 'Camila Silveira',

        nota: 5,

        comentario:
          'Ponto muito organizado, fácil de estacionar e a equipe é super atenciosa.',

        data: '2026-09-15',

        localizacaoUsuario: 'Manhuaçu - Centro',
      },

      {
        id: 3,

        usuario: 'Rodrigo Oliveira',

        nota: 4,

        comentario:
          'Achei sensacional, só poderia ter mais sinalização na entrada.',

        data: '2026-09-05',

        localizacaoUsuario: 'Manhuaçu - Vila Palma',
      },
    ],

    destinacao: {
      descricao:
        'Os materiais entregues são encaminhados para triagem, beneficiamento e reciclagem por meio de cooperativas parceiras.',

      materialRecicladoToneladas: 14.2,

      percentualRejeitos: 0,

      familiasBeneficiadas: 85,

      cooperativasParceiras: 3,
    },
  },
];

export async function findPointBySlug(
  slug: string
): Promise<CollectionPoint | null> {
  return points.find((point) => point.slug === slug) ?? null;
}

export async function getAllPoints(): Promise<CollectionPoint[]> {
  return points;
}
