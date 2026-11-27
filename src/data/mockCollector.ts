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

export type CollectorMaterial = {
  id: string;
  name: string;
  description: string;
  storedKg: number;
  capacityKg: number;
  accepting: boolean;
};

export const collectorMaterials: CollectorMaterial[] = [
  {
    id: 'informatica',
    name: 'Informática & Placas-Mãe',
    description: 'Classe IIA • Desmanche mecânico manual',
    storedKg: 650,
    capacityKg: 1000,
    accepting: true,
  },
  {
    id: 'smartphones',
    name: 'Smartphones, Celulares & Cabos',
    description: 'Componentes nobres, cobre e terras raras',
    storedKg: 220,
    capacityKg: 500,
    accepting: true,
  },
  {
    id: 'pequenos',
    name: 'Pequenos Eletrodomésticos',
    description: 'Liquidificadores, batedeiras, secadores, cafeteiras',
    storedKg: 430,
    capacityKg: 800,
    accepting: true,
  },
  {
    id: 'grandes',
    name: 'Grandes Eletros / Linha Branca',
    description: 'Refrigeradores, fogões e lavadoras',
    storedKg: 700,
    capacityKg: 700,
    accepting: false,
  },
  {
    id: 'monitores',
    name: 'Monitores, Telas LCD & Tubos CRT',
    description: 'Vidro plumbífero e fósforo • Manuseio de alta cautela',
    storedKg: 880,
    capacityKg: 1000,
    accepting: true,
  },
];
