import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import {
  OUTDATED_AFTER_DAYS,
  daysSince,
  formatDate,
  isOutdated,
  pluralize,
} from '@/lib/points';
import { cn } from '@/lib/utils';
import type { PointVerification } from '@/types/api';

const TONES = {
  ok: {
    icon: ShieldCheck,
    box: 'border-brand-light bg-brand-light/30',
    badge: 'bg-brand-light text-brand',
    title: 'text-brand-dark',
    text: 'text-brand-muted',
  },
  warning: {
    icon: AlertTriangle,
    box: 'border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40',
    badge:
      'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200',
    title: 'text-amber-950 dark:text-amber-100',
    text: 'text-amber-900 dark:text-amber-200',
  },
};

type VerificationNoticeProps = {
  verification: PointVerification;
};

export function VerificationNotice({ verification }: VerificationNoticeProps) {
  const days = daysSince(verification.updatedAt);
  const outdated = isOutdated(verification.updatedAt);
  const tone = TONES[outdated || !verification.verified ? 'warning' : 'ok'];
  const Icon = tone.icon;

  return (
    <section
      aria-labelledby="verification-heading"
      className={cn('rounded-3xl border p-4 sm:p-5', tone.box)}
    >
      <div className="flex items-start gap-3">
        <span className={cn('rounded-full p-2', tone.badge)}>
          <Icon aria-hidden="true" className="size-5" />
        </span>

        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="verification-heading"
              className={cn('font-semibold', tone.title)}
            >
              {verification.verified
                ? 'Informações verificadas oficialmente'
                : 'Verificação pendente'}
            </h2>
            {verification.monitored && (
              <Badge variant="secondary">Monitorado</Badge>
            )}
          </div>

          <p className={cn('text-sm', tone.text)}>
            {verification.verified && verification.lastVerifiedAt ? (
              <>
                <CheckCircle2
                  aria-hidden="true"
                  className="mr-1 inline size-4"
                />
                Última verificação em {formatDate(verification.lastVerifiedAt)}.
              </>
            ) : (
              'Este ponto ainda aguarda verificação oficial.'
            )}
          </p>

          <p className={cn('text-xs', tone.text)}>
            Atualizado em {formatDate(verification.updatedAt)}
            {days !== null && ` · há ${pluralize(days, 'dia', 'dias')}`}
          </p>

          {outdated && (
            <p className="pt-1 text-sm font-medium text-amber-900 dark:text-amber-200">
              {days === null
                ? 'A data da última atualização não foi informada.'
                : `Estas informações estão há mais de ${OUTDATED_AFTER_DAYS} dias sem atualização e podem estar desatualizadas. Confirme com o responsável antes de ir ao local.`}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
