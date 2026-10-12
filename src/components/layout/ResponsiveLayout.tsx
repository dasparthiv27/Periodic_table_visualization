import React from 'react';
import './ResponsiveLayout.css';

export interface ResponsiveLayoutProps {
  leftSidebar?: React.ReactNode;
  mainContent: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  leftSidebar,
  mainContent,
  rightSidebar,
}) => {
  return (
    <main className="container responsive-layout">
      {leftSidebar && <aside className="layout-left">{leftSidebar}</aside>}
      <section className="layout-center">{mainContent}</section>
      {rightSidebar && <aside className="layout-right">{rightSidebar}</aside>}
    </main>
  );
};
