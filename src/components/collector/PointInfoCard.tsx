import Link from 'next/link';
import { Building2, MapPin, PlusCircle } from 'lucide-react';
import { SectionCard } from '@/components/point/SectionCard';
import { COLLECTOR_SECTIONS, ROUTES } from '@/lib/routes';
import type { PointStatus } from '@/types/api';
import type { CollectorPoint } from '@/types/collector';

type PointInfoCardProps = {
  point: CollectorPoint | null;
  registerHref?: string;
};

const STATUS_EYEBROW: Record<PointStatus, string> = {
  approved: 'Homologado',
  pending: 'Em análise',
  rejected: 'Rejeitado',
  removed: 'Removido',
};

export function PointInfoCard({
  point,
  registerHref = ROUTES.account,
}: PointInfoCardProps) {
  if (!point) {
    return (
      <SectionCard
        id={COLLECTOR_SECTIONS.point}
        title="Dados do ponto"
        eyebrow="Sem Cadastro"
        icon={Building2}
      >
        <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-surface p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">
            Nenhum ponto de coleta vinculado
          </p>
          <p className="text-xs leading-relaxed text-slate-500">
            Cadastre seu ecoponto para aparecer no mapa público, configurar
            horários e receber materiais.
          </p>
          <Link
            href={registerHref}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <PlusCircle aria-hidden="true" className="size-3.5" />
            Cadastrar ponto de coleta
          </Link>
        </div>
      </SectionCard>
    );
  }
  const cityLine = [
    point.neighborhood,
    point.city,
    point.cep ? `CEP ${point.cep}` : null,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <SectionCard
      id={COLLECTOR_SECTIONS.point}
      title="Dados do ponto"
      eyebrow={STATUS_EYEBROW[point.status]}
      icon={Building2}
    >
      <div className="flex items-start gap-2 rounded-xl border border-slate-200/60 bg-surface p-3 text-sm text-slate-600">
        <MapPin
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-brand"
        />
        <address className="not-italic">
          <span className="block font-bold text-slate-800">{point.name}</span>
          {point.address && <span className="block">{point.address}</span>}
          {cityLine && <span className="block">{cityLine}</span>}
        </address>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Alterações de endereço exigem aprovação prévia da moderação municipal.
      </p>
    </SectionCard>
  );
}
