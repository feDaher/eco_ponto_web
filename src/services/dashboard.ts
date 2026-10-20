export interface DashboardStats {
  activePoints: number;
  disponsalsInPeriod: number;
  registeredUsers: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_URL}/dashboard/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar estatísticas do dashboard');
  }

  return response.json();
}
