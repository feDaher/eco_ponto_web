'use client';

import { ShieldCheck, Download, UserPlus, Users2, Leaf, Recycle, UserX} from 'lucide-react';
import { UserItem } from '../mockdata/userData';

interface UserManagementStatsProps {
  users?: UserItem[];
  totalBaseCount?: number;
  onAddUser?: () => void;
}

export default function UserManagementStats({
  users = [],
  totalBaseCount = 1284,
  onAddUser,
}: UserManagementStatsProps) {
  const totalFiltrado = users.length;

  const totalGuardioes = users.filter((u) =>
    u.roleName.toLowerCase().includes('guardião')
  ).length;

  const totalOperadores = users.filter(
    (u) =>
      u.roleName.toLowerCase().includes('coletor') ||
      u.roleName.toLowerCase().includes('operador') ||
      u.roleName.toLowerCase().includes('suporte') ||
      u.roleName.toLowerCase().includes('triagem')
  ).length;

  const totalFiscaisAdmins = users.filter(
    (u) =>
      u.roleName.toLowerCase().includes('fiscal') ||
      u.roleName.toLowerCase().includes('coordenador') ||
      u.roleName.toLowerCase().includes('admin')
  ).length;

  const totalBloqueados = users.filter(
    (u) => u.statusText.toLowerCase() === 'bloqueado'
  ).length;

  const percentualGuardioes =
    totalFiltrado > 0 ? Math.round((totalGuardioes / totalFiltrado) * 100) : 0;

  
  const handleExportPDF = () => {
    if (users.length === 0) {
      alert('Nenhum dado disponível para exportar com os filtros atuais.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Usuários - EcoPonto Gestão Pública</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; color: #333; }
            h1 { font-size: 18px; color: #1b5e3f; margin-bottom: 4px; }
            p { font-size: 11px; color: #666; margin-top: 0; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
            th { background-color: #f8fafc; font-size: 10px; text-transform: uppercase; color: #475569; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
            .ativo { background: #dcfce7; color: #166534; }
            .pendente { background: #fef3c7; color: #92400e; }
            .bloqueado { background: #ffe4e6; color: #991b1b; }
            .footer { margin-top: 20px; font-size: 10px; color: #94a3b8; text-align: right; }
          </style>
        </head>
        <body>
          <h1>EcoPonto Gestão Pública - Relatório de Usuários</h1>
          <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')} | Total de registros: ${users.length}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil / Cargo</th>
                <th>Unidade / Polo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${users
                .map(
                  (u) => `
                <tr>
                  <td>#${u.id}</td>
                  <td><strong>${u.name}</strong><br/><small>${u.subDetail}</small></td>
                  <td>${u.email}</td>
                  <td>${u.roleName}</td>
                  <td>${u.unitName}</td>
                  <td><span class="badge ${u.statusText.toLowerCase()}">${u.statusText}</span></td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div class="footer">Documento Oficial • Módulo de Governança & Acessos</div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
          <span className="rounded border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[#36654a]">
            • MÓDULO DE GOVERNANÇA &amp; ACESSOS
          </span>
          <span className="text-slate-400">|</span>
          <span className="flex items-center gap-1 text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
            LGPD &amp; PNRS Compliance
          </span>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
              Gestão de Usuários e Permissões
            </h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Gerencie contas, bloqueie acessos e promova perfis de cidadãos e
              operadores na plataforma pública de logística reversa.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-95"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              Exportar Lista (PDF)
            </button>
            <button
              type="button"
              onClick={onAddUser}
              className="flex items-center gap-1.5 rounded-xl bg-[#2d6a4f] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#1b5e3f] active:scale-95"
            >
              <UserPlus className="h-3.5 w-3.5" />
              + Novo Usuário
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        {/* Card 1: Total Exibido / Filtrado */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              TOTAL DE USUÁRIOS
            </span>
            <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-700">
              <Users2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800">
                {totalFiltrado}
              </span>
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                de {totalBaseCount}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-[11px] font-medium text-slate-400">
              <span>Exibidos pelo filtro</span>
              <span className="font-semibold text-slate-600">
                {Math.round((totalFiltrado / totalBaseCount) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              GUARDIÕES DIGITAIS
            </span>
            <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-700">
              <Leaf className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800">
                {totalGuardioes}
              </span>
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                {percentualGuardioes}%
              </span>
            </div>
            <div className="mt-1 text-[11px] font-medium text-slate-500">
              Cidadãos com descarte ativo
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              OPERADORES / COLETA
            </span>
            <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-700">
              <Recycle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800">
                {totalOperadores}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Cooperativas
              </span>
            </div>
            <div className="mt-1 text-[11px] font-medium text-slate-500">
              Triagem e pontos fixos
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              FISCAIS &amp; ADMINS
            </span>
            <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800">
                {totalFiscaisAdmins}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Auditados
              </span>
            </div>
            <div className="mt-1 text-[11px] font-medium text-slate-500">
              Acesso institucional e fiscal
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-rose-100 bg-white p-4 shadow-2xs">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
              BLOQUEADOS / SUSPENSOS
            </span>
            <div className="rounded-lg bg-rose-50 p-1.5 text-rose-600">
              <UserX className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-600">
                {totalBloqueados}
              </span>
              {totalBloqueados > 0 && (
                <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                  Atenção
                </span>
              )}
            </div>
            <div className="mt-1 text-[11px] font-medium text-slate-500">
              Infrações na triagem
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}