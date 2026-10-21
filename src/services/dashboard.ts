import { mockDashboard } from '@/data/mockDashboard';
import type { DashboardStats } from '@/types/api';

export async function getDashboardStats(): Promise<DashboardStats> {
  return mockDashboard;
}
