import { RequireRole } from '@/components/auth/RequireRole';
import { CollectorShell } from '@/components/collector/CollectorShell';
import { CollectorProvider } from '@/components/collector/collectorContext';

export default function CollectorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RequireRole roles={['COLLECTOR', 'ADMIN']}>
      <CollectorProvider>
        <CollectorShell>{children}</CollectorShell>
      </CollectorProvider>
    </RequireRole>
  );
}
