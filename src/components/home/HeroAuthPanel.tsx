'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  BatteryPlus,
  Houses,
  LogIn,
  Recycle,
  ShieldCheck,
  Trees,
  Truck,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { HOME_BY_ROLE, ROUTES } from '@/lib/routes';

const STAFF_INFO = {
  ADMIN: {
    badge: 'Modo administrador',
    roleLabel: 'administrador',
    buttonLabel: 'Ir para o painel administrativo',
    icon: ShieldCheck,
  },
  COLLECTOR: {
    badge: 'Modo coletor',
    roleLabel: 'coletor',
    buttonLabel: 'Ir para o painel do coletor',
    icon: Truck,
  },
} as const;

export function HeroAuthPanel() {
  const { status, user } = useAuth();

  if (status === 'loading') {
    return (
      <div
        aria-hidden="true"
        className="h-96 animate-pulse rounded-3xl border border-slate-100 bg-card shadow-xl"
      />
    );
  }

  if (status === 'authenticated' && user && user.role !== 'CITIZEN') {
    const info = STAFF_INFO[user.role];
    const Icon = info.icon;

    return (
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-card p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-brand-light p-2.5 text-brand">
            <Icon aria-hidden="true" className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {info.badge}
            </h3>
            <p className="text-xs text-slate-500">
              Olá, {user.name.split(' ')[0]}
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Você entrou como <strong>{info.roleLabel}</strong>. O painel de
          impacto pessoal é exclusivo para cidadãos.
        </p>

        <Link
          href={HOME_BY_ROLE[user.role]}
          className="inline-flex items-center justify-center rounded-xl bg-brand-solid px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-solid-hover"
        >
          {info.buttonLabel}
        </Link>
      </div>
    );
  }

  if (status === 'authenticated' && user) {
    return (
      <div className="bg-card rounded-3xl p-6 shadow-xl border border-slate-100 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-solid rounded-lg">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Painel Comunitário
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                <span className="text-xs text-slate-500">
                  Atualizado em tempo real
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-solid text-white rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-xs tracking-wider uppercase text-brand-foreground font-semibold">
              Lixo Eletrônico Recuperado
            </span>
            <Recycle className="w-5 h-5 text-brand-pale opacity-80" />
          </div>

          <div>
            <div className="text-3xl font-bold">
              42.8{' '}
              <span className="text-lg font-normal text-brand-pale">
                kg salvos
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-brand-medium rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-brand-pale h-2.5 rounded-full"
                style={{ width: '78%' }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-brand-foreground">
              <span>Meta Mensal: 50 kg</span>
              <span className="font-semibold text-brand-foreground">
                78% concluído
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-alt p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div className="p-2 bg-brand-light rounded-xl w-fit text-brand-muted mb-2">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800">3 Árvores</p>
              <p className="text-xs text-slate-500">Preservadas de mineração</p>
            </div>
          </div>

          <div className="bg-surface-alt p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <div className="p-2 bg-surface-strong rounded-xl w-fit text-brand-muted mb-2">
              <Houses className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800">+15 Pontos</p>
              <p className="text-xs text-slate-500">Parceiros certificados</p>
            </div>
          </div>
        </div>

        <div className="bg-surface p-3.5 rounded-2xl border border-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-light rounded-xl text-slate-600">
              <BatteryPlus className="w-4 h-4 text-brand-muted" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                Carlos M.{' '}
                <span className="font-normal text-slate-600">
                  entregou 4 baterias
                </span>
              </p>
              <p className="text-slate-400">Há 12 minutos • Ponto Centro</p>
            </div>
          </div>
          <span className="font-semibold text-brand px-2 py-1">+40 pts</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl p-8 shadow-xl border border-slate-100 text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-brand-solid rounded-2xl flex items-center justify-center shadow-inner">
        <Image
          src="/icons/ecoponto-logo-icon-white.png"
          alt=""
          width={28}
          height={25}
          className="h-auto w-8"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900">
          Acompanhe seu Impacto Pessoal
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          Cadastre-se para ter acesso ao conteúdo personalizado, acompanhar suas
          metas de reciclagem, acumular pontos ecológicos e receber recompensas!
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Link
          href={ROUTES.register}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-solid text-white font-semibold text-sm hover:bg-brand-solid-hover transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar-se Gratuitamente</span>
        </Link>

        <Link
          href={ROUTES.login}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-ink font-medium text-sm hover:bg-slate-200 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          <span>Já tenho uma conta (Entrar)</span>
        </Link>
      </div>
    </div>
  );
}
