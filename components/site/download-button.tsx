'use client';

import * as React from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/site';
import { toast } from 'sonner';

type Status = 'idle' | 'working' | 'done';

export function DownloadButton({ className, ...props }: ButtonProps) {
  const [status, setStatus] = React.useState<Status>('idle');

  const handleDownload = React.useCallback(async () => {
    if (status === 'working') return;
    setStatus('working');
    try {
      const res = await fetch(siteConfig.downloadUrl, { method: 'HEAD' });
      if (!res.ok) throw new Error('not found');
    } catch {
      // fall through to attempt the download anyway
    }
    try {
      const a = document.createElement('a');
      a.href = siteConfig.downloadUrl;
      a.download = 'EchoTab.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setStatus('done');
      toast.success('Downloading EchoTab.zip', {
        description: 'Extract it, then load it unpacked in Chrome or Edge.',
      });
      setTimeout(() => setStatus('idle'), 2600);
    } catch {
      setStatus('idle');
      toast.error('Download failed', {
        description: 'Please try again from the Install page.',
      });
    }
  }, [status]);

  return (
    <Button
      onClick={handleDownload}
      className={cn('gap-2 shadow-glow', className)}
      {...props}
    >
      {status === 'working' ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : status === 'done' ? (
        <Check className="h-4 w-4" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {status === 'done' ? 'Downloaded' : 'Download Extension'}
    </Button>
  );
}
