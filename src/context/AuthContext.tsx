'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'cidadao' | 'coletor' | 'admin';

interface AuthContextType {
  user: any | null;
  role: UserRole;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, roleType: UserRole, cnpj?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole>('cidadao');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('@EcoPonto:token');
    const savedRole = localStorage.getItem('@EcoPonto:role') as UserRole;
    const savedUser = localStorage.getItem('@EcoPonto:user');
    
    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);
      if (savedUser) setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);


  
  const login = async (email: string, pass: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        const userRole = data.user.role || 'cidadao';
        setRole(userRole);

        localStorage.setItem('@EcoPonto:token', data.token);
        localStorage.setItem('@EcoPonto:role', userRole);
        localStorage.setItem('@EcoPonto:user', JSON.stringify(data.user));
        return;
      }
      throw new Error('Simulacao');
    } catch {
      console.warn('Simular o controle das sessões');
      let simulatedRole: UserRole = 'cidadao';
      if (email.includes('admin')) simulatedRole = 'admin';
      else if (email.includes('coletor')) simulatedRole = 'coletor';

      const mockToken = 'mock-jwt-token-123';
      const mockUser = { name: 'Utilizador Teste', email, role: simulatedRole };

      setToken(mockToken);
      setUser(mockUser);
      setRole(simulatedRole);

      localStorage.setItem('@EcoPonto:token', mockToken);
      localStorage.setItem('@EcoPonto:role', simulatedRole);
      localStorage.setItem('@EcoPonto:user', JSON.stringify(mockUser));
    }
  };

  const register = async (name: string, email: string, pass: string, roleType: UserRole, cnpj?: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass, role: roleType, cnpj }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        setRole(roleType);

        localStorage.setItem('@EcoPonto:token', data.token);
        localStorage.setItem('@EcoPonto:role', roleType);
        localStorage.setItem('@EcoPonto:user', JSON.stringify(data.user));
        return;
      }
      throw new Error('Simulacao');
    } catch {
      const mockToken = 'mock-jwt-token-register';
      const mockUser = { name, email, role: roleType };

      setToken(mockToken);
      setUser(mockUser);
      setRole(roleType);

      localStorage.setItem('@EcoPonto:token', mockToken);
      localStorage.setItem('@EcoPonto:role', roleType);
      localStorage.setItem('@EcoPonto:user', JSON.stringify(mockUser));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('@EcoPonto:token');
    localStorage.removeItem('@EcoPonto:role');
    localStorage.removeItem('@EcoPonto:user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, role, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);