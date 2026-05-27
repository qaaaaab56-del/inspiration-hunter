import { useMemo, useState } from 'react';
import type { Inspiration } from '../../types';
import { useInspirationStore } from '../../store/useInspirationStore';

interface SidebarProps {
  onSelect: (id: string) => void;
  onNew: () => void;
  selectedId: string | null;
}

export function Sidebar({ onSelect, onNew, selectedId }: SidebarProps) {
  const { inspirations } = useInspirationStore();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return inspirations;
    const q = query.toLowerCase();
    return inspirations.filter(
      (i) =>
        i.content.toLowerCase().includes(q) ||
        (i.title && i.title.toLowerCase().includes(q))
    );
  }, [inspirations, query]);

  const label = (item: Inspiration) => item.title || item.content.slice(0, 30) || '无标题';

  return (
    <aside className="w-60 shrink-0 h-dvh flex flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-sidebar)] overflow-hidden">
      {/* New inspiration */}
      <div className="px-4 pt-5 pb-3">
        <button
          onClick={onNew}
          className="text-[13px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-300"
        >
          + 新灵感
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索..."
          className="w-full text-[12px] bg-transparent border-b border-[var(--border-subtle)] py-1.5 outline-none placeholder:text-[var(--text-quaternary)] text-[var(--text-secondary)] focus:border-[var(--border-default)] transition-colors duration-300"
        />
      </div>

      {/* Memory fragments */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        {filtered.length === 0 ? (
          <p className="text-[12px] text-[var(--text-quaternary)] mt-2">
            {inspirations.length === 0 ? '还没有灵感记录' : '无匹配结果'}
          </p>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((item) => {
              const isSelected = selectedId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={`
                    block w-full text-left text-[13px] py-2 px-2 -mx-2 rounded-md
                    transition-colors duration-200 truncate
                    ${isSelected
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                    }
                  `}
                >
                  {label(item)}
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
}
