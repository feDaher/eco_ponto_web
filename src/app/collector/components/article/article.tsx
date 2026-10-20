import Image from "next/image";
import { Info, TrendingUp } from 'lucide-react';

export default function Article() {
  return (
    <div className="space-y-4">
      <div className="bg-[#dee9fc] border border-indigo-100 rounded-2xl p-4 flex gap-3.5 items-start shadow-xs">
        <Image 
          src="/icons/article.png" 
          alt="Ícone de artigo" 
          width={40} 
          height={40} 
          style={{ width: 'auto', height: 'auto' }}
          className="object-contain shrink-0" 
        />
        
        <div className="flex-1 text-xs text-slate-600 leading-relaxed">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-800 text-sm leading-snug">
              Alterações Críticas em Análise
            </h3>
            <span className="text-[#36654a] text-[10px] font-semibold bg-slate-200/60 px-2 py-0.5 rounded">
              Em Análise pelo Fiscal (#SOL-9412)
            </span>
          </div>

          <p className="text-slate-600">
            Sua solicitação de inclusão da categoria{' '}
            <strong>"Baterias de Lítio e Veiculares"</strong> e ajuste de endereço
            complementar (Galpão B) foi enviada e está pendente de aprovação pela
            moderação municipal. Durante a avaliação, os dados públicos cadastrados permanecem
            ativos no mapa de coleta.
          </p>

          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              <strong>Normativa PNRS / SMA:</strong> Edições em dados críticos (Endereço, CNPJ e inclusão de Resíduos Perigosos Classe I) requerem validação técnica obrigatória.
            </span>
          </div>
        </div>

        <button className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition flex items-center gap-1.5 shrink-0 self-start">
          <Image 
            src="/icons/View-request-details.png" 
            alt="Ver detalhes" 
            width={15} 
            height={15} 
            className="w-[15px] h-[15px] shrink-0 object-contain" 
          />
          Ver Detalhes da Solicitação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-[#686e69] uppercase tracking-wider">
              TOTAL RECEBIDO (MÊS)
            </span>
            <div className="p-1.5 bg-blue-50 text-emerald-600 rounded-lg">
              <Image 
                src="/icons/scale.png" 
                alt="Ícone balança" 
                width={15} 
                height={15} 
                style={{ width: 'auto', height: 'auto' }}
                className="object-contain shrink-0"
              />
            </div>
          </div>

          <div className="mt-2">
            <div className="text-2xl font-extrabold text-slate-800 tracking-tight">
              1.420 <span className="text-base font-semibold text-[#686e69]">kg</span>
            </div>
            <div className="text-[11px] text-[#638773] font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +12% vs. mês anterior
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-[#638773] uppercase tracking-wide">
              CAPACIDADE CENTRAL
            </span>
            <div className="p-1.5 bg-[#c9ead6] text-emerald-600 rounded-lg">
              <Image 
                src="/icons/core-capacity.png" 
                alt="Ícone capacidade" 
                width={15} 
                height={15} 
                className="w-[15px] h-[15px] shrink-0 object-contain" 
              />
            </div>
          </div>

          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-800">72%</span>
              <span className="text-xs text-[#638773] font-medium">2.880 / 4.000 kg</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-[#2d6a4f] h-2 rounded-full"
                style={{ width: '72%' }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-[#638773] uppercase tracking-wide">
              STATUS NO MAPA
            </span>
            <div className="p-1.5 bg-[#c9ead6] text-emerald-600 rounded-lg">
              <Image 
                src="/icons/status-on-the-maps.png" 
                alt="Ícone status no mapa" 
                width={15} 
                height={15} 
                style={{ width: 'auto', height: 'auto' }}
                className="object-contain shrink-0" 
              />
            </div>
          </div>

          <div className="mt-2 space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Ativo & Verificado
            </span>
            <div className="text-[11px] text-[#638773]">
              Presença confirmada hoje às 08:30
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}