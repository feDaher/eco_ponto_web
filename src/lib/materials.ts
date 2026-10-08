import {
  Battery,
  Cpu,
  Droplet,
  FileText,
  GlassWater,
  Recycle,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { Material } from '@/types/api';

type MaterialInfo = {
  label: string;
  icon: LucideIcon;
};

export const MATERIALS: Record<Material, MaterialInfo> = {
  pilhas: { label: 'Pilhas e baterias', icon: Battery },
  eletronicos: { label: 'Eletrônicos', icon: Cpu },
  plastico: { label: 'Plástico', icon: Recycle },
  papel: { label: 'Papel', icon: FileText },
  vidro: { label: 'Vidro', icon: GlassWater },
  metal: { label: 'Metal', icon: Wrench },
  oleo: { label: 'Óleo de cozinha', icon: Droplet },
};

export const MATERIAL_IDS = Object.keys(MATERIALS) as Material[];
