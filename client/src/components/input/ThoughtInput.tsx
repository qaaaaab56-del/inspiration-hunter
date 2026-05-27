import { useState, useCallback, useRef, useEffect } from 'react';
import { useInspirationStore } from '../../store/useInspirationStore';

interface ThoughtInputProps {
  autoFocus?: boolean;
}

export function ThoughtInput({ autoFocus }: ThoughtInputProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addInspiration, isSubmitting } = useInspirationStore();

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 240) + 'px';
  }, [content]);

  const handleSubmit = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;
    try {
      await addInspiration(trimmed);
      setContent('');
    } catch {
      // keep content on failure
    }
  }, [content, isSubmitting, addInspiration]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const showCounter = content.length > 500;
  const showSubmit = content.trim().length > 0;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={`
          relative bg-white rounded-3xl transition-all duration-500 ease-out
          ${isFocused
            ? 'shadow-md shadow-black/[0.04]'
            : 'shadow-sm shadow-black/[0.02]'
          }
          border border-[var(--border-subtle)]
          ${isFocused ? 'border-[var(--border-default)]' : ''}
        `}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="此刻在想什么？"
          rows={1}
          maxLength={2000}
          className="w-full px-6 py-5 text-[16px] leading-relaxed bg-transparent resize-none outline-none placeholder:text-[var(--text-quaternary)] text-[var(--text-primary)]"
        />

        {/* Bottom hint bar */}
        <div className="flex items-center justify-between px-5 pb-3">
          <span
            className={`
              text-[11px] transition-opacity duration-300
              ${showCounter ? 'opacity-100' : 'opacity-0'}
              text-[var(--text-quaternary)]
            `}
          >
            {content.length}/2000
          </span>
          <span
            className={`
              text-[11px] transition-all duration-300
              ${showSubmit ? 'opacity-0' : 'opacity-100'}
              text-[var(--text-quaternary)]
              ${showCounter ? '' : 'ml-auto'}
            `}
          >
            Enter 发送 · Shift+Enter 换行
          </span>
          {showSubmit && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="ml-auto text-[13px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-300 disabled:opacity-30"
            >
              {isSubmitting ? '...' : '记录'}
            </button>
          )}
        </div>
      </div>

      {/* Whisper hint */}
      {!isFocused && !content && (
        <p className="text-center text-[12px] text-[var(--text-quaternary)] mt-4 select-none transition-opacity duration-500">
          灵感稍纵即逝，半句话也可以
        </p>
      )}
    </div>
  );
}
