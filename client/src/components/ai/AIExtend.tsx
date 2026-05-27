import { useState } from 'react';
import type { ExtendedThought } from '../../types';

interface AIExtendProps {
  thoughts: ExtendedThought[];
}

export function AIExtend({ thoughts }: AIExtendProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-wider text-stone-300 mb-3">
        AI 思维延展
      </h4>
      <div className="space-y-2">
        {thoughts.map((thought, index) => (
          <div
            key={index}
            className="border border-stone-100 rounded-xl overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-stone-50 transition-colors"
            >
              <span
                className={`
                  inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-medium shrink-0
                  ${expandedIndex === index
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-stone-100 text-stone-400'
                  }
                `}
              >
                {index + 1}
              </span>
              <span className="text-[13px] font-medium text-stone-600 flex-1">
                {thought.direction}
              </span>
              <svg
                className={`w-4 h-4 text-stone-300 transition-transform duration-200 ${expandedIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedIndex === index && (
              <div className="px-4 pb-4 animate-slide-up">
                <p className="text-[13px] text-stone-500 leading-relaxed pl-9">
                  {thought.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
