import { useEffect, useRef, type RefObject } from 'react';

export function useAutoResize(): RefObject<HTMLTextAreaElement | null> {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const resize = () => {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    };

    el.addEventListener('input', resize);
    return () => el.removeEventListener('input', resize);
  }, []);

  return ref;
}
