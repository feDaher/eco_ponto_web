import {
  Recycle,
  ClipboardClock,
  TriangleAlert,
  Hourglass,
  Clock3,
} from 'lucide-react';

type MetricCardProps = {
  tipo: 1 | 2 | 3 | 4;
};

export default function MetricCard({ tipo }: MetricCardProps) {
  if (tipo === 1) {
    return (
      <div className="h-[170px] rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <p className="max-w-[180px] text-[15px] font-medium leading-tight tracking-wide text-gray-700">
            CATEGORIAS
            <br />
            HOMOLOGADAS
          </p>

          <div className="flex h-9 w-11 items-center justify-center rounded-full bg-green-100">
            <Recycle size={23} className="text-green-800" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-semibold text-gray-900">8</span>
          <span className="text-[16px] text-gray-700">classes ativas</span>
        </div>

        <div className="mt-3 flex w-fit items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-[14px] font-medium text-red-700">
          <TriangleAlert size={16} />3 desativadas
        </div>
      </div>
    );
  }

  if (tipo === 2) {
    return (
      <div className="h-[170px] rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <p className="max-w-[180px] text-[15px] font-medium leading-tight tracking-wide text-gray-700">
            HORÁRIOS
            <br />
            DESATUALIZADOS
          </p>

          <div className="flex h-9 w-11 items-center justify-center rounded-full bg-red-100">
            <ClipboardClock size={23} className="text-red-700" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-semibold text-red-700">4</span>
          <span className="text-md text-gray-700">postos urgentes</span>
        </div>

        <div className="mt-3 flex w-fit items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-[14px] font-medium text-red-700">
          <TriangleAlert size={16} />
          &gt;60 dias s/ confirmação
        </div>
      </div>
    );
  }

  if (tipo === 3) {
    return (
      <div className="h-[170px] rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <p className="max-w-[180px] text-[15px] font-medium leading-tight tracking-wide text-gray-700">
            CAPACIDADE MÉDIA
            <br />
            TRIADA
          </p>

          <div className="flex h-9 w-11 items-center justify-center rounded-full bg-blue-100">
            <Hourglass size={23} className="text-blue-700" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-semibold text-gray-900">14.5</span>
          <span className="text-md font-medium text-gray-700">t / mês</span>
        </div>

        <div className="mt-3 text-base font-medium text-green-800">
          ▲ +8.2%
          <span className="ml-1 font-normal text-gray-700">
            vs trimestre anterior
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[170px] rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="max-w-[180px] text-[15px] font-medium leading-tight tracking-wide text-gray-700">
          ACURÁCIA DE
          <br />
          HORÁRIOS
        </p>

        <div className="flex h-9 w-11 items-center justify-center rounded-full bg-green-100">
          <Clock3 size={23} className="text-green-800" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-semibold text-green-800">94.2%</span>

        <span className="text-[14px] text-gray-700">taxa auditada</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-gray-200">
          <div className="h-2 w-[94.2%] rounded-full bg-green-800"></div>
        </div>

        <div className="whitespace-nowrap text-[14px] font-medium text-green-800">
          Meta 95%
        </div>
      </div>
    </div>
  );
}
