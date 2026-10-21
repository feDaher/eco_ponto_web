import { RequireRole } from '@/components/auth/RequireRole';

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RequireRole>{children}</RequireRole>;
}
