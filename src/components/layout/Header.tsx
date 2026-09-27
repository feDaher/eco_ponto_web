'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname(); // Pega a rota atual (ex: "/" ou "/map")

  return (
    <header className="border-b-2 border-white bg-[#F8F9FF]">
      {' '}
      {/*Criação e definição das cores do header */}
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {' '}
          {/*Bloco 1: Aqui fica a imagem e o nome do EcoPonto */}
          <Image
            src="/icons/logoo.png"
            alt="EcoPonto"
            width={28}
            height={25}
            className="h-auto w-8"
          />
          <span className="font-bold text-[#36654A] text-lg">EcoPonto</span>
        </div>

        <nav className="flex items-center gap-6">
          {' '}
          {/*Bloco 3: O centro do header, todos os links principais relacionados as abas do site */}
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === '/'
                ? 'rounded-full bg-[#C9EAD6] px-4 py-1.5 text-green-800'
                : 'text-gray-600 hover:text-green-800'
            }`}
          >
            Início
          </Link>
          <Link
            href="/map"
            className={`text-sm font-medium transition-colors ${
              pathname === '/map'
                ? 'rounded-full bg-[#C9EAD6] px-4 py-1.5 text-green-800'
                : 'text-gray-600 hover:text-green-800'
            }`}
          >
            Locais de Coleta
          </Link>
          <Link
            href="/education"
            className={`text-sm font-medium transition-colors ${
              pathname === '/education'
                ? 'rounded-full bg-[#C9EAD6] px-4 py-1.5 text-green-800'
                : 'text-gray-600 hover:text-green-800'
            }`}
          >
            Aprender & Dicas
          </Link>
          <Link
            href="/historico"
            className={`text-sm font-medium transition-colors ${
              pathname === '/historico'
                ? 'rounded-full bg-[#C9EAD6] px-4 py-1.5 text-green-800'
                : 'text-gray-600 hover:text-green-800'
            }`}
          >
            Histórico
          </Link>
          <Link
            href="/minha-conta"
            className={`text-sm font-medium transition-colors ${
              pathname === '/minha-conta'
                ? 'rounded-full bg-[#C9EAD6] px-4 py-1.5 text-green-800'
                : 'text-gray-600 hover:text-green-800'
            }`}
          >
            Minha Conta
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {' '}
          {/*Bloco 3: Aqui estão os links para a área de login e cadastro, com suas respectivas aparências. */}
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-green-800 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-full bg-[#36654A] px-5 py-2 text-sm font-medium text-white hover:bg-[#234734] transition-colors"
          >
            Cadastrar-se
          </Link>
        </div>
      </div>
    </header>
  );
}
