import { Building2, Package, Store, type LucideIcon } from 'lucide-react';
import type {
  ModerationDecision,
  RegionMetrics,
  RequestCategory,
} from '@/types/api';

export const CUSTOM_REASON = 'Outro motivo com parecer personalizado';

export const REJECTION_REASONS = [
  'Documentação incompleta ou vencida',
  'Falta de foto ou urna fora do padrão',
  'Localização fora da jurisdição do polo',
  CUSTOM_REASON,
];

export const REMOVAL_REASONS = [
  'Estabelecimento encerrou as atividades',
  'Licença ou documentação irregular',
  'Localização fora da jurisdição do polo',
  CUSTOM_REASON,
];

export const CATEGORIES: Record<
  RequestCategory,
  { label: string; icon: LucideIcon }
> = {
  community: { label: 'Ponto comunitário / escolar', icon: Building2 },
  specialized: { label: 'Descarte especializado', icon: Package },
  retail: { label: 'Varejo / urna interna', icon: Store },
};

export const DECISION_LABELS: Record<ModerationDecision, string> = {
  approved: 'Aprovado',
  rejected: 'Reprovado',
  removed: 'Removido',
};

const TIME_ZONE = 'America/Sao_Paulo';

const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const timeFormat = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
});

const percentFormat = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
});

const changeFormat = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
  signDisplay: 'always',
});

export function formatDate(iso: string) {
  return dateFormat.format(new Date(iso));
}

export function formatTime(iso: string) {
  return timeFormat.format(new Date(iso));
}

export function formatSubmittedAt(iso: string, now: number) {
  const day = dateFormat.format(new Date(iso));
  const time = formatTime(iso);

  if (day === dateFormat.format(now)) return `hoje, às ${time}`;
  if (day === dateFormat.format(now - 24 * 60 * 60 * 1000)) {
    return `ontem, às ${time}`;
  }
  return `em ${day}, às ${time}`;
}

export function approvalRate({ approved, rejected }: RegionMetrics) {
  const total = approved + rejected;
  return total === 0 ? 0 : Math.round((approved / total) * 1000) / 10;
}

export function formatPercent(value: number) {
  return `${percentFormat.format(value)}%`;
}

export function formatChange(value: number) {
  return changeFormat.format(Math.round(value * 10) / 10);
}
