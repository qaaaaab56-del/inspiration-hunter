import { useEffect, useRef, useCallback } from 'react';
import { useInspirations } from '../../hooks/useInspirations';
import { InspirationCard } from './InspirationCard';
import { Skeleton } from '../ui/Skeleton';

export function InspirationList() {
  const {
    inspirations,
    isLoading,
    hasMore,
    fetchInspirations,
    loadMore,
    removeInspiration,
    triggerAIProcess,
  } = useInspirations();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node || !hasMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );
      observerRef.current.observe(node);
    },
    [hasMore, loadMore]
  );

  return (
    <div className="space-y-3">
      {inspirations.map((inspiration, index) => (
        <InspirationCard
          key={inspiration.id}
          inspiration={inspiration}
          onDelete={removeInspiration}
          onProcess={triggerAIProcess}
        />
      ))}

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="py-4">
          {isLoading && <Skeleton />}
        </div>
      )}

      {/* No more items hint */}
      {!hasMore && inspirations.length > 3 && (
        <p className="text-center text-[12px] text-stone-300 py-8">
          已加载全部灵感
        </p>
      )}
    </div>
  );
}
