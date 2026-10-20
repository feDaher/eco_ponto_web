'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';
import Image from 'next/image';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('@EcoPonto:user');
      if (savedUser) {
        setHasVisitedBefore(true);
        try {
          const parsed = JSON.parse(savedUser);
        } catch (e) {
        }
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let role: UserRole = 'cidadao';
    if (email.includes('admin')) role = 'admin';
    else if (email.includes('coletor') || email.includes('empresa')) role = 'coletor';

    login(email, role);

    // 
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'coletor') {
      router.push('/collector-dashboard');
    } else {
      router.push('/user-dashboard');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
        {hasVisitedBefore ? 'Bem-vindo de volta' : 'Bem-vindo'}
      </h2>
      <p className="mt-1.5 text-xs text-gray-500">
        Por favor, insira seus dados para acessar seu painel.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1">
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@email.com"
            className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/20 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3A634A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3A634A]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
              Senha
            </label>
            <Link href="/forgot-password" className="text-xs text-[#3A634A] hover:underline font-medium">
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/20 px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#3A634A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#3A634A]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 rounded border-gray-300 text-[#3A634A] focus:ring-[#3A634A] cursor-pointer"
          />
          <label htmlFor="remember" className="text-xs text-gray-600 cursor-pointer">
            Lembrar deste dispositivo por 30 dias
          </label>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3A634A] py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2F523D]"
        >
          Entrar no Painel
        </button>

        <div className="my-5 flex items-center gap-3 before:h-px before:flex-1 before:bg-gray-150 after:h-px after:flex-1 after:bg-gray-150">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Ou continue com</span>
        </div>

        <div className="flex justify-center gap-4">
          <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all">
            <Image src="/icons/Google-G-Logo.png" alt="Google" width={18} height={18} className="object-contain" />
          </button>
          <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all">
            <Image src="/icons/APPLE.png" alt="Apple" width={18} height={18} className="object-contain" />
          </button>
        </div>      

        <div className="text-center pt-4">
          <p className="text-xs text-gray-500">
            Não tem uma conta?{' '}
            <Link href="/register" className="font-semibold text-[#3A634A] hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}