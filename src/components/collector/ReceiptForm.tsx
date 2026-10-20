'use client';

import { useState, type SubmitEvent } from 'react';
import { Check, ClipboardPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/point/SectionCard';
import { FIELD_CLASS, LABEL_CLASS } from '@/components/point/fieldStyles';
import { COLLECTOR_SECTIONS } from '@/lib/routes';
import {
  collectorProfile,
  receiptCategories,
  receiptDestinations,
} from '@/data/mockCollector';

const OPTION_CLASS =
  'flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-card p-3 text-sm text-slate-700 transition-colors hover:border-brand-medium has-checked:border-brand has-checked:bg-brand-light has-focus-visible:ring-2 has-focus-visible:ring-brand';

export function ReceiptForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function submitReceipt(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  return (
    <SectionCard
      id={COLLECTOR_SECTIONS.receipt}
      title="Registrar recebimento de resíduo"
      eyebrow={collectorProfile.terminal}
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
          <div className="grid gap-2 sm:grid-cols-2">
            {receiptCategories.map((category, index) => (
              <label key={category.id} className={OPTION_CLASS}>
                <input
                  type="radio"
                  name="categoria"
                  value={category.id}
                  defaultChecked={index === 0}
                  className="mt-0.5 accent-brand"
                />
                <span className="font-semibold">{category.label}</span>
              </label>
            ))}
          </div>
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
          <Button type="submit" size="lg">
            <Check aria-hidden="true" />
            Confirmar entrada
          </Button>
          <p className="text-xs text-slate-500">
            Demonstração: o recebimento não será salvo.
          </p>
        </div>

        {isSubmitted && (
          <p role="status" className="text-sm font-medium text-brand">
            Demonstração concluída. Nenhum recebimento foi salvo.
          </p>
        )}
      </form>
    </SectionCard>
  );
}
