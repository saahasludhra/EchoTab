import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-60" />
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-25" />
      <div className="relative text-center">
        <p className="font-display text-8xl font-bold text-gradient">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          This page wandered out of your browser memory.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/">
            <Button className="gap-2"><Home className="h-4 w-4" /> Back home</Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline">Try the demo</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
