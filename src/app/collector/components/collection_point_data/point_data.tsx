import { MapPin, Building2, Edit3, RefreshCw, ShieldCheck, CircleCheck } from 'lucide-react';

export default function PointData() {
  return (
    <div className="space-y-5">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            Dados do Ponto
          </h3>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
            Homologado
          </span>
        </div>

        <div className="text-xs space-y-2.5">
          <div className="flex items-start gap-2 text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-800">Galpão Central Manhuaçu</div>
              <div>Av. Tancredo Neves, 1200 - Bairro Coqueiro</div>
              <div>Manhuaçu - MG • CEP 36900-000</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold text-[11px] rounded-lg transition text-center">
              Exige Aprovação Prévia
            </button>
            <button className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold text-[11px] rounded-lg transition flex items-center gap-1">
              Editar Endereço <Edit3 className="w-3 h-3 shrink-0" />
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">Horários de Operação</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 shrink-0" /> Sincronia Imediata
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-slate-50/60 rounded-xl">
              <div>
                <div className="font-bold text-slate-800">Segunda a Sexta</div>
                <div className="text-[11px] text-slate-500">08:00 às 17:30</div>
              </div>
              <div className="w-8 h-4 bg-emerald-600 rounded-full relative cursor-pointer p-0.5">
                <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5" />
              </div>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50/60 rounded-xl">
              <div>
                <div className="font-bold text-slate-800">Sábado</div>
                <div className="text-[11px] text-slate-500">08:00 às 12:00</div>
              </div>
              <div className="w-8 h-4 bg-emerald-600 rounded-full relative cursor-pointer p-0.5">
                <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5" />
              </div>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50/60 rounded-xl opacity-60">
              <div>
                <div className="font-bold text-slate-800">Domingo</div>
                <div className="text-[11px] text-slate-500">Fechado</div>
              </div>
              <div className="w-8 h-4 bg-slate-300 rounded-full relative cursor-pointer p-0.5">
                <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5" />
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-tight">
            Alterações de horário são publicadas no app do cidadão instantaneamente.
          </p>

          <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition">
            Salvar Novos Horários
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Cabeçalho do Card */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
            Categorias no Ponto
          </h3>
          <span className="text-[11px] font-bold text-slate-500">4 Ativas</span>
        </div>

        <div className="space-y-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            AUTORIZADAS NO MAPA:
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full text-xs font-semibold flex items-center gap-1">
              <CircleCheck className="w-3 h-3 text-emerald-600"/> TI e Computadores
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full text-xs font-semibold flex items-center gap-1">
              <CircleCheck className="w-3 h-3 text-emerald-600"/> Cabos e Fontes
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full text-xs font-semibold flex items-center gap-1">
              <CircleCheck className="w-3 h-3 text-emerald-600"/> Smartphones & Tablets
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-full text-xs font-semibold flex items-center gap-1">
              <CircleCheck className="w-3 h-3 text-emerald-600"/> Pequenos Eletros
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              EM TRAMITAÇÃO TÉCNICA:
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Baterias & Células de Lítio</span>
                <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                  Fase 2 de 3
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Aguardando vistoria técnica do Corpo de Bombeiros e laudo com responsabilidade técnica (ART).
              </p>
            </div>
          </div>

          <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1">
            + Solicitar Nova Categoria
          </button>
        </div>
      </div>
    </div>
  );
}