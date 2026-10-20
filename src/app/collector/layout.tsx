import { RequireRole } from '@/components/auth/RequireRole';

export default function CollectorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RequireRole roles={['COLLECTOR', 'ADMIN']}>{children}</RequireRole>;
}
