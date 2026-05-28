import { useCallback, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonShape = 'default' | 'circle';

interface ButtonStyleProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  fullWidth?: boolean;
  className?: string;
}

interface ButtonProps extends ButtonStyleProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {}

interface ButtonLinkProps extends ButtonStyleProps, Omit<LinkProps, 'children'> {
  disabled?: boolean;
}

function getButtonClassName({
  variant,
  size,
  shape,
  fullWidth,
  disabled,
  className,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  shape: ButtonShape;
  fullWidth: boolean;
  disabled?: boolean;
  className?: string;
}): string {
  return [
    styles.button,
    styles[variant],
    styles[size],
    shape === 'circle' ? styles.circle : '',
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
    className ?? '',
  ].filter(Boolean).join(' ');
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  shape = 'default',
  fullWidth = false,
  className,
  type = 'button',
  disabled,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      {...buttonProps}
      type={type}
      disabled={disabled}
      className={getButtonClassName({ variant, size, shape, fullWidth, disabled, className })}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  variant = 'primary',
  size = 'medium',
  shape = 'default',
  fullWidth = false,
  className,
  disabled = false,
  onClick,
  ...linkProps
}: ButtonLinkProps) {
  const handleClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  }, [disabled, onClick]);

  const ariaProps: AnchorHTMLAttributes<HTMLAnchorElement> = disabled
    ? { 'aria-disabled': true, tabIndex: -1 }
    : {};

  return (
    <Link
      {...linkProps}
      {...ariaProps}
      onClick={handleClick}
      className={getButtonClassName({ variant, size, shape, fullWidth, disabled, className })}
    >
      {children}
    </Link>
  );
}
