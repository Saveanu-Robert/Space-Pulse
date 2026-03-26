'use client';

import { useState } from 'react';
import { Share2, Check, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showToast } from './toast-container';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url ?? window.location.href;
    const shareData = { title, text: text ?? title, url: shareUrl };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${title}\n${shareUrl}`);
      setCopied(true);
      showToast({ title: 'Link copied!', description: 'Share link copied to clipboard', type: 'success' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast({ title: 'Copy failed', description: 'Unable to copy to clipboard', type: 'warning' });
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1.5 text-xs text-muted-foreground hover:text-white">
      {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
    </Button>
  );
}
