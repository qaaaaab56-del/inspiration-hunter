import { useState, useEffect, useCallback } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Sidebar } from './components/layout/Sidebar';
import { ThoughtInput } from './components/input/ThoughtInput';
import { ThoughtFlow } from './components/thought/ThoughtFlow';
import { useInspirationStore } from './store/useInspirationStore';

export default function App() {
  const { inspirations, isLoading, fetchInspirations, selectInspiration, selectedId } =
    useInspirationStore();
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    fetchInspirations();

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      selectInspiration(id);
    },
    [selectInspiration]
  );

  const handleNew = useCallback(() => {
    selectInspiration(null);
    setInputKey((k) => k + 1);
  }, [selectInspiration]);

  const hasItems = inspirations.length > 0;

  return (
    <AppShell
      sidebar={
        <Sidebar
          onSelect={handleSelect}
          onNew={handleNew}
          selectedId={selectedId}
        />
      }
    >
      {/* Input zone */}
      <div className="pt-16 pb-10">
        <ThoughtInput key={inputKey} autoFocus={!hasItems} />
      </div>

      {/* Thought flow or empty state */}
      {isLoading && !hasItems ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-[13px] text-[var(--text-quaternary)] animate-pulse">
            加载中...
          </p>
        </div>
      ) : hasItems ? (
        <ThoughtFlow selectedId={selectedId} onSelect={handleSelect} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 select-none">
          <p className="text-[13px] text-[var(--text-quaternary)]">
            记录你的第一个灵感
          </p>
        </div>
      )}

      {/* PWA install hint */}
      {deferredPrompt && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={async () => {
              const prompt = deferredPrompt as any;
              prompt.prompt();
              const result = await prompt.userChoice;
              if (result.outcome === 'accepted') setDeferredPrompt(null);
            }}
            className="text-[12px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-300 bg-white px-4 py-2 rounded-full shadow-sm border border-[var(--border-subtle)]"
          >
            安装应用
          </button>
        </div>
      )}
    </AppShell>
  );
}
