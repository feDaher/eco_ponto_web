'use client';

import { useEffect, useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type Feedback = 'idle' | 'copied' | 'error';

const LABELS: Record<Feedback, string> = {
  idle: 'Compartilhar',
  copied: 'Link copiado!',
  error: 'Não foi possível copiar o link',
};

type ShareButtonProps = {
  title: string;
  text: string;
};

export function ShareButton({ title, text }: ShareButtonProps) {
  const [feedback, setFeedback] = useState<Feedback>('idle');

  useEffect(() => {
    if (feedback === 'idle') return;

    const timeoutId = window.setTimeout(() => setFeedback('idle'), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  async function share() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setFeedback('copied');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setFeedback('error');
    }
  }

  return (
    <Button type="button" variant="ghost" size="lg" onClick={share}>
      <Share2 aria-hidden="true" />
      <span aria-live="polite">{LABELS[feedback]}</span>
    </Button>
  );
}
