'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_MOCK, type Evaluation } from '@/data/mockModeration';

interface EvaluationContextType {
  evaluations: Evaluation[];
  toggleVisibility: (id: string) => void;
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(
  undefined
);

export function EvaluationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('@ecoponto:evaluations');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Falha ao carregar dados do localStorage', e);
        }
      }
    }
    return INITIAL_MOCK;
  });

  useEffect(() => {
    localStorage.setItem('@ecoponto:evaluations', JSON.stringify(evaluations));
  }, [evaluations]);

  const toggleVisibility = (id: string) => {
    setEvaluations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = item.status === 'visible' ? 'hidden' : 'visible';
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  return (
    <EvaluationContext.Provider value={{ evaluations, toggleVisibility }}>
      {children}
    </EvaluationContext.Provider>
  );
}

export function useEvaluations() {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error(
      'useEvaluations deve ser usado dentro de um EvaluationProvider'
    );
  }
  return context;
}
