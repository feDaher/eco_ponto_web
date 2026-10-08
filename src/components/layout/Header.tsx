'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES, mainNav } from '@/lib/routes';

// Considera ativo também as sub-rotas (ex.: /education/baterias ativa "/education")
function isActiveRoute(pathname: string, href: string) {
  if (href === ROUTES.home) return pathname === ROUTES.home;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-white bg-surface">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6">
        <Link
          href={ROUTES.home}
          onClick={closeMenu}
          className="flex items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-brand"
        >
          <Image
            src="/icons/logo.png"
            alt=""
            width={28}
            height={25}
            className="h-auto w-7 md:w-8"
          />
          <span className="text-base font-bold text-brand md:text-lg">
            EcoPonto
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {mainNav.map((item) => {
              const isActive = isActiveRoute(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'text-sm font-medium transition-colors',
                      isActive
                        ? 'rounded-full bg-brand-light px-4 py-1.5 text-green-800'
                        : 'text-gray-600 hover:text-green-800'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href={ROUTES.login}
            className="text-sm font-medium text-gray-700 transition-colors hover:text-green-800"
          >
            Entrar
          </Link>
          <Link
            href={ROUTES.register}
            className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            Cadastrar-se
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-lg p-2 text-brand focus-visible:outline-2 focus-visible:outline-brand lg:hidden"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-gray-200 bg-surface px-4 pt-3 pb-6 lg:hidden"
        >
          <nav aria-label="Navegação principal (mobile)">
            <ul className="flex flex-col space-y-2">
              {mainNav.map((item) => {
                const isActive = isActiveRoute(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-brand-light text-green-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-4">
            <Link
              href={ROUTES.login}
              onClick={closeMenu}
              className="w-full py-2 text-center text-sm font-medium text-gray-700 hover:text-green-800"
            >
              Entrar
            </Link>
            <Link
              href={ROUTES.register}
              onClick={closeMenu}
              className="w-full rounded-full bg-brand py-2 text-center text-sm font-medium text-white hover:bg-brand-dark"
            >
              Cadastrar-se
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
