import {
  LayoutDashboard,
  Trash2,
  Clock,
  MessageSquare,
  BarChart3,
  UserCog,
} from 'lucide-react';
import Image from 'next/image';

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-72 border-r border-gray-100 bg-white">
      <div className="p-6 flex items-center gap-3">
        <Image
          src="/icons/logo.svg"
          alt="Logo EcoPonto"
          className="mt-2"
          width={35}
          height={35}
        />

        <div>
          <h1 className="text-xl font-semibold text-green-700">EcoPonto</h1>
          <p className="text-xs text-gray-500">GESTÃO PÚBLICA</p>
        </div>
      </div>

      <div className="px-8 mb-4">
        <p className="text-xs font-medium text-gray-500">
          PAINEL INSTITUCIONAL
        </p>
      </div>

      <nav className="px-2 space-y-1">
        <button className="w-full flex items-center gap-3 px-5 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100">
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </button>

        <button className="w-full flex items-center gap-3 px-5 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100">
          <Trash2 size={19} />
          <span>Pontos de Coleta</span>
        </button>

        <button className="ml-2 flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#36654A] text-white min-w-[250px] w-fit">
          <Clock size={19} />
          <span>Categorias e Horários</span>
        </button>

        <button className="w-full flex items-center gap-3 px-5 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100">
          <MessageSquare size={19} />
          <span>Moderação de Avaliações</span>
        </button>

        <button className="w-full flex items-center gap-3 px-5 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100">
          <BarChart3 size={19} />
          <span>Relatórios e Exportação</span>
        </button>

        <button className="w-full flex items-center gap-3 px-5 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100">
          <UserCog size={19} />
          <span>Gestão de Usuários</span>
        </button>
      </nav>
    </aside>
  );
}
