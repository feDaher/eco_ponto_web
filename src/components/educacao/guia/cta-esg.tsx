import { Compass, Leaf, UserPlus } from 'lucide-react';

import type { EsgCta } from '@/utils/tipos-guia';

type EsgCtaProps = {
  cta: EsgCta;
};

export function EsgCta({ cta }: EsgCtaProps) {
  return (
    <section className="mt-12">
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-15">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#D9E3F6_0%,#EFF4FF_50%,#C9EAD6_100%)]" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          <div className="flex items-start gap-6">
            <span className="flex size-[78px] shrink-0 items-center justify-center rounded-2xl bg-[#36654A] text-white">
              <Leaf className="size-8" />
            </span>

            <div className="max-w-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#4D6B5B]">
                {cta.overline}
              </p>
              <h2 className="mt-2 text-2xl font-bold leading-[1.4] text-[#121C2A] lg:text-3xl">
                {cta.titulo}
              </h2>
              <p className="mt-4 text-base leading-[28px] text-[#414943]">
                {cta.descricao}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href={cta.botaoPrincipal.href}
              className="inline-flex items-center justify-center gap-4 rounded-full bg-[#36654A] px-7 py-4 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#4D6B5B]"
            >
              <UserPlus className="size-4" />
              {cta.botaoPrincipal.texto}
            </a>
            <a
              href={cta.botaoSecundario.href}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-base font-medium text-[#121C2A] transition-colors hover:bg-[#C9EAD6]"
            >
              <Compass className="size-5 text-[#36654A]" />
              {cta.botaoSecundario.texto}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
