import { mockModeration } from '@/data/mockModeration';
import type { ModerationData } from '@/types/api';

export async function getModerationData(): Promise<ModerationData> {
  return structuredClone(mockModeration);
}
