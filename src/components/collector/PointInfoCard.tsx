'use client';

import Link from 'next/link';
import { Building2, MapPin, PlusCircle } from 'lucide-react';
import { SectionCard } from '@/components/point/SectionCard';
import { buttonVariants } from '@/components/ui/Button';
import { COLLECTOR_SECTIONS, ROUTES } from '@/lib/routes';
import type { PointStatus } from '@/types/api';
import { useCollector } from './collectorContext';

const STATUS_EYEBROW: Record<PointStatus, string> = {
  approved: 'Homologado',
  pending: 'Em análise',
  rejected: 'Reprovado',
  removed: 'Inativo',
};

export function PointInfoCard() {
  const { loading, selectedPoint: point } = useCollector();

  if (loading) {
    return (
      <div
        aria-hidden="true"
        className="h-40 animate-pulse rounded-2xl bg-slate-200/70"
      />
    );
  }

  if (!point) {
    return (
      <SectionCard
        id={COLLECTOR_SECTIONS.point}
        title="Dados do ponto"
        eyebrow="Sem cadastro"
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
            href={ROUTES.collectorSettings}
            className={buttonVariants({ size: 'sm' })}
          >
            <PlusCircle aria-hidden="true" />
            Cadastrar ponto de coleta
          </Link>
        </div>
      </SectionCard>
    );
  }

  const cityLine = [
    point.cooperative?.neighborhood,
    point.city,
    point.cooperative?.postalCode
      ? `CEP ${point.cooperative.postalCode}`
      : null,
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
        Alterações de endereço exigem aprovação prévia da moderação municipal.{' '}
        <Link
          href={ROUTES.collectorSettings}
          className="font-semibold text-brand hover:underline"
        >
          Editar dados do ponto
        </Link>
      </p>
    </SectionCard>
  );
}
