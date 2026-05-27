interface AIKeywordsProps {
  keywords: string[];
}

export function AIKeywords({ keywords }: AIKeywordsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {keywords.map((kw) => (
        <span
          key={kw}
          className="inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100"
        >
          {kw}
        </span>
      ))}
    </div>
  );
}
