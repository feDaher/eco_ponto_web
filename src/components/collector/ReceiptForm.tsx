'use client';

import { useState, type SubmitEvent } from 'react';
import { Check, ClipboardPlus } from 'lucide-react';
import { useCollector } from '@/components/collector/collectorContext';
import { SectionCard } from '@/components/point/SectionCard';
import { FIELD_CLASS, LABEL_CLASS } from '@/components/point/fieldStyles';
import { Button } from '@/components/ui/Button';
import { receiptDestinations } from '@/data/mockCollector';
import { COLLECTOR_SECTIONS } from '@/lib/routes';

const OPTION_CLASS =
  'flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-card p-3 text-sm text-slate-700 transition-colors hover:border-brand-medium has-checked:border-brand has-checked:bg-brand-light has-focus-visible:ring-2 has-focus-visible:ring-brand';

export function ReceiptForm() {
  const { selectedPoint } = useCollector();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = (selectedPoint?.categories ?? [])
    .filter((category) => category.approvalStatus === 'APPROVED')
    .map((category) => ({
      id: category.categoryId,
      value: category.code,
      label: category.label,
    }));

  const terminalLabel = selectedPoint?.name;
  const hasCategories = categories.length > 0;

  function submitReceipt(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasCategories) return;
    setIsSubmitted(true);
  }

  return (
    <SectionCard
      id={COLLECTOR_SECTIONS.receipt}
      title="Registrar recebimento de resíduo"
      eyebrow={terminalLabel}
      icon={ClipboardPlus}
    >
      <form
        onSubmit={submitReceipt}
        onChange={() => setIsSubmitted(false)}
        className="grid gap-5"
      >
        <label className={LABEL_CLASS}>
          <span className="flex flex-wrap justify-between gap-1">
            Munícipe ou empresa doadora
            <span className="text-xs font-normal text-slate-500">
              Opcional para pessoa física
            </span>
          </span>
          <input
            type="text"
            name="doador"
            autoComplete="off"
            placeholder="Nome do cidadão, CPF ou razão social"
            className={FIELD_CLASS}
          />
        </label>

        <fieldset className="grid gap-2">
          <legend className="mb-1.5 text-sm font-medium text-slate-800">
            Categoria aceita pelo ponto
          </legend>

          {hasCategories ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {categories.map((category, index) => (
                <label key={category.id} className={OPTION_CLASS}>
                  <input
                    type="radio"
                    name="categoria"
                    value={category.value}
                    defaultChecked={index === 0}
                    className="mt-0.5 accent-brand"
                  />
                  <span className="font-semibold">{category.label}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 bg-surface px-3.5 py-3 text-xs text-slate-500">
              Nenhuma categoria habilitada para este ponto no momento.
            </p>
          )}
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={LABEL_CLASS}>
            Peso aferido ou estimado (kg)
            <input
              type="number"
              name="peso"
              required
              min={0.1}
              step={0.1}
              inputMode="decimal"
              placeholder="Ex.: 8,5"
              className={FIELD_CLASS}
            />
          </label>
          <label className={LABEL_CLASS}>
            Quantidade de itens ou caixas
            <input
              type="number"
              name="quantidade"
              required
              min={1}
              step={1}
              defaultValue={1}
              inputMode="numeric"
              className={FIELD_CLASS}
            />
          </label>
        </div>

        <fieldset className="grid gap-2">
          <legend className="mb-1.5 text-sm font-medium text-slate-800">
            Destinação inicial
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {receiptDestinations.map((destination, index) => (
              <label key={destination.id} className={OPTION_CLASS}>
                <input
                  type="radio"
                  name="destinacao"
                  value={destination.id}
                  defaultChecked={index === 0}
                  className="mt-0.5 accent-brand"
                />
                <span>
                  <span className="block font-semibold">
                    {destination.label}
                  </span>
                  <span className="text-xs text-slate-500">
                    {destination.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" disabled={!hasCategories}>
            <Check aria-hidden="true" />
            Confirmar entrada
          </Button>
          <p className="text-xs text-slate-500">
            {selectedPoint
              ? 'Demonstração: o recebimento não será salvo.'
              : 'Cadastre um ponto de coleta para registrar entradas.'}
          </p>
        </div>

        {isSubmitted && (
          <p role="status" className="text-sm font-medium text-brand">
            Entrada conferida para {terminalLabel}. Demonstração: nada foi
            salvo.
          </p>
        )}
      </form>
    </SectionCard>
  );
}
