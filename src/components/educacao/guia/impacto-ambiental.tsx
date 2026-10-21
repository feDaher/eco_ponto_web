import Image from 'next/image';
import { Zap } from 'lucide-react';

import type { EnvironmentalImpact } from '@/utils/tipos-guia';

type EnvironmentalImpactProps = {
  impact: EnvironmentalImpact;
};

export function EnvironmentalImpact({ impact }: EnvironmentalImpactProps) {
  return (
    <section className="relative mt-12 overflow-hidden rounded-3xl bg-[#36654A] p-8 text-white lg:p-12">
      <div className="pointer-events-none absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_27rem]">
        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-[#C9EAD6]">
            <Zap className="size-4 text-[#C9EAD6]" />
            {impact.pillTopo}
          </span>

          <h2 className="mt-6 text-3xl font-bold leading-tight text-white lg:text-4xl">
            {impact.titulo}
          </h2>

          <p className="mt-6 max-w-[55ch] text-base leading-relaxed text-white/90 lg:text-lg">
            {impact.descricao}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {impact.estatisticas.map((stat, index) => (
              <div key={index} className="rounded-2xl bg-white/10 p-6">
                <p className="text-4xl font-bold text-[#C9EAD6]">
                  {stat.valor}
                </p>
                <p className="mt-2 text-sm leading-snug text-white">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col items-center self-center rounded-2xl bg-white/10 p-8 text-center">
          <Image
            src="/icons/ecoponto-logo-full-white.png"
            alt="EcoPonto"
            width={140}
            height={154}
            className="mx-auto h-24 w-auto"
          />

          <h3 className="mt-4 text-lg font-bold text-white">
            {impact.painelLogistica.titulo}
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-white/90">
            {impact.painelLogistica.descricao}
          </p>
        </aside>
      </div>
    </section>
  );
}
