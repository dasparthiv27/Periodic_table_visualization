import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import './IconButton.css';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: 'default' | 'primary' | 'danger' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  'aria-label': ariaLabel,
  variant = 'default',
  size = 'md',
  icon,
  children,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(
        'icon-btn',
        `icon-btn--${variant}`,
        size !== 'md' && `icon-btn--${size}`,
        className
      )}
      {...props}
    >
      {icon || children}
    </button>
  );
};
