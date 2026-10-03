import { Badge } from '@/components/ui/badge';

import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

import type { CollectionPoint } from '@/utils/tipos';

import {
  calculateDaysSince,
  formatDate,
  needsVerification,
} from '@/utils/utils-ponto';

interface PointStatusProps {
  status: CollectionPoint['status'];
}
// componente que exibe o status de verificação do ponto de coleta
export function PointStatus({ status }: PointStatusProps) {
  const daysSinceUpdate = calculateDaysSince(status.ultimaAtualizacao);
  const isReviewNeeded = needsVerification(status.ultimaAtualizacao);
  const isAwaitingVerification = !status.verificado;
  const needsAttention = isReviewNeeded || isAwaitingVerification;

  return (
    <section
      className={`rounded-lg border p-4 ${needsAttention ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}
      aria-label="Status de verificação do ponto"
    >
      <div className="flex items-start gap-3">
        <div
          className={`rounded-full p-2 ${needsAttention ? 'bg-amber-100' : 'bg-emerald-100'}`}
        >
          {needsAttention ? (
            <AlertTriangle
              aria-hidden="true"
              className="h-5 w-5 text-amber-800"
            />
          ) : (
            <ShieldCheck
              aria-hidden="true"
              className="h-5 w-5 text-emerald-700"
            />
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className={`font-semibold ${needsAttention ? 'text-amber-950' : 'text-emerald-950'}`}
            >
              {status.verificado
                ? 'Informações verificadas oficialmente'
                : 'Verificação pendente'}
            </h2>

            {status.monitorado && <Badge variant="secondary">Monitorado</Badge>}
          </div>

          <p
            className={`mt-1 text-sm ${needsAttention ? 'text-amber-900' : 'text-emerald-800'}`}
          >
            {status.verificado ? (
              <>
                <CheckCircle2
                  aria-hidden="true"
                  className="mr-1 inline h-4 w-4"
                />
                Última verificação: {formatDate(status.ultimaVerificacao)}.
              </>
            ) : (
              'Este ponto ainda aguarda verificação oficial.'
            )}
          </p>

          <p
            className={`mt-1 text-xs ${needsAttention ? 'text-amber-800' : 'text-emerald-700'}`}
          >
            Atualizado em {formatDate(status.ultimaAtualizacao)}
            {daysSinceUpdate !== null &&
              ` · há ${daysSinceUpdate} ${daysSinceUpdate === 1 ? 'dia' : 'dias'}`}
          </p>

          {isReviewNeeded && (
            <p className="mt-2 text-sm font-medium text-amber-900">
              {daysSinceUpdate === null
                ? 'A data da última atualização precisa ser informada.'
                : `Este ponto está sem atualização há ${daysSinceUpdate} dias e precisa ser revisado.`}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
