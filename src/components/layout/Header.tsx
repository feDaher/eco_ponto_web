import Image from 'next/image';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Header() {
  return (
    <header className="border-b-2 border-white bg-[#6B9080]">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white cursor-pointer hover:bg-white/10"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex h-11 w-11 items-center justify-center rounded-full">
            <Image
              src="/icons/ecoponto-logo-icon-white.png"
              alt="EcoPonto"
              width={28}
              height={29}
              className="h-auto w-8"
            />
          </div>

          <span className="text-lg font-bold text-white">EcoPonto</span>
        </div>

        <div className="hidden text-right text-white sm:block">
          <p className="font-bold">Olá, Visitante 👋</p>
          <p className="text-sm text-white/90">
            Crie uma conta e comece a fazer a diferença no meio ambiente
          </p>
        </div>
      </div>
    </header>
  );
}
