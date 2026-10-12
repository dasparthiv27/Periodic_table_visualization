import React from 'react';
import { cn } from '../../lib/utils';
import './Panel.css';

export interface PanelProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'glow';
  flush?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  subtitle,
  icon,
  actions,
  footer,
  variant = 'default',
  flush = false,
  className,
  children,
}) => {
  const hasHeader = Boolean(title || icon || actions);

  return (
    <section
      className={cn(
        'panel-card',
        variant === 'glow' && 'panel-card--glow',
        className
      )}
    >
      {hasHeader && (
        <header className="panel-header">
          <div className="panel-header-left">
            {icon && <div className="panel-icon-wrap">{icon}</div>}
            {(title || subtitle) && (
              <div className="panel-title-group">
                {title && <h2 className="panel-title">{title}</h2>}
                {subtitle && <span className="panel-subtitle">{subtitle}</span>}
              </div>
            )}
          </div>
          {actions && <div className="panel-actions">{actions}</div>}
        </header>
      )}

      <div className={cn('panel-content', flush && 'panel-content--flush')}>
        {children}
      </div>

      {footer && <footer className="panel-footer">{footer}</footer>}
    </section>
  );
};
