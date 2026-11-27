import { mockUsers } from '@/data/mockUsers';
import type { ManagedUser } from '@/types/user';

export async function getManagedUsers(): Promise<ManagedUser[]> {
  return mockUsers;
}
