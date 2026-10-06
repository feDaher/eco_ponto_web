import React from 'react';
import Image from 'next/image';
import { UserPlus, MapPin, UserCheck } from 'lucide-react';

export const CtaSection = ({ loggedIn = false }: { loggedIn?: boolean }) => {
  return (
    <section className="w-full bg-white py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Card verde */}
        <div className="relative bg-[#36654A] rounded-3xl p-8 sm:p-12 lg:p-16 text-white overflow-hidden shadow-xl border border-emerald-950 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bolas de efeito difuso */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -left-20 h-46 w-46 z-10 rounded-full bg-[#C9EAD6] blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-20 h-46 w-86 z-10 rounded-full bg-[#C9EAD6] blur-[140px]"
          />

          <div className="relative z-20 max-w-3xl space-y-6">
            {/* A tag em cima */}
            <div className="inline-flex items-center z-20 gap-2 px-3 py-1 text-white text-xs font-semibold">
              <Image
                src="/icons/ecoponto-logo-icon-white.png"
                alt="EcoPonto"
                width={28}
                height={25}
                className="h-auto w-8"
              />
              <span>EcoPonto</span>
            </div>

            {/* Título Principal */}
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-white leading-tight">
              {loggedIn
                ? 'Que bom ter você de volta! Pronto para reciclar hoje?'
                : 'Pronto para fazer a diferença pelo meio ambiente?'}
            </h2>

            {/* Descrição */}
            <p className="text-sm sm:text-base text-[#F6FFF5] leading-relaxed max-w-2xl">
              {loggedIn
                ? 'Encontre os pontos de coleta mais próximos de você, registre seu descarte e acompanhe o seu impacto ecológico.'
                : 'Junte-se a centenas de moradores de Manhuaçu. Cadastre-se gratuitamente, registre suas entregas e transforme lixo eletrônico em preservação real.'}
            </p>
          </div>

          {/* Botões */}
          <div className="relative z-20 flex flex-col sm:flex-row z-20 items-stretch sm:items-center gap-4 pt-4">
            {loggedIn ? (
              /* Usuário logado */
              <>
                <a
                  href="/panel"
                  className="relative z-20 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#4F7F62] hover:bg-emerald-800 text-emerald-100 font-semibold text-sm transition-colors border border-[#4F7F62]"
                >
                  <UserCheck className="w-4 h-4 text-emerald-100" />
                  <span>Meu Painel</span>
                </a>

                <a
                  href="#map"
                  className="relative z-20 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#36654A] font-bold text-sm hover:bg-emerald-50 transition-colors shadow-md"
                >
                  <MapPin className="w-4 h-4 text-[#36654A]" />
                  <span>Buscar Pontos Agora</span>
                </a>
              </>
            ) : (
              /* Usuário não logado */
              <>
                <a
                  href="/sign"
                  className="relative z-20 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#4F7F62] hover:bg-emerald-800 text-emerald-100 font-semibold text-sm transition-colors border border-[#4F7F62]"
                >
                  <UserPlus className="w-4 h-4 text-emerald-100" />
                  <span>Criar Conta Gratuita</span>
                </a>

                <a
                  href="#map"
                  className="relative z-20 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#36654A] font-bold text-sm hover:bg-emerald-50 transition-colors shadow-md"
                >
                  <MapPin className="w-4 h-4 text-[#36654A]" />
                  <span>Buscar Pontos Agora</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
