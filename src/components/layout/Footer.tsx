import Image from 'next/image';
import Link from 'next/link';
import { Globe } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#EFF4FF] text-slate-700 pt-12 pb-6 px-6 md:px-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Bloco 1: Logo e Descrição */}
        <div className="space-y-4 flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="flex items-center gap-2 font-bold text-xl text-[#36654A]">
            <Image
              src="/icons/logoo.png"
              alt="EcoPonto"
              width={28}
              height={25}
              className="h-auto w-8"
            />
            <span>EcoPonto</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
            Promovendo o descarte consciente e a reciclagem de lixo eletrônico
            para proteger os ecossistemas urbanos e rurais do Brasil.
          </p>
        </div>

        {/* Bloco 2: Navegação */}
        <div className="text-center sm:text-left">
          <h3 className="font-semibold text-xs tracking-wider text-slate-900 uppercase mb-4">
            Navegação
          </h3>
          <nav aria-label="Área Navegação do rodapé">
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:underline hover:text-slate-900">
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/pontos"
                  className="hover:underline hover:text-slate-900"
                >
                  Encontrar Pontos
                </Link>
              </li>
              <li>
                <Link
                  href="/aprender"
                  className="hover:underline hover:text-slate-900"
                >
                  Aprender & Dicas
                </Link>
              </li>
              <li>
                <Link
                  href="/metricas"
                  className="hover:underline hover:text-slate-900"
                >
                  Métricas de Impacto
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bloco 3: Institucional */}
        <div className="text-center sm:text-left">
          <h3 className="font-semibold text-xs tracking-wider text-slate-900 uppercase mb-4">
            Institucional
          </h3>
          <nav aria-label="Área Institucional do rodapé">
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/sobre"
                  className="hover:underline hover:text-slate-900"
                >
                  Sobre a Iniciativa
                </Link>
              </li>
              <li>
                <Link
                  href="/cooperativas"
                  className="hover:underline hover:text-slate-900"
                >
                  Cooperativas Parceiras
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="hover:underline hover:text-slate-900"
                >
                  Fale Conosco
                </Link>
              </li>
              {/* Oculto a pedido do Felipe, só apagar esse hidden se formos utilizar */}
              <li className="hidden">
                <Link
                  href="/relatorio"
                  className="hover:underline hover:text-slate-900"
                >
                  Relatório de Sustentabilidade
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bloco 4: Legal */}
        <div className="text-center sm:text-left">
          <h3 className="font-semibold text-xs tracking-wider text-slate-900 uppercase mb-4">
            Legal
          </h3>
          <nav aria-label="Área Legal do rodapé">
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/privacidade"
                  className="hover:underline hover:text-slate-900"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/termos"
                  className="hover:underline hover:text-slate-900"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:underline hover:text-slate-900"
                >
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link
                  href="/lgpd"
                  className="hover:underline hover:text-slate-900"
                >
                  Conformidade LGPD
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Linha de baixo: Copyright */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-300/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600 text-center sm:text-left">
        <p>© {currentYear} EcoPonto. All rights reserved.</p>
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <Globe className="w-4 h-4 text-slate-600" />
          <span>Manhuaçu, MG </span>
        </div>
      </div>
    </footer>
  );
}
