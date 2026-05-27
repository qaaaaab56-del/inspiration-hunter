import { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { QuickInput } from './components/input/QuickInput';
import { InspirationList } from './components/inspiration/InspirationList';
import { EmptyState } from './components/ui/EmptyState';
import { Skeleton } from './components/ui/Skeleton';
import { useInspirationStore } from './store/useInspirationStore';

export default function App() {
  const { inspirations, isLoading, fetchInspirations } = useInspirationStore();
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    fetchInspirations();

    // PWA install prompt capture
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    (deferredPrompt as any).prompt();
    const result = await (deferredPrompt as any).userChoice;
    if (result.outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const hasItems = inspirations.length > 0;

  return (
    <AppShell showInstall={!!deferredPrompt} onInstall={handleInstall}>
      {/* Input area */}
      <div className="py-6">
        <QuickInput />
      </div>

      {/* Content area */}
      {isLoading && !hasItems ? (
        <Skeleton />
      ) : hasItems ? (
        <InspirationList />
      ) : (
        <EmptyState />
      )}
    </AppShell>
  );
}
