import type { Inspiration } from '../../types';
import { AIExtend } from '../ai/AIExtend';

interface InspirationDetailProps {
  inspiration: Inspiration;
  onProcess: (id: string) => void;
}

export function InspirationDetail({ inspiration, onProcess }: InspirationDetailProps) {
  const isProcessing = inspiration.ai_status === 'processing';
  const isProcessed = inspiration.ai_status === 'done';
  const isIdle = inspiration.ai_status === 'idle';

  return (
    <div className="px-5 pb-5 border-t border-stone-50 animate-slide-up">
      {/* Full content */}
      <div className="pt-4">
        <h4 className="text-[10px] uppercase tracking-wider text-stone-300 mb-2">原始内容</h4>
        <p className="text-[15px] text-stone-700 leading-relaxed whitespace-pre-wrap">
          {inspiration.content}
        </p>
      </div>

      {/* Time metadata */}
      <div className="mt-4 text-[11px] text-stone-300">
        记录于 {new Date(inspiration.created_at).toLocaleString('zh-CN')}
      </div>

      {/* AI processing section */}
      {isProcessed && inspiration.extended_thoughts && (
        <div className="mt-5">
          <AIExtend thoughts={inspiration.extended_thoughts} />
        </div>
      )}

      {isProcessing && (
        <div className="mt-5 flex items-center gap-3 p-4 bg-amber-50 rounded-xl">
          <span className="inline-block w-3 h-3 rounded-full bg-amber-400 animate-pulse-soft" />
          <span className="text-[13px] text-amber-600">AI 正在分析这段灵感的深层含义...</span>
        </div>
      )}

      {isIdle && (
        <button
          onClick={() => onProcess(inspiration.id)}
          className="mt-5 w-full text-center text-[13px] text-amber-500 hover:text-amber-600 transition-colors py-3 rounded-xl border border-dashed border-amber-200 hover:border-amber-300 hover:bg-amber-50/50"
        >
          让 AI 理解这段灵感
        </button>
      )}

      {inspiration.ai_status === 'error' && (
        <div className="mt-5 p-4 bg-red-50 rounded-xl">
          <p className="text-[13px] text-red-400">
            AI 处理遇到问题
            <button
              onClick={() => onProcess(inspiration.id)}
              className="ml-2 underline hover:text-red-500"
            >
              重试
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
