'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const getStoredUser = () => {
    if (typeof window === 'undefined') return null;
    const savedUserJson = localStorage.getItem('@EcoPonto:user');
    return savedUserJson ? JSON.parse(savedUserJson) : null;
  };

  const currentUser = user || getStoredUser();
  const isAuthorized = currentUser && currentUser.role === 'admin';

  useEffect(() => {
    if (loading) return;

    if (!isAuthorized) {
      router.replace('/login');
    }
  }, [loading, isAuthorized, router]);

  if (loading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">
          A verificar permissões de acesso...
        </p>
      </div>
    );
  }

  return <div className="bg-surface">{children}</div>;
}