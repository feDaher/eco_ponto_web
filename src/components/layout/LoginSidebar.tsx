import Image from 'next/image';

export function LoginSidebar() {
  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #416851 0%, #528265 50%, #2C4737 100%)',
      }}
      className="hidden md:flex flex-1 flex-col justify-between p-12 text-white lg:p-16 xl:p-20"
    >
      <div className="flex items-center justify-between text-xs font-medium opacity-90">
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Gestão Inteligente de Resíduos
        </span>
        <span>Plataforma B2B & Cidadão</span>
      </div>

      <div className="my-auto max-w-lg space-y-6">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
          Transformando descartes em impacto sustentável.
        </h2>
        <p className="text-sm leading-relaxed text-emerald-100/80">
          Acompanhe em tempo real pontos de coleta, certifique descarte de
          eletrônicos e materiais recicláveis, e faça parte do ecossistema
          sustentável mais eficiente do Brasil.
        </p>

        <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <div>
            <p className="text-3xl font-bold tracking-tight text-white">
              +14.200t
            </p>
            <p className="mt-1 text-xs text-emerald-100/70">
              Resíduos reciclados rastreados
            </p>
          </div>
          <div className="border-l border-white/10 pl-4">
            <p className="text-3xl font-bold tracking-tight text-white">
              99.8%
            </p>
            <p className="mt-1 text-xs text-emerald-100/70">
              Conformidade e destinação correta
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-6 text-xs text-emerald-100/60">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <Image
              src="/icons/ecoponto-logo-icon-white.png"
              alt="EcoPonto"
              width={16}
              height={16}
              className="h-auto w-auto"
            />
          </div>
          <div>
            <p className="font-semibold text-white">EcoPonto Enterprise</p>
            <p className="text-[10px]">
              Soluções verdes para cidades sustentáveis
            </p>
          </div>
        </div>
        <p>© 2025 EcoPonto</p>
      </div>
    </div>
  );
}
