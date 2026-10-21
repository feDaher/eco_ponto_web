import { Building2, Bell, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function TopHeader() {
  return (
    <header className="fixed left-64 right-0 top-0 z-40 bg-white border-b border-gray-100 px-10 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-100 shadow-sm">
            <Building2 size={17} className="text-green-700" />

            <span className="text-sm font-medium text-gray-800">
              Polo Regional Manhuaçu - MG
            </span>

            <ChevronDown size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600">
            <Bell size={19} />

            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-600"></span>
          </button>

          <div className="h-8 w-px bg-gray-200"></div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">
                Gestão Municipal
              </p>

              <p className="text-xs text-gray-500">Admin Geral - Manhuaçu</p>
            </div>

            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-800">
              <Image
                src="/icons/user.svg"
                alt="User EcoPonto"
                width={15}
                height={15}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
