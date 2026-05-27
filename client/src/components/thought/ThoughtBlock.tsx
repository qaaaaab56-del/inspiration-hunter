import { useState, useEffect } from 'react';
import type { Inspiration } from '../../types';
import { AIInsight } from './AIInsight';
import { api } from '../../services/api';

interface ThoughtBlockProps {
  inspiration: Inspiration;
  isActive: boolean;
  onDelete: (id: string) => void;
  onProcess: (id: string) => void;
  onClick: (id: string) => void;
}

export function ThoughtBlock({ inspiration, isActive, onDelete, onProcess, onClick }: ThoughtBlockProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [similar, setSimilar] = useState<Inspiration[]>([]);

  const time = formatRelativeTime(inspiration.created_at);
  const isProcessed = inspiration.ai_status === 'done';
  const isProcessing = inspiration.ai_status === 'processing';
  const isIdle = inspiration.ai_status === 'idle';

  // Load similar inspirations when expanded and processed
  useEffect(() => {
    if (isActive && isProcessed) {
      api.getSimilarInspirations(inspiration.id).then((r) => setSimilar(r.data)).catch(() => {});
    }
  }, [isActive, isProcessed, inspiration.id]);

  return (
    <div
      className={`
        group py-5 transition-all duration-300
        ${isActive ? 'opacity-100' : 'opacity-70'}
      `}
    >
      {/* Content */}
      <div className="cursor-pointer" onClick={() => onClick(inspiration.id)}>
        {/* User's text */}
        <p className="text-[15px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
          {inspiration.content}
        </p>

        {/* AI summary — subtle inline */}
        {isProcessed && inspiration.summary && (
          <p className="text-[13px] text-[var(--text-tertiary)] italic mt-2 leading-relaxed">
            {inspiration.summary}
          </p>
        )}

        {/* Processing state */}
        {isProcessing && (
          <p className="text-[12px] text-[var(--text-tertiary)] mt-2 animate-pulse">
            AI 正在理解...
          </p>
        )}
      </div>

      {/* AI Insight panel */}
      {isActive && isProcessed && inspiration.extended_thoughts && (
        <div className="mt-3">
          <AIInsight thoughts={inspiration.extended_thoughts} />
        </div>
      )}

      {/* Similar inspirations */}
      {isActive && isProcessed && similar.length > 0 && (
        <div className="mt-3 pl-4 border-l border-[var(--border-subtle)]">
          <p className="text-[11px] text-[var(--text-quaternary)] mb-2">你可能想过类似的...</p>
          {similar.map((s) => (
            <button
              key={s.id}
              onClick={(e) => {
                e.stopPropagation();
                onClick(s.id);
              }}
              className="block w-full text-left text-[12px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors duration-200 py-0.5 truncate"
            >
              {s.summary || s.content.slice(0, 40)}
            </button>
          ))}
        </div>
      )}

      {/* AI trigger for idle items */}
      {isActive && isIdle && (
        <button
          onClick={() => onProcess(inspiration.id)}
          className="mt-3 text-[12px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors duration-300"
        >
          让 AI 理解这段灵感
        </button>
      )}

      {/* Error state */}
      {inspiration.ai_status === 'error' && (
        <div className="mt-2">
          <button
            onClick={() => onProcess(inspiration.id)}
            className="text-[11px] text-red-300 hover:text-red-400 transition-colors"
          >
            处理失败，点击重试
          </button>
        </div>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-3 mt-2">
        <time className="text-[11px] text-[var(--text-quaternary)]">{time}</time>

        <button
          onClick={() => {
            if (showDelete) { onDelete(inspiration.id); } else {
              setShowDelete(true);
              setTimeout(() => setShowDelete(false), 3000);
            }
          }}
          className={`
            text-[11px] transition-all duration-300 opacity-0 group-hover:opacity-100
            ${showDelete ? 'opacity-100 text-red-400' : 'text-[var(--text-quaternary)] hover:text-[var(--text-tertiary)]'}
          `}
        >
          {showDelete ? '确认删除' : '删除'}
        </button>
      </div>
    </div>
  );
}

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  return new Date(iso).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}
