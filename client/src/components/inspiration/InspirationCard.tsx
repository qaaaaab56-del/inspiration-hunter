import { useState } from 'react';
import type { Inspiration } from '../../types';
import { AIKeywords } from '../ai/AIKeywords';
import { AISummary } from '../ai/AISummary';
import { AIExtend } from '../ai/AIExtend';
import { InspirationDetail } from './InspirationDetail';

interface InspirationCardProps {
  inspiration: Inspiration;
  onDelete: (id: string) => void;
  onProcess: (id: string) => void;
}

export function InspirationCard({ inspiration, onDelete, onProcess }: InspirationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const time = formatRelativeTime(inspiration.created_at);
  const isProcessed = inspiration.ai_status === 'done';
  const isProcessing = inspiration.ai_status === 'processing';

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(inspiration.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <article
      className={`
        bg-white rounded-xl border border-stone-100 shadow-sm
        transition-all duration-300 animate-slide-up
        ${isExpanded ? 'shadow-md' : 'hover:shadow-md'}
      `}
    >
      {/* Main card body */}
      <div
        className="px-5 py-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Title or first line */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {inspiration.title ? (
              <h3 className="text-[15px] font-medium text-stone-800 leading-snug">
                {inspiration.title}
              </h3>
            ) : (
              <p className="text-[15px] text-stone-700 leading-relaxed line-clamp-2">
                {inspiration.content}
              </p>
            )}

            {inspiration.title && (
              <p className="text-[13px] text-stone-500 mt-1 line-clamp-1">
                {inspiration.content}
              </p>
            )}
          </div>

          <time className="text-[11px] text-stone-300 whitespace-nowrap shrink-0 mt-0.5">
            {time}
          </time>
        </div>

        {/* AI summary preview */}
        {isProcessed && inspiration.summary && (
          <div className="mt-3">
            <AISummary text={inspiration.summary} compact />
          </div>
        )}

        {/* Keywords */}
        {isProcessed && inspiration.keywords && inspiration.keywords.length > 0 && (
          <div className="mt-3">
            <AIKeywords keywords={inspiration.keywords} />
          </div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="mt-3 flex items-center gap-2 text-[12px] text-amber-500">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse-soft" />
            AI 正在理解这段灵感...
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-stone-50">
          {!isProcessed && !isProcessing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onProcess(inspiration.id);
              }}
              className="text-[11px] text-amber-500 hover:text-amber-600 transition-colors px-2 py-0.5 rounded-full hover:bg-amber-50"
            >
              AI 理解
            </button>
          )}

          {isProcessed && (
            <span className="text-[11px] text-stone-300 px-2">
              AI 已理解
            </span>
          )}

          <div className="flex-1" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className={`
              text-[11px] transition-colors px-2 py-0.5 rounded-full
              ${showDeleteConfirm
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-stone-300 hover:text-stone-400 hover:bg-stone-50'
              }
            `}
          >
            {showDeleteConfirm ? '确认删除' : '删除'}
          </button>
        </div>
      </div>

      {/* Expanded detail panel */}
      {isExpanded && (
        <InspirationDetail
          inspiration={inspiration}
          onProcess={onProcess}
        />
      )}
    </article>
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

  return new Date(iso).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
}
