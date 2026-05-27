import { useState, useCallback } from 'react';
import { useAutoResize } from '../../hooks/useAutoResize';
import { useInspirationStore } from '../../store/useInspirationStore';

export function QuickInput() {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useAutoResize();
  const { addInspiration, isSubmitting } = useInspirationStore();

  const handleSubmit = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;

    try {
      await addInspiration(trimmed);
      setContent('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch {
      // Silently fail — keep content in input
    }
  }, [content, isSubmitting, addInspiration, textareaRef]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="relative">
      <div
        className={`
          relative bg-white rounded-2xl border transition-all duration-300
          ${isFocused ? 'border-amber-300 shadow-lg shadow-amber-50' : 'border-stone-200 shadow-sm'}
        `}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="记录此刻的想法..."
          rows={1}
          maxLength={2000}
          className="w-full px-5 py-4 text-[15px] leading-relaxed bg-transparent resize-none outline-none placeholder:text-stone-300 text-stone-700"
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-4 pb-3">
          <span className="text-[11px] text-stone-300 select-none">
            {content.length > 0 && `${content.length}/2000`}
            {content.length === 0 && 'Enter 发送 · Shift+Enter 换行'}
          </span>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className={`
              text-xs px-4 py-1.5 rounded-full font-medium transition-all duration-200
              ${content.trim() && !isSubmitting
                ? 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
                : 'bg-stone-100 text-stone-300 cursor-not-allowed'
              }
            `}
          >
            {isSubmitting ? '记录中...' : '记录'}
          </button>
        </div>
      </div>

      {/* Subtle hint text */}
      {!isFocused && !content && (
        <p className="text-center text-[11px] text-stone-300 mt-3 select-none">
          灵感稍纵即逝，不必完整，半句话也可以
        </p>
      )}
    </div>
  );
}
