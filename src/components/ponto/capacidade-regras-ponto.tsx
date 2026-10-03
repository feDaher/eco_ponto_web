import { CircleAlert, Scale } from 'lucide-react';

import type { CollectionPoint } from '@/utils/tipos';

type PointCapacityRulesProps = {
  capacity: CollectionPoint['capacidade'];
  rules: CollectionPoint['regras'];
};

function formatQuantity(
  value: number | undefined,
  unit: CollectionPoint['capacidade']['unidade']
) {
  if (value === undefined) {
    return 'Não informado';
  }

  if (unit === 'unidade') {
    return `${value} ${value === 1 ? 'unidade' : 'unidades'} por entrega`;
  }

  return `${value} ${unit} por entrega`;
}

export function PointCapacityRules({
  // regras de capacidade
  capacity,
  rules,
}: PointCapacityRulesProps) {
  return (
    <section
      aria-labelledby="capacidade-heading"
      className="rounded-lg border bg-card p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="capacidade-heading" className="text-lg font-semibold">
            Capacidade &amp; Regras de Aceite
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Limites e orientações para o descarte.
          </p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-800">
          <Scale aria-hidden="true" className="size-4" />
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-emerald-50 p-4">
          <p className="text-xs font-medium text-emerald-900">
            Limite pessoa física
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-900">
            {formatQuantity(capacity.limitePessoaFisica, capacity.unidade)}
          </p>
          <p className="mt-1 text-xs text-emerald-800">
            Sem necessidade de agendamento.
          </p>
        </div>
        <div className="rounded-md bg-sky-50 p-4">
          <p className="text-xs font-medium text-sky-900">Empresas e LTDA</p>
          <p className="mt-2 text-2xl font-semibold text-sky-900">
            {capacity.quantidadeMinimaEmpresa === undefined
              ? 'Consulte o responsável'
              : `+${formatQuantity(capacity.quantidadeMinimaEmpresa, capacity.unidade).replace(' por entrega', '')}`}
          </p>
          <p className="mt-1 text-xs text-sky-900">
            MTR obrigatório. Volumes especiais são combinados caso a caso.
          </p>
        </div>
      </div>

      {capacity.observacaoEmpresa && (
        <p className="mt-3 rounded-md bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
          {capacity.observacaoEmpresa}
        </p>
      )}

      <div className="mt-5">
        <h3 className="text-sm font-semibold">Regras importantes</h3>
        {rules.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {rules.map((rule) => (
              <li
                key={rule}
                className="flex items-start gap-2 rounded-md bg-red-50/80 px-3 py-2.5 text-sm text-red-950"
              >
                <CircleAlert
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-red-700"
                />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhuma regra adicional informada.
          </p>
        )}
      </div>
    </section>
  );
}
