import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

export function AuthSidebar() {
  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #416851 0%, #528265 50%, #2C4737 100%)',
      }}
      className="hidden md:flex flex-1 flex-col justify-between p-12 text-white lg:p-16 xl:p-20"
    >
      {/* Topo do Painel */}
      <div>
        <div className="flex items-center gap-2">
          <Image
            src="/icons/ecoponto-logo-icon-white.png"
            alt="EcoPonto"
            width={28}
            height={25}
            className="h-auto w-auto"
          />
        </div>

        <div className="mt-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-emerald-100 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Comunidade de Guardiões Digitais
          </span>
        </div>
      </div>

      {/* Conteúdo Central */}
      <div className="my-auto max-w-lg space-y-6">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
          Transforme descarte eletrónico em impacto verde real.
        </h1>
        <p className="text-sm leading-relaxed text-emerald-100/80">
          Junte-se a mais de 45.000 pessoas e empresas que descartam
          componentes, cabos e dispositivos com segurança, ganhando ecopontos e
          protegendo nosso planeta.
        </p>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-8 pt-4">
          <div>
            <p className="text-3xl font-extrabold tracking-tight text-white">
              1.200t+
            </p>
            <p className="mt-1 text-xs text-emerald-100/70">
              Lixo eletrónico reciclado
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold tracking-tight text-[#34d399]">
              100%
            </p>
            <p className="mt-1 text-xs text-emerald-100/70">
              Rastreabilidade circular
            </p>
          </div>
        </div>
      </div>

      {/* Card do Rodapé */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">
              Descarte Certificado ISO 14001
            </p>
            <p className="text-[11px] text-emerald-100/70">
              Destinação legal e emissão de laudo ecológico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
