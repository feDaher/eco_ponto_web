import type { CollectionPoint, PointDetails } from '@/types/api';

type MockDetails = Omit<PointDetails, keyof CollectionPoint>;

const WEEKDAYS_MON_FRI = [1, 2, 3, 4, 5] as const;

export const mockPointDetails: Record<string, MockDetails> = {
  '1': {
    description:
      'Ponto de coleta destinado ao recebimento, triagem e encaminhamento de materiais recicláveis e resíduos eletrônicos.',
    responsible: 'Cooperativa Regional de Catadores de Manhuaçu',
    verification: {
      verified: true,
      monitored: true,
      lastVerifiedAt: '2026-09-08',
      updatedAt: '2026-09-10',
    },
    whatsapp: { authorized: true, phone: '5533999999999' },
    schedule: [
      { weekdays: [...WEEKDAYS_MON_FRI], opens: '08:00', closes: '18:00' },
      { weekdays: [6], opens: '08:00', closes: '12:00' },
    ],
    closedOnHolidays: true,
    acceptedItems: [
      {
        name: 'Laptops e PCs',
        material: 'eletronicos',
        description: 'Notebooks, desktops e servidores',
      },
      {
        name: 'Celulares',
        material: 'eletronicos',
        description: 'Smartphones e tablets',
      },
      {
        name: 'Baterias e pilhas',
        material: 'pilhas',
        description: 'Pilhas AA, AAA e baterias de equipamentos',
      },
      {
        name: 'Cabos e fios',
        material: 'metal',
        description: 'Carregadores, fios de cobre e cabos',
      },
      {
        name: 'Monitores e TVs',
        material: 'eletronicos',
        description: 'LED, LCD e CRT até 40 polegadas',
      },
      {
        name: 'Eletrodomésticos',
        material: 'eletronicos',
        description: 'Micro-ondas, liquidificadores e pequenos aparelhos',
      },
    ],
    capacity: {
      unit: 'kg',
      individualLimit: 50,
      individualNote: 'Sem necessidade de agendamento.',
      businessMinimum: 100,
      businessNote:
        'MTR obrigatório. Para cargas e condições especiais, consulte o responsável.',
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
        id: '1',
        author: 'Marcos Andrade',
        rating: 5,
        comment:
          'Atendimento super ágil, entreguei duas caixas com baterias e notebooks velhos e consegui resolver tudo rapidamente.',
        date: '2026-09-22',
        neighborhood: 'Centro',
      },
      {
        id: '2',
        author: 'Camila Silveira',
        rating: 5,
        comment:
          'Ponto muito organizado, fácil de estacionar e a equipe é super atenciosa.',
        date: '2026-09-15',
        neighborhood: 'Centro',
      },
      {
        id: '3',
        author: 'Rodrigo Oliveira',
        rating: 4,
        comment:
          'Achei sensacional, só poderia ter mais sinalização na entrada.',
        date: '2026-09-05',
        neighborhood: 'Vila Palma',
      },
    ],
    coverage: {
      radiusKm: 15,
      description: 'Atendimento principal em Manhuaçu e bairros próximos.',
    },
    additionalInfo: {
      parking: ['Vagas gratuitas', 'Área para carga e descarga'],
      safeDisposal: [
        'Destruição segura de dados em equipamentos eletrônicos',
        'Orientações de descarte em conformidade com a LGPD',
      ],
      receipts: ['Comprovante digital', 'Comprovante físico'],
    },
    destination: {
      description:
        'Os materiais entregues são encaminhados para triagem, beneficiamento e reciclagem por meio de cooperativas parceiras.',
      recycledTons: 14.2,
      landfillPercentage: 0,
      familiesBenefited: 85,
      partnerCooperatives: 3,
    },
  },
  '2': {
    description:
      'Loja parceira que recebe pequenos eletrônicos, celulares e pilhas para logística reversa.',
    responsible: 'Casas Bahia - Unidade Manhuaçu',
    verification: {
      verified: true,
      monitored: false,
      lastVerifiedAt: '2026-08-28',
      updatedAt: '2026-09-02',
    },
    whatsapp: { authorized: false, phone: '5533988888888' },
    schedule: [
      { weekdays: [1, 2, 3, 4, 5, 6], opens: '09:00', closes: '19:00' },
    ],
    closedOnHolidays: true,
    acceptedItems: [
      {
        name: 'Celulares',
        material: 'eletronicos',
        description: 'Smartphones, tablets e carregadores',
      },
      {
        name: 'Pilhas',
        material: 'pilhas',
        description: 'Pilhas comuns e recarregáveis',
      },
    ],
    capacity: {
      unit: 'unidade',
      individualLimit: 10,
      individualNote: 'Entregue no balcão de atendimento.',
    },
    rules: ['Não são aceitos eletrodomésticos de grande porte.'],
    reviews: [
      {
        id: '1',
        author: 'Juliana Costa',
        rating: 4,
        comment: 'Prático para deixar pilhas enquanto faço compras.',
        date: '2026-09-18',
        neighborhood: 'Centro',
      },
    ],
  },
  '3': {
    description:
      'Cooperativa de catadores que faz a triagem de recicláveis secos do município.',
    responsible: 'Cooperativa de Recicláveis Bom Jardim',
    verification: {
      verified: true,
      monitored: true,
      lastVerifiedAt: '2026-09-20',
      updatedAt: '2026-09-25',
    },
    whatsapp: { authorized: true, phone: '5533977777777' },
    schedule: [
      { weekdays: [...WEEKDAYS_MON_FRI], opens: '07:00', closes: '17:00' },
    ],
    closedOnHolidays: true,
    acceptedItems: [
      {
        name: 'Garrafas PET',
        material: 'plastico',
        description: 'Garrafas e embalagens plásticas limpas',
      },
      {
        name: 'Papelão',
        material: 'papel',
        description: 'Caixas desmontadas e papel seco',
      },
      {
        name: 'Latas',
        material: 'metal',
        description: 'Latas de alumínio e aço',
      },
      {
        name: 'Vidros',
        material: 'vidro',
        description: 'Garrafas e potes inteiros',
      },
    ],
    capacity: {
      unit: 'kg',
      individualLimit: 100,
      businessMinimum: 500,
      businessNote: 'Coleta em empresas mediante agendamento.',
    },
    rules: [
      'Materiais devem estar limpos e secos.',
      'Vidros quebrados devem ser embalados.',
    ],
    reviews: [],
    destination: {
      description:
        'Os recicláveis são prensados e vendidos para a indústria, gerando renda para as famílias cooperadas.',
      recycledTons: 32.5,
      familiesBenefited: 40,
    },
  },
  '4': {
    description:
      'Supermercado com coletor de óleo de cozinha usado e embalagens plásticas.',
    responsible: 'Supermercado Coleta Óleo',
    verification: {
      verified: true,
      monitored: false,
      lastVerifiedAt: '2026-09-01',
      updatedAt: '2026-09-01',
    },
    schedule: [
      { weekdays: [0, 1, 2, 3, 4, 5, 6], opens: '07:00', closes: '21:00' },
    ],
    closedOnHolidays: false,
    acceptedItems: [
      {
        name: 'Óleo de cozinha',
        material: 'oleo',
        description: 'Óleo usado em garrafa PET bem fechada',
      },
      {
        name: 'Embalagens plásticas',
        material: 'plastico',
        description: 'Potes e frascos limpos',
      },
    ],
    capacity: { unit: 'litros', individualLimit: 5 },
    rules: ['Não misture água ou restos de comida no óleo.'],
    reviews: [
      {
        id: '1',
        author: 'Ana Paula',
        rating: 5,
        comment: 'Aberto todos os dias, muito fácil de usar.',
        date: '2026-09-10',
        neighborhood: 'Coqueiro',
      },
    ],
  },
  '5': {
    description:
      'Ponto de coleta escolar mantido pelos alunos do projeto Ponto Verde.',
    responsible: 'Escola Estadual - Projeto Ponto Verde',
    verification: {
      verified: false,
      monitored: false,
      updatedAt: '2026-09-12',
    },
    schedule: [
      { weekdays: [...WEEKDAYS_MON_FRI], opens: '07:00', closes: '12:00' },
    ],
    closedOnHolidays: true,
    acceptedItems: [
      {
        name: 'Papel',
        material: 'papel',
        description: 'Folhas, cadernos e jornais',
      },
      {
        name: 'Pilhas',
        material: 'pilhas',
        description: 'Pilhas e baterias pequenas',
      },
    ],
    capacity: { unit: 'kg', individualLimit: 10 },
    rules: ['Entrada somente pela portaria da escola.'],
    reviews: [],
  },
  '6': {
    description:
      'Ferro-velho que recebe sucata metálica e eletrônicos para desmontagem.',
    responsible: 'Ferro-Velho São Vicente',
    verification: {
      verified: true,
      monitored: false,
      lastVerifiedAt: '2026-08-30',
      updatedAt: '2026-09-04',
    },
    schedule: [
      { weekdays: [1, 2, 3, 4, 5, 6], opens: '08:00', closes: '17:00' },
    ],
    closedOnHolidays: true,
    acceptedItems: [
      {
        name: 'Sucata metálica',
        material: 'metal',
        description: 'Ferro, alumínio, cobre e latão',
      },
      {
        name: 'Eletrônicos',
        material: 'eletronicos',
        description: 'Aparelhos para desmontagem',
      },
    ],
    capacity: {
      unit: 'kg',
      businessMinimum: 200,
      businessNote: 'Pagamento por quilo conforme tabela do dia.',
    },
    rules: ['Não são aceitos botijões de gás.'],
    reviews: [
      {
        id: '1',
        author: 'Paulo Henrique',
        rating: 3,
        comment: 'Atendimento bom, mas o local é um pouco difícil de achar.',
        date: '2026-08-20',
        neighborhood: 'São Vicente',
      },
    ],
  },
  '7': {
    description: 'Contêiner público para descarte de vidros.',
    responsible: 'Prefeitura de Manhuaçu',
    verification: {
      verified: true,
      monitored: false,
      lastVerifiedAt: '2026-06-15',
      updatedAt: '2026-06-30',
    },
    schedule: [
      { weekdays: [...WEEKDAYS_MON_FRI], opens: '08:00', closes: '16:00' },
    ],
    closedOnHolidays: true,
    acceptedItems: [
      {
        name: 'Vidros',
        material: 'vidro',
        description: 'Garrafas, potes e frascos',
      },
    ],
    capacity: { unit: 'kg', individualLimit: 20 },
    rules: ['Não descarte espelhos, cerâmicas ou lâmpadas.'],
    reviews: [],
  },
};
