import { Building2, MapPin } from 'lucide-react';
import { SectionCard } from '@/components/point/SectionCard';
import { COLLECTOR_SECTIONS } from '@/lib/routes';
import { collectorProfile } from '@/data/mockCollector';

export function PointInfoCard() {
  const { address } = collectorProfile;

  return (
    <SectionCard
      id={COLLECTOR_SECTIONS.point}
      title="Dados do ponto"
      eyebrow="Homologado"
      icon={Building2}
    >
      <div className="flex items-start gap-2 rounded-xl border border-slate-200/60 bg-surface p-3 text-sm text-slate-600">
        <MapPin
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-brand"
        />
        <address className="not-italic">
          <span className="block font-bold text-slate-800">{address.name}</span>
          <span className="block">{address.street}</span>
          <span className="block">{address.city}</span>
        </address>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Alterações de endereço exigem aprovação prévia da moderação municipal.
      </p>
    </SectionCard>
  );
}
