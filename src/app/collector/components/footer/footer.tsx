import Image from "next/image";
import { ShieldCheck, FileText, HelpCircle, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-8 pt-4 border-t border-slate-200/80 text-slate-500 text-xs">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Image
              src="/icons/recycle-ecoponto-icon-green.png"
              alt="EcoPonto Logo"
              width={16}
              height={16}
              className="w-4 h-4 object-contain"
            />
            <span>EcoPonto Dashboard</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1 text-[11px] text-[#36654a] font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Sistema Homologado PNRS</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-medium">
          <a
            href="#"
            className="flex items-center gap-1 hover:text-emerald-700 transition"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Manual do Operador</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-1 hover:text-emerald-700 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Suporte Técnico</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-1 hover:text-emerald-700 transition text-slate-600"
          >
            <span>Portal da Prefeitura</span>
            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
          </a>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <span>v2.4.0 (Build #8821)</span>
          <span>•</span>
          <span>© 2026 EcoPonto Brasil</span>
        </div>

      </div>
    </footer>
  );
}