interface HeaderProps {
  onInstall?: () => void;
  showInstall: boolean;
}

export function Header({ onInstall, showInstall }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-stone-50/80 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium tracking-wide text-stone-700">
            灵感猎人
          </span>
          <span className="text-[10px] text-stone-300 font-mono">MVP</span>
        </div>
        {showInstall && (
          <button
            onClick={onInstall}
            className="text-xs text-amber-600 hover:text-amber-700 transition-colors px-3 py-1 rounded-full border border-amber-200 hover:border-amber-300 hover:bg-amber-50"
          >
            安装应用
          </button>
        )}
      </div>
    </header>
  );
}
