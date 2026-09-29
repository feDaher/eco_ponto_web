'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-white bg-[#F8F9FF]">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6">
        {/* Bloco 1: Logo + Nome */}
        <div className="flex items-center gap-2">
          <Image
            src="/icons/logoo.png"
            alt="EcoPonto"
            width={28}
            height={25}
            className="h-auto w-7 md:w-8"
          />
          <span className="font-bold text-[#36654A] text-base md:text-lg">
            EcoPonto
          </span>
        </div>

        {/* Bloco 2: Links de navegação centrais (Visível apenas em desktop grande: lg) */}
        <nav className="hidden lg:flex items-center gap-6">
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

        {/* Bloco 3: Botões de login e cadastro (Aparecem apenas em ecrãs grandes: lg) */}
        <div className="hidden lg:flex items-center gap-4">
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

        {/* Botão do Menu (Visível em telemóveis e tablets até ao tamanho lg) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-[#36654A] lg:hidden focus:outline-none"
          aria-label="Abrir Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu suspenso (Mobile / Tablet) - Aqui ficam os links e os botões de autenticação em ecrãs menores */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-[#F8F9FF] px-4 pt-3 pb-6">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-[#C9EAD6] text-green-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Início
            </Link>
            <Link
              href="/map"
              onClick={() => setIsOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === '/map'
                  ? 'bg-[#C9EAD6] text-green-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Locais de Coleta
            </Link>
            <Link
              href="/education"
              onClick={() => setIsOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === '/education'
                  ? 'bg-[#C9EAD6] text-green-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Aprender & Dicas
            </Link>
            <Link
              href="/minha-compat"
              onClick={() => setIsOpen(false)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === '/minha-conta'
                  ? 'bg-[#C9EAD6] text-green-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Minha Conta
            </Link>
          </nav>

          {/* Botões duplicados removidos da barra superior e centralizados apenas aqui no menu mobile/tablet */}
          <div className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-4">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full py-2 text-center text-sm font-medium text-gray-700 hover:text-green-800"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              onClick={() => setIsOpen(false)}
              className="w-full rounded-full bg-[#36654A] py-2 text-center text-sm font-medium text-white hover:bg-[#234734]"
            >
              Cadastrar-se
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
