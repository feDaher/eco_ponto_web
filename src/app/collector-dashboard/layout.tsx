'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CollectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getStoredUser = () => {
    if (typeof window === 'undefined') return null;
    const savedUserJson = localStorage.getItem('@EcoPonto:user');
    return savedUserJson ? JSON.parse(savedUserJson) : null;
  };

  const currentUser = user || getStoredUser();
  const isAuthorized = currentUser && (currentUser.role === 'coletor' || currentUser.role === 'admin');

  useEffect(() => {
    if (!isMounted || loading) return;

    if (!isAuthorized) {
      router.replace('/login');
    }
  }, [isMounted, loading, isAuthorized, router]);

  if (!isMounted || loading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">
          A verificar permissões de acesso...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}