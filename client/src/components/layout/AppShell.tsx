import type { ReactNode } from 'react';

interface AppShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <div className="flex h-dvh bg-white overflow-hidden">
      {sidebar}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto px-6 pb-32">
          {children}
        </div>
      </main>
    </div>
  );
}
