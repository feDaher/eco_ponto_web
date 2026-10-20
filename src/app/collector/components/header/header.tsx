import Image from "next/image";
import { Bell, User } from 'lucide-react';
export default function Header() {
  return (
       
        <div>
             {/*HEADER SUPERIOR*/}
        <header className="bg-white  px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 ">
          <div className="flex items-center gap-3">
            <div className="p-2 ">
              <Image src="/icons/recycle-ecoponto-icon-green.png" alt="Recycling icon" width={28}  height={28}  className="object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-slate-800 text-base leading-tight">
                  Cooperativa Manhuaçu Recicla
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] bg-[#c9ead6] text-emerald-800 font-bold rounded-full border border-emerald-200/50">
                  CNPJ Homologado
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Unidade Central Operacional • MG
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#c9ead6] text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-[#36654a]" />
              Aberto e Recebendo
            </div>
            <button type="button"className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-[#1b5e3f] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-xs">
              <User className="w-4 h-4" />
            </div>
          </div>
        </header>
    </div>
  );
}