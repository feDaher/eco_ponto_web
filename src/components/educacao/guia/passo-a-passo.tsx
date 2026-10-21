import {
  Archive,
  CircleCheck,
  Clock,
  MapPinned,
  Search,
  ShieldCheck,
  ThermometerSun,
  TriangleAlert,
  Wrench,
} from 'lucide-react';

import { cn } from '@/utils/utils';
import type { RecyclingStep, StepBadgeVariant } from '@/utils/tipos-guia';

const stepIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  Wrench,
  Archive,
  MapPinned,
};

const badgeIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  TriangleAlert,
  CircleCheck,
  ThermometerSun,
  Clock,
};

const badgeClasses: Record<StepBadgeVariant, string> = {
  danger: 'bg-[#F7FAFF] text-[#BA1A1A]',
  success: 'bg-[#E9F7EF] text-[#4D6B5B]',
  neutral: 'bg-[#F7FAFF] text-[#414943]',
  forest: 'bg-[#E3F9EB] text-[#205036]',
  info: 'bg-[#E6EEFF] text-[#414943]',
};

type StepByStepProps = {
  steps: RecyclingStep[];
};

export function StepByStep({ steps }: StepByStepProps) {
  return (
    <section className="mt-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4D6B5B]">
            PROTOCOLO TÉCNICO RECOMENDADO
          </p>
          <h2 className="mt-2 text-2xl font-bold lg:text-3xl">
            Passo a Passo de Preparação Segura
          </h2>
          <p className="mt-2 max-w-3xl text-base text-[#414943]">
            Evite riscos térmicos e vazamentos químicos antes de sair de casa
            até a urna coletora.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#E6EEFF] px-4 py-1.5 text-sm font-medium text-[#414943]">
          <ShieldCheck className="size-3.5 text-[#36654A]" />
          Norma NBR 10004 – Resíduos Classe I
        </span>
      </div>

      <div className="mt-7 grid grid-cols-1 items-start gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => {
          const Icon = stepIcons[step.icone];
          const BadgeIcon = badgeIcons[step.badge.icone];
          const isLast = step.numero === steps.length;

          return (
            <div
              key={step.numero}
              className="flex flex-col rounded-2xl bg-card p-7 shadow-[0_4px_16px_rgb(0_0_0/0.04)]"
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'flex size-10 items-center justify-center rounded-lg text-lg font-bold',
                    isLast
                      ? 'bg-[#36654A] text-white'
                      : 'bg-[#C9EAD6] text-[#4D6B5B]'
                  )}
                >
                  {step.numero}
                </span>
                {Icon && (
                  <Icon
                    className={cn(
                      'size-6',
                      isLast ? 'text-[#36654A]' : 'text-[#4D6B5B]'
                    )}
                  />
                )}
              </div>

              <h3 className="mt-4 text-xl font-semibold">{step.titulo}</h3>
              <p className="mt-2 text-sm text-[#414943]">{step.descricao}</p>

              <div
                className={cn(
                  'mt-5 inline-flex w-full items-center gap-2 rounded-md px-3 py-3 text-[13px] font-medium leading-4',
                  badgeClasses[step.badge.variante]
                )}
              >
                {BadgeIcon && <BadgeIcon className="size-4 shrink-0" />}
                {step.badge.texto}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
