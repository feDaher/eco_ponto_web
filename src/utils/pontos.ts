import { CollectionPoint } from './tipos';

const points: CollectionPoint[] = [
  {
    id: 1,

    slug: 'ecoponto-central-manhuacu',

    name: 'EcoPonto Central Manhuaçu',

    description:
      'Ponto de coleta destinado ao recebimento, triagem e encaminhamento de materiais recicláveis e resíduos eletrônicos.',

    responsiblePerson: 'Cooperativa Regional de Catadores de Manhuaçu',

    mainImage: '/imagens/ecoponto-central.jpg',

    status: {
      verified: true,

      monitored: true,

      lastVerification: '2026-09-08',

      lastUpdated: '2026-09-10',
    },

    address: {
      street: 'Rua Amaral Franco',

      number: '142',

      neighborhood: 'Centro',

      city: 'Manhuaçu',

      state: 'MG',

      timeZone: 'America/Sao_Paulo',

      coverage: {
        radiusKm: 15,

        description: 'Atendimento principal em Manhuaçu e bairros próximos.',
      },

      latitude: -20.2573,

      longitude: -42.0331,
    },

    contact: {
      whatsapp: {
        authorized: true,

        phoneNumber: '5533999999999',
      },
    },

    schedules: [
      {
        day: 'Segunda a Sexta',

        isOpen: true,

        startTime: '08:00',

        endTime: '18:00',
      },

      {
        day: 'Sábado',

        isOpen: true,

        startTime: '08:00',

        endTime: '12:00',
      },

      {
        day: 'Domingos e Feriados',

        isOpen: false,

        note: 'Fechado para atendimento geral',
      },
    ],

    categories: ['Plástico', 'Eletrônico', 'Papel', 'Vidro', 'Metal'],

    acceptedItems: [
      {
        name: 'Laptops & PCs',

        category: 'Eletrônico',

        description: 'Notebooks, desktops e servidores',
      },

      {
        name: 'Celulares',

        category: 'Eletrônico',

        description: 'Smartphones e tablets',
      },

      {
        name: 'Baterias & Pilhas',

        category: 'Eletrônico',

        description: 'Pilhas AA, AAA e baterias de equipamentos',
      },

      {
        name: 'Cabos & Fios',

        category: 'Metal',

        description: 'Carregadores, fios de cobre e cabos',
      },

      {
        name: 'Monitores & TVs',

        category: 'Eletrônico',

        description: 'LED, LCD e CRT até 40 polegadas',
      },

      {
        name: 'Eletrodomésticos',

        category: 'Eletrônico',

        description: 'Micro-ondas, liquidificadores e pequenos aparelhos',
      },
    ],

    capacity: {
      individualLimit: 50,

      businessMinimumQuantity: 100,

      businessNote:
        'Para cargas e condições especiais, consulte o responsável. O volume é combinado caso a caso.',

      unit: 'kg',
    },

    additionalInfo: {
      parking: ['Vagas gratuitas', 'Área para carga e descarga'],

      safeDisposal: [
        'Destruição segura de dados em equipamentos eletrônicos',
        'Orientações de descarte em conformidade com a LGPD',
      ],

      receipts: ['Comprovante digital', 'Comprovante físico'],
    },

    rules: [
      'Materiais volumosos devem ser agendados previamente.',

      'Não são aceitos resíduos perigosos.',

      'Materiais devem estar separados por categoria.',

      'Não descarte lâmpadas fluorescentes no local.',

      'O local não recebe resíduos orgânicos.',
    ],

    reviews: [
      {
        id: 1,

        user: 'Marcos Andrade',

        rating: 5,

        comment:
          'Atendimento super ágil, entreguei duas caixas com baterias e notebooks velhos e consegui resolver tudo rapidamente.',

        date: '2026-09-22',

        userLocation: 'Manhuaçu - Centro',
      },

      {
        id: 2,

        user: 'Camila Silveira',

        rating: 5,

        comment:
          'Ponto muito organizado, fácil de estacionar e a equipe é super atenciosa.',

        date: '2026-09-15',

        userLocation: 'Manhuaçu - Centro',
      },

      {
        id: 3,

        user: 'Rodrigo Oliveira',

        rating: 4,

        comment:
          'Achei sensacional, só poderia ter mais sinalização na entrada.',

        date: '2026-09-05',

        userLocation: 'Manhuaçu - Vila Palma',
      },
    ],

    destination: {
      description:
        'Os materiais entregues são encaminhados para triagem, beneficiamento e reciclagem por meio de cooperativas parceiras.',

      recycledMaterialTons: 14.2,

      rejectedWastePercentage: 0,

      familiesBenefited: 85,

      partnerCooperatives: 3,
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
