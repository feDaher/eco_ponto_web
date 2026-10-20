import { LoginSidebar } from '@/components/layout/LoginSidebar';
import { RegisterForm } from '@/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full bg-white text-gray-800">
      {/* 1. Coluna da Esquerda: O Painel Verde (LoginSidebar) fica agora do lado esquerdo! */}
      <LoginSidebar />

      {/* 2. Coluna da Direita: O Formulário de Registo e os controlos de topo */}
      <div className="flex w-full flex-col justify-between p-8 md:w-[480px] lg:w-[520px] shrink-0 lg:px-12 xl:px-16 overflow-y-auto">
        <RegisterForm />

        {/* Rodapé esquerdo padrão */}
        <div className="flex justify-between border-t border-gray-100 pt-4 text-[10px] uppercase tracking-wider text-gray-400">
          <a href="/politica-de-privacidade" className="hover:text-gray-600">
            Política de Privacidade
          </a>
          <a href="/termos-de-servico" className="hover:text-gray-600">
            Termos de Serviço
          </a>
        </div>
      </div>
    </div>
  );
}