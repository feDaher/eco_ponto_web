export type CollectorCategory = {
  id: string;
  label: string;
};

export type ReceiptDestination = {
  id: string;
  label: string;
  description: string;
};

export type ReceiptStatus = 'sorted' | 'awaiting';

export type CollectorReceipt = {
  id: string;
  time: string;
  donor: string;
  donorType: string;
  description: string;
  weightKg: number;
  status: ReceiptStatus;
};

export type CollectorSchedule = {
  id: string;
  label: string;
  hours: string;
  open: boolean;
};

export const collectorProfile = {
  name: 'Cooperativa Manhuaçu Recicla',
  shortName: 'Coop. Manhuaçu Recicla',
  unit: 'Unidade Central Operacional • MG',
  cnpj: '14.821.902/0001-34',
  terminal: 'Terminal Operador #02',
  isOpen: true,
  address: {
    name: 'Galpão Central Manhuaçu',
    street: 'Av. Tancredo Neves, 1200 - Bairro Coqueiro',
    city: 'Manhuaçu - MG • CEP 36900-000',
  },
};

export const pendingRequest = {
  protocol: '#SOL-9412',
  title: 'Alterações críticas em análise',
  category: 'Baterias de Lítio e Veiculares',
  detail: 'ajuste de endereço complementar (Galpão B)',
};

export const collectorStats = {
  monthlyKg: 1420,
  monthlyGrowth: 12,
  storedKg: 2880,
  capacityKg: 4000,
  lastCheckIn: '08:30',
};

export const receiptCategories: CollectorCategory[] = [
  { id: 'computers', label: 'Informática e placas-mãe' },
  { id: 'smartphones', label: 'Smartphones e cabos' },
  { id: 'displays', label: 'Monitores e displays' },
  { id: 'small-appliances', label: 'Pequenos eletros' },
];

export const receiptDestinations: ReceiptDestination[] = [
  {
    id: 'decharacterization',
    label: 'Para descaracterização',
    description: 'Sucata eletrônica para moagem e refino.',
  },
  {
    id: 'reuse',
    label: 'Reutilização / peças',
    description: 'Equipamento íntegro para recondicionamento social.',
  },
];

export const recentReceipts: CollectorReceipt[] = [
  {
    id: '#REC-8821',
    time: '14:15',
    donor: 'João M. Silva',
    donorType: 'Munícipe',
    description: '2 laptops e carregadores periféricos',
    weightKg: 12.5,
    status: 'sorted',
  },
  {
    id: '#MTR-2026-0914',
    time: '11:30',
    donor: 'Alfa Contabilidade Ltda.',
    donorType: 'PJ / Gerador',
    description: 'Gabinetes desktop, placas e cabos estruturados',
    weightKg: 45,
    status: 'awaiting',
  },
  {
    id: '#REC-8819',
    time: '09:45',
    donor: 'Maria Oliveira',
    donorType: 'Munícipe',
    description: 'Aparelhos celulares antigos e baterias alcalinas comuns',
    weightKg: 3.2,
    status: 'sorted',
  },
];

export const collectorSchedule: CollectorSchedule[] = [
  {
    id: 'weekdays',
    label: 'Segunda a sexta',
    hours: '08:00 às 17:30',
    open: true,
  },
  { id: 'saturday', label: 'Sábado', hours: '08:00 às 12:00', open: true },
  { id: 'sunday', label: 'Domingo', hours: '08:00 às 12:00', open: false },
];

export const authorizedCategories = [
  'TI e computadores',
  'Cabos e fontes',
  'Smartphones e tablets',
  'Pequenos eletros',
];

export const categoryUnderReview = {
  label: 'Baterias e células de lítio',
  phase: 'Fase 2 de 3',
  description:
    'Aguardando vistoria técnica do Corpo de Bombeiros e laudo com responsabilidade técnica (ART).',
};
