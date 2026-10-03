'use client';

import { useEffect, useState } from 'react';
import { Share2 } from 'lucide-react';

import { Button } from '../ui/button';

type ShareButtonProps = {
  title: string;
  text: string;
};
// Botão de compartilhamento do ponto de coleta
export function ShareButton({ title, text }: ShareButtonProps) {
  const [feedback, setFeedback] = useState<'idle' | 'copied' | 'error'>('idle');

  useEffect(() => {
    if (feedback === 'idle') {
      return;
    }

    const timeoutId = window.setTimeout(() => setFeedback('idle'), 2000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  async function share() {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title,
        text,
        url,
      });

      return;
    }

    try {
      if (!navigator.clipboard?.writeText) {
        setFeedback('error');
        return;
      }

      await navigator.clipboard.writeText(url);
      setFeedback('copied');
    } catch {
      setFeedback('error');
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="default"
      onClick={share}
      className="gap-2"
    >
      <Share2 className="h-4 w-4" />
      <span aria-live="polite">
        {feedback === 'copied'
          ? 'Link copiado!'
          : feedback === 'error'
            ? 'Não foi possível copiar o link.'
            : 'Compartilhar'}
      </span>
    </Button>
  );
}
