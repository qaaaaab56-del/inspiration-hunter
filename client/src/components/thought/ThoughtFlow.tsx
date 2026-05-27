import { useEffect, useRef, useCallback } from 'react';
import { useInspirations } from '../../hooks/useInspirations';
import { ThoughtBlock } from './ThoughtBlock';

interface ThoughtFlowProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ThoughtFlow({ selectedId, onSelect }: ThoughtFlowProps) {
  const { inspirations, isLoading, hasMore, loadMore, removeInspiration, triggerAIProcess } =
    useInspirations();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node || !hasMore) return;
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) loadMore();
        },
        { threshold: 0.1 }
      );
      observerRef.current.observe(node);
    },
    [hasMore, loadMore]
  );

  if (inspirations.length === 0 && !isLoading) {
    return null; // parent handles empty state
  }

  return (
    <div className="divide-y divide-[var(--border-subtle)]">
      {inspirations.map((item) => (
        <ThoughtBlock
          key={item.id}
          inspiration={item}
          isActive={selectedId === item.id}
          onDelete={removeInspiration}
          onProcess={triggerAIProcess}
          onClick={onSelect}
        />
      ))}

      {/* Infinite scroll sentinel */}
      {hasMore && <div ref={sentinelRef} className="py-8" />}

      {/* Loaded all */}
      {!hasMore && inspirations.length > 5 && (
        <p className="text-center text-[12px] text-[var(--text-quaternary)] py-10">
          已加载全部记忆
        </p>
      )}
    </div>
  );
}
