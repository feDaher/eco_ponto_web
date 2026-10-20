'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PasswordInput } from './ui/PasswordInput';
import { useAuth, UserRole } from '@/context/AuthContext';

export function RegisterForm() {
  const [accountType, setAccountType] = useState<'individual' | 'empresa'>('individual');
  const [fullName, setFullName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    // Se for empresa, vai como 'coletor'. Se não, como 'cidadao'
    const role: UserRole = accountType === 'empresa' ? 'coletor' : 'cidadao';

    // Fazer login no contexto
    login(email, role);

    // Redirecionamentos corretos baseados no cargo
    if (role === 'coletor') {
      router.push('/collector-dashboard');
    } else {
      router.push('/user-dashboard');
    }
  };

  return (
    <div className="w-full py-4">
      
      {/* Cabeçalho unificado idêntico ao design: Voltar à esquerda e Logo à direita */}
      <div className="flex items-center justify-between mb-8">
        <Link 
          href="/login" 
          className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-[#3A634A] hover:opacity-85 uppercase transition-all bg-gray-50/80 px-3 py-2 rounded-full border border-gray-100"
        >
          <ArrowLeft className="h-3 w-3" />
          Voltar para login
        </Link>
        
        <div className="flex items-center gap-1.5">
          <Image 
            src="/icons/ecopontologoverde.png" 
            alt="EcoPonto" 
            width={32} 
            height={32} 
            className="h-8 w-8 object-contain"
          />
        </div>
      </div>

      {/* Título e subtítulo */}
      <h2 className="text-[28px] font-extrabold tracking-tight text-gray-900 leading-tight">
        Criar Conta
      </h2>
      <p className="mt-1 text-sm text-gray-500 font-normal">
        Insira seus dados para se registrar como um guardião digital.
      </p>

      {/* Alternador de Tipo de Conta */}
      <div className="mt-6 flex rounded-xl bg-gray-100/90 p-1 border border-gray-100/30">
        <button
          type="button"
          onClick={() => setAccountType('individual')}
          className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition-all ${
            accountType === 'individual'
              ? 'bg-white text-gray-950 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Individual
        </button>
        <button
          type="button"
          onClick={() => setAccountType('empresa')}
          className={`flex-1 rounded-lg py-2.5 text-xs font-semibold transition-all ${
            accountType === 'empresa'
              ? 'bg-white text-gray-950 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          Empresa
        </button>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        
        {/* Nome Completo / Nome da Empresa */}
        <div>
          <label htmlFor="fullName" className="block mb-1 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
            {accountType === 'empresa' ? 'Razão Social / Nome da Empresa' : 'Nome Completo'}
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={accountType === 'empresa' ? 'Eco Coletas Ltda' : 'João Silva'}
            className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/20 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3A634A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3A634A]"
          />
        </div>

        {/* Input de CNPJ - Ativa apenas na aba Empresa */}
        {accountType === 'empresa' && (
          <div>
            <label htmlFor="cnpj" className="block mb-1 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
              CNPJ
            </label>
            <input
              id="cnpj"
              type="text"
              required
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0000-00"
              className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/20 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3A634A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3A634A]"
            />
          </div>
        )}

        {/* E-mail */}
        <div>
          <label htmlFor="email" className="block mb-1 text-[11px] font-bold text-gray-600 uppercase tracking-wide">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@email.com"
            className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/20 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3A634A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3A634A]"
          />
        </div>

        {/* Senha */}
        <div>
          <PasswordInput
            id="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {/* Confirmar Senha */}
        <div>
          <PasswordInput
            id="confirmPassword"
            label="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {/* Aceite de termos */}
        <div className="flex items-center gap-2.5 pt-1">
          <input
            id="terms"
            type="checkbox"
            required
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="h-4.5 w-4.5 rounded-lg border-gray-300 text-[#3A634A] focus:ring-[#3A634A] cursor-pointer"
          />
          <label htmlFor="terms" className="text-[11px] text-gray-500 leading-tight">
            Eu concordo com os{' '}
            <Link className="font-semibold text-gray-700 hover:text-gray-900 underline" href="/termos-de-servico">
              Termos de Serviço
            </Link>{' '}
            e{' '}
            <Link className="font-semibold text-gray-700 hover:text-gray-900 underline" href="/politica-de-privacidade">
              Política de Privacidade
            </Link>.
          </label>
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3A634A] py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2F523D]"
        >
          Criar Conta <ArrowRight className="h-4 w-4" />
        </button>

        {/* Divisória social */}
        <div className="my-5 flex items-center gap-3 before:h-px before:flex-1 before:bg-gray-150 after:h-px after:flex-1 after:bg-gray-150">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Ou cadastre-se com</span>
        </div>

        {/* Ícones sociais locais */}
        <div className="flex justify-center gap-4">
          <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all">
            <Image src="/icons/Google-G-Logo.png" alt="Google" width={18} height={18} className="object-contain" />
          </button>
          <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all">
            <Image src="/icons/APPLE.png" alt="Apple" width={18} height={18} className="object-contain" />
          </button>
        </div>

        {/* Barra de Progresso no Rodapé do Form */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-[9px] text-gray-400 font-bold uppercase tracking-wider">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between w-full mb-1">
              <span>Passo 1 de 3: Identificação</span>
              <span className="normal-case font-normal">EcoPonto ID Seguro</span>
            </div>
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#3A634A] w-[33%] rounded-full"></div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}