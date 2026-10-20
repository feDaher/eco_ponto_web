import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar() {
  return (
    <div className="flex flex-col justify-between h-full bg-[#eff4ff]">
      <div>
        <div className="p-5 border-b border-slate-200/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl text-white flex items-center justify-center shrink-0">
            <Image 
              src="/icons/recycle-ecoponto-icon-green.png" 
              alt="Ícone do EcoPonto" 
              width={28} 
              height={28} 
             className="w-[28px] h-[28px] shrink-0 object-contain"
            />
          </div>
          <div>
            <h1 className="font-manrope font-semibold text-[#4b755e] text-base leading-tight">
              EcoPonto
            </h1>
            <p className="text-[10px] text-slate-500 font-bold font-manrope tracking-wider uppercase">
              Parceiro Coletor
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200/70 m-3 rounded-2xl space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#4b755e]">
            <span className="w-2 h-2 rounded-full bg-[#36654a] animate-pulse" />
            Aberto e Recebendo
          </div>
          <div className="text-xs font-semibold text-slate-600 leading-snug">
            Coop. Manhuaçu Recicla
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            CNPJ: 14.821.902/0001-34
          </div>
        </div>

        <nav className="px-3 space-y-1 mt-2">
          <Link 
            href="#" 
            className="flex items-center gap-3 px-3.5 py-2.5 bg-[#4f7f62] text-white font-semibold rounded-xl text-xs shadow-sm shadow-emerald-900/10 transition"
          >
            <Image 
              src="/icons/my-point-collector.png" 
              alt="Meu Ponto de Coleta" 
              width={15} 
              height={15} 
              className="w-[15px] h-[15px] shrink-0 object-contain"  
            />
            Meu Ponto de Coleta
          </Link>
          
          <Link 
            href="#" 
            className="flex items-center gap-3 px-3.5 py-2.5 text-slate-600 hover:bg-white font-medium rounded-xl text-xs transition"
          >
            <Image 
              src="/icons/record-receipt.png" 
              alt="Registrar Recebimento" 
              width={15} 
              height={15} 
              className="w-[15px] h-[15px] shrink-0 object-contain"
            />
            Registrar Recebimento
          </Link>

          <Link 
            href="#" 
            className="flex items-center gap-3 px-3.5 py-2.5 text-slate-600 hover:bg-white font-medium rounded-xl text-xs transition"
          >
            <Image 
              src="/icons/materials.png" 
              alt="Materiais e Capacidade" 
              width={15} 
              height={15} 
              className="w-[15px] h-[15px] shrink-0 object-contain"
            />
            Materiais e Capacidade
          </Link>

          <Link 
            href="#" 
            className="flex items-center gap-3 px-3.5 py-2.5 text-slate-600 hover:bg-white font-medium rounded-xl text-xs transition"
          >
            <Image 
              src="/icons/opening-hours.png" 
              alt="Horários de Funcionamento" 
              width={15} 
              height={15} 
              className="w-[15px] h-[15px] shrink-0 object-contain"
            />
            Horários de Funcionamento
          </Link>
         
          <Link 
            href="#" 
            className="flex items-center gap-3 px-3.5 py-2.5 text-slate-600 hover:bg-white font-medium rounded-xl text-xs transition"
          >
            <Image 
              src="/icons/history.png" 
              alt="Histórico e MTRs" 
              width={15} 
              height={15} 
              className="w-[15px] h-[15px] shrink-0 object-contain"
            />
            Histórico e MTRs
          </Link>
         
          <Link 
            href="#" 
            className="flex items-center gap-3 px-3.5 py-2.5 text-slate-600 hover:bg-white font-medium rounded-xl text-xs transition"
          >
            <Image 
              src="/icons/settings.png" 
              alt="Configurações" 
              width={15} 
              height={15} 
              className="w-[15px] h-[15px] shrink-0 object-contain"
            />
            Configurações
          </Link>
        </nav>
      </div>

      <div className="p-4 text-[11px] text-slate-400 border-t border-slate-200/60">
        © 2026 EcoPonto Brasil
      </div>
    </div>
  );
}