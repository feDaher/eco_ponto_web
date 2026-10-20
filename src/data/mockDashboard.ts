import type { DashboardStats } from '@/types/api';

export const mockDashboard: DashboardStats = {
  period: 'Outubro de 2026',
  activePoints: 18,
  activePointsGrowth: 8,
  collectedKg: 4820,
  collectedGrowth: 18.4,
  registeredUsers: 3428,
  newUsers: 312,
  traceability: 99.4,
  co2SavedTons: 8.24,
  treesEquivalent: 580,
  categories: [
    { name: 'Baterias, células de lítio e pilhas', kg: 1480 },
    { name: 'Computadores, laptops e placas-mãe', kg: 1250 },
    { name: 'Smartphones e celulares antigos', kg: 840 },
    { name: 'Cabos, fontes e fios', kg: 690 },
    { name: 'Monitores e telas', kg: 560 },
  ],
  bins: [
    { name: 'Praça Cordovil (EcoPonto Central)', fillPercent: 88 },
    { name: 'Drogaria Pacheco (Centro Comercial)', fillPercent: 85 },
    { name: 'EcoPonto Norte', fillPercent: 42 },
  ],
};
