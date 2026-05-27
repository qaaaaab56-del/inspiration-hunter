import type { ReactNode } from 'react';
import { Header } from './Header';

interface AppShellProps {
  children: ReactNode;
  header?: ReactNode;
  showInstall?: boolean;
  onInstall?: () => void;
}

export function AppShell({ children, header, showInstall, onInstall }: AppShellProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-stone-50">
      {header || <Header showInstall={!!showInstall} onInstall={onInstall} />}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-24">
        {children}
      </main>
    </div>
  );
}
