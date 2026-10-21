import Sidebar from '@/components/admin/Sidebar';
import TopHeaderAdm from '@/components/admin/TopHeaderAdm';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      {/* Sidebar */}
      <Sidebar />

      {/* Área do sistema */}
      <div className="ml-64">
        {/* Header */}
        <TopHeaderAdm />

        {/* Conteúdo principal */}
        <main className="h-screen overflow-y-auto pt-[80px]">{children}</main>
      </div>
    </div>
  );
}
