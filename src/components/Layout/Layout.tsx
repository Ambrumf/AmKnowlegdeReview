import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

/** 应用主布局：左侧导航 + 右侧内容 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-surface">
      {children}
    </div>
  );
}
