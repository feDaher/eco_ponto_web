
import Image from 'next/image';
import Link from 'next/link';
import { LoginSidebar } from '@/components/layout/LoginSidebar';
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-white text-gray-800">
      {/* Coluna da Esquerda (Formulário) */}
      <div className="flex w-full flex-col justify-between p-8 md:w-[480px] lg:w-[520px] shrink-0 lg:px-12 xl:px-16">
        {/* Logo Topo */}
        <div className="flex items-center gap-2">
          <Image
            src="/icons/ecopontologoverde.png"
            alt="EcoPonto"
            width={28}
            height={25}
            className="h-auto w-8"
          />
          <span className="text-2xl font-bold tracking-tight text-[#3A634A]">
            EcoPonto
          </span>
        </div>

        {/* Formulário Centralizado */}
        <LoginForm />

        {/* Rodapé Esquerdo */}
        <div className="flex justify-between border-t border-gray-100 pt-4 text-[10px] uppercase tracking-wider text-gray-400">
          <Link href="/politica-de-privacidade" className="hover:text-gray-600">
            Política de Privacidade
          </Link>
          <Link href="/termos-de-servico" className="hover:text-gray-600">
            Termos de Serviço
          </Link>
        </div>
      </div>

      {/* Coluna da Direita (Painel Verde Importado) */}
      <LoginSidebar />
    </div>
  );

}
