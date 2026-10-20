import { Check, Clock, Monitor, Package, Plus, Plug, Scale, Smartphone, Tv, User } from "lucide-react";

export default function RecordReceipt() {
  return (
    <div className="space-y-5">
      <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-[#1b5e3f] p-1.5 text-white">
              <Plus className="h-4 w-4" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Registrar Recebimento de Resíduo
            </h3>
          </div>
          <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-[#638773]">
            Terminal Operador #02
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <label className="font-semibold text-slate-600">
              Munícipe ou Empresa Doadora
            </label>
            <span className="text-[11px] text-[#638773]">
              Identificação opcional para pessoa física
            </span>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-[#638773]" />
              <input
                type="text"
                placeholder="Nome do cidadão, CPF ou Razão Social..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-3 text-xs text-slate-700 placeholder:text-slate-400 transition focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <button className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200">
              <User className="h-3.5 w-3.5" /> Munícipe Avulso
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Categoria Aceita pelo Ponto
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center gap-2.5 rounded-xl border-2 border-[#1b5e3f] bg-[#4f7f62] p-2.5 text-left">
              <Monitor className="h-4 w-4 text-white" />
              <span className="text-xs font-bold text-white">
                Informática &amp; Placas-Mãe
              </span>
            </button>
            <button className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/30 p-2.5 text-left text-slate-600 hover:border-slate-400 transition">
              <Smartphone className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold">Smartphones &amp; Cabos</span>
            </button>
            <button className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/30 p-2.5 text-left text-slate-600 hover:border-slate-400 transition">
              <Tv className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold">Monitores e Displays</span>
            </button>
            <button className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/30 p-2.5 text-left text-slate-600 hover:border-slate-400 transition">
              <Plug className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold">Pequenos Eletros</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">
              Peso Aferido / Estimado (kg)
            </label>
            <div className="relative">
              <Scale className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: 8.5"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-10 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-[11px] font-bold text-slate-400">
                KG
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">
              Quantidade de Itens / Caixas
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="number"
                defaultValue={1}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-10 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-[11px] font-bold text-slate-400">
                UN
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Destinação Inicial
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-emerald-300/80 bg-[#c9ead6] p-2.5">
              <input
                type="radio"
                name="destinacao"
                defaultChecked
                className="mt-0.5 text-emerald-700 focus:ring-emerald-600"
              />
              <div>
                <div className="text-xs font-bold text-emerald-950">
                  Para Descaracterização
                </div>
                <div className="mt-0.5 text-[10px] leading-tight text-emerald-800">
                  Sucata eletrônica para moagem e refino.
                </div>
              </div>
            </label>
            <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-2.5">
              <input
                type="radio"
                name="destinacao"
                className="mt-0.5 text-emerald-700"
              />
              <div>
                <div className="text-xs font-bold text-slate-700">
                  Reutilização / Peças
                </div>
                <div className="mt-0.5 text-[10px] leading-tight text-slate-500">
                  Equipamento íntegro para recondicionamento social.
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-1">
          <button className="flex items-center justify-center gap-2 rounded-xl bg-[#2d6a4f] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#1b5e3f]">
            <Check className="h-4 w-4" /> Confirmar Entrada
          </button>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Clock className="h-4 w-4 text-slate-400" />
            Últimos Recebimentos de Hoje
          </h3>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
            Hoje: 60.7 kg
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/70 p-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-400">
                14:15
              </span>
              <div>
                <div className="font-bold text-slate-800">
                  João M. Silva{" "}
                  <span className="font-normal text-slate-500">(Munícipe)</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  2 Laptops e carregadores periféricos
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="font-extrabold text-slate-800">12,5 kg</div>
                <div className="text-[10px] text-slate-400">#REC-8821</div>
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Triado
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/70 p-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-400">
                11:30
              </span>
              <div>
                <div className="font-bold text-slate-800">
                  Alfa Contabilidade Ltda.{" "}
                  <span className="font-normal text-slate-500">
                    (PJ / Gerador)
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Gabinetes desktop, placas e cabos estruturados
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="font-extrabold text-slate-800">45,0 kg</div>
                <div className="text-[10px] text-slate-400">
                  #MTR-2026-0914
                </div>
              </div>
              <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                Aguardando Destinador
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/70 p-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-400">
                09:45
              </span>
              <div>
                <div className="font-bold text-slate-800">
                  Maria Oliveira{" "}
                  <span className="font-normal text-slate-500">(Munícipe)</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Aparelhos celulares antigos e baterias alcalinas comuns
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="font-extrabold text-slate-800">3,2 kg</div>
                <div className="text-[10px] text-slate-400">#REC-8819</div>
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                Triado
              </span>
            </div>
          </div>
        </div>

        <div className="pt-1 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 transition hover:text-emerald-700"
          >
            Ver todo o histórico operacional e relatórios
          </a>
        </div>
      </div>
    </div>
  );
}