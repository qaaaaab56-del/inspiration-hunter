interface AISummaryProps {
  text: string;
  compact?: boolean;
}

export function AISummary({ text, compact }: AISummaryProps) {
  return (
    <div className={`${compact ? '' : 'mt-2'}`}>
      <p
        className={`
          text-stone-400 italic leading-relaxed
          ${compact ? 'text-[12px] line-clamp-2' : 'text-[13px]'}
        `}
      >
        {text}
      </p>
    </div>
  );
}
