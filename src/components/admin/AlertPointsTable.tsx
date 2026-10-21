'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarClock, Clock, Pencil, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FIELD_CLASS } from '@/components/point/fieldStyles';
import {
  PointHoursForm,
  formatWeekdays,
} from '@/components/admin/PointHoursForm';
import { MATERIAL_IDS, MATERIALS } from '@/lib/materials';
import { OUTDATED_AFTER_DAYS, formatDate } from '@/lib/points';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { Material, OutdatedPoint } from '@/types/api';

const PERIOD_OPTIONS = [
  { value: OUTDATED_AFTER_DAYS, label: `Mais de ${OUTDATED_AFTER_DAYS} dias` },
  { value: 90, label: 'Mais de 90 dias' },
  { value: 180, label: 'Mais de 180 dias' },
];

type AlertPointsTableProps = {
  initialPoints: OutdatedPoint[];
};

export function AlertPointsTable({ initialPoints }: AlertPointsTableProps) {
  const [points, setPoints] = useState(initialPoints);
  const [query, setQuery] = useState('');
  const [material, setMaterial] = useState<Material | 'all'>('all');
  const [minDays, setMinDays] = useState(OUTDATED_AFTER_DAYS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const search = query.trim().toLocaleLowerCase('pt-BR');
  const visible = points.filter(
    (point) =>
      (point.days === null || point.days > minDays) &&
      (material === 'all' || point.materials.includes(material)) &&
      (!search ||
        `${point.name} ${point.address} ${point.neighborhood}`
          .toLocaleLowerCase('pt-BR')
          .includes(search))
  );

  function confirmHours(point: OutdatedPoint) {
    setPoints((current) => current.filter((item) => item.id !== point.id));
    setEditingId(null);
    setMessage(
      `Horários de "${point.name}" confirmados: o ponto saiu da lista de desatualizados. Demonstração: nada foi salvo.`
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar ponto ou endereço</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar ponto ou endereço"
            className={cn(FIELD_CLASS, 'w-full pl-9')}
          />
        </label>
        <label className="md:w-52">
          <span className="sr-only">Filtrar por categoria</span>
          <select
            value={material}
            onChange={(event) =>
              setMaterial(event.target.value as Material | 'all')
            }
            className={cn(FIELD_CLASS, 'w-full')}
          >
            <option value="all">Todas as categorias</option>
            {MATERIAL_IDS.map((id) => (
              <option key={id} value={id}>
                {MATERIALS[id].label}
              </option>
            ))}
          </select>
        </label>
        <label className="md:w-52">
          <span className="sr-only">Filtrar por tempo sem confirmação</span>
          <select
            value={minDays}
            onChange={(event) => setMinDays(Number(event.target.value))}
            className={cn(FIELD_CLASS, 'w-full')}
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {message && (
        <p
          role="status"
          className="rounded-xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark"
        >
          {message}
        </p>
      )}

      {visible.length > 0 ? (
        <ul className="space-y-3">
          {visible.map((point) => {
            const isEditing = editingId === point.id;

            return (
              <li
                key={point.id}
                className="space-y-3 rounded-2xl border border-slate-100 bg-card p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Link
                      href={ROUTES.point(point.slug)}
                      className="font-bold text-slate-900 hover:text-brand"
                    >
                      {point.name}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {point.address} - {point.neighborhood}
                    </p>
                    <p className="text-xs text-slate-500">
                      {point.materials
                        .map((m) => MATERIALS[m].label)
                        .join(', ')}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                    <CalendarClock aria-hidden="true" className="size-3.5" />
                    Confirmado em {formatDate(point.updatedAt)}
                    {point.days !== null && ` (há ${point.days} dias)`}
                  </span>
                </div>

                {isEditing ? (
                  <PointHoursForm
                    pointId={point.id}
                    pointName={point.name}
                    schedule={point.schedule}
                    onSave={() => confirmHours(point)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-3">
                    <ul className="space-y-0.5 text-sm text-slate-700">
                      {point.schedule.map((entry) => (
                        <li
                          key={formatWeekdays(entry.weekdays)}
                          className="flex items-center gap-1.5"
                        >
                          <Clock
                            aria-hidden="true"
                            className="size-3.5 text-slate-400"
                          />
                          {formatWeekdays(entry.weekdays)}: {entry.opens} às{' '}
                          {entry.closes}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="cursor-pointer"
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setMessage(null);
                        setEditingId(point.id);
                      }}
                    >
                      <Pencil aria-hidden="true" />
                      Editar horários
                      <span className="sr-only"> de {point.name}</span>
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-card px-4 py-8 text-center text-sm text-slate-500">
          {points.length === 0
            ? 'Nenhum ponto com horário desatualizado.'
            : 'Nenhum ponto encontrado com esses filtros.'}
        </p>
      )}
    </div>
  );
}
