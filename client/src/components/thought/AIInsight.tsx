import { useState } from 'react';
import type { ExtendedThought } from '../../types';

interface AIInsightProps {
  thoughts: ExtendedThought[];
}

export function AIInsight({ thoughts }: AIInsightProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="pl-4 border-l border-[var(--border-subtle)]">
      {thoughts.map((thought, i) => (
        <div key={i} className="mb-1 last:mb-0">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full text-left py-1.5 flex items-center gap-2 group"
          >
            <span
              className={`
                w-1 h-1 rounded-full shrink-0 transition-colors duration-300
                ${openIndex === i ? 'bg-[var(--text-secondary)]' : 'bg-[var(--text-quaternary)]'}
              `}
            />
            <span
              className={`
                text-[12px] transition-colors duration-300
                ${openIndex === i ? 'text-[var(--text-secondary)]' : 'text-[var(--text-tertiary)]'}
                group-hover:text-[var(--text-secondary)]
              `}
            >
              {thought.direction}
            </span>
          </button>
          {openIndex === i && (
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed pl-4 pb-2 animate-slide-up">
              {thought.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
