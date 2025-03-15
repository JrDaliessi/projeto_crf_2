import React from 'react';
import styled, { css, keyframes } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'outline' | 'text';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: boolean;
  rounded?: boolean;
}

const getVariantColor = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary': return 'var(--color-primary)';
    case 'secondary': return 'var(--color-secondary)';
    case 'success': return 'var(--color-success)';
    case 'danger': return 'var(--color-error)';
    case 'warning': return 'var(--color-warning)';
    case 'info': return 'var(--color-info)';
    case 'light': return '#f8f9fa';
    case 'dark': return '#212529';
    case 'outline': 
    case 'text': 
    default: return 'var(--color-primary)';
  }
};

const getHoverColor = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary': return '#2563eb';
    case 'secondary': return '#059669';
    case 'success': return '#059669';
    case 'danger': return '#dc2626';
    case 'warning': return '#d97706';
    case 'info': return '#2563eb';
    case 'light': return '#e9ecef';
    case 'dark': return '#343a40';
    case 'outline': 
    case 'text': 
    default: return 'rgba(59, 130, 246, 0.1)';
  }
};

const getVariantStyles = (variant: ButtonVariant) => {
  const baseColor = getVariantColor(variant);
  const hoverColor = getHoverColor(variant);
  
  if (variant === 'outline') {
    return css`
      background-color: transparent;
      color: ${baseColor};
      border: 1px solid ${baseColor};
      
      &:hover:not(:disabled):not(.disabled) {
        background-color: ${hoverColor};
        color: ${['light', 'warning'].includes(variant) ? '#212529' : 'white'};
      }
    `;
  }
  
  if (variant === 'text') {
    return css`
      background-color: transparent;
      color: ${baseColor};
      border: none;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      
      &:hover:not(:disabled):not(.disabled) {
        background-color: ${hoverColor};
      }
    `;
  }
  
  return css`
    background-color: ${baseColor};
    color: ${['light', 'warning'].includes(variant) ? '#212529' : 'white'};
    border: 1px solid ${baseColor};
    
    &:hover:not(:disabled):not(.disabled) {
      background-color: ${hoverColor};
      border-color: ${hoverColor};
    }
  `;
};

const getSizeStyles = (size: ButtonSize, iconOnly: boolean = false) => {
  if (iconOnly) {
    switch (size) {
      case 'xs': return css`
        height: 1.5rem;
        width: 1.5rem;
        padding: 0;
        font-size: 0.75rem;
      `;
      case 'sm': return css`
        height: 2rem;
        width: 2rem;
        padding: 0;
        font-size: 0.875rem;
      `;
      case 'lg': return css`
        height: 3rem;
        width: 3rem;
        padding: 0;
        font-size: 1.25rem;
      `;
      case 'md':
      default: return css`
        height: 2.5rem;
        width: 2.5rem;
        padding: 0;
        font-size: 1rem;
      `;
    }
  }
  
  switch (size) {
    case 'xs': return css`
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      height: 1.5rem;
    `;
    case 'sm': return css`
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
      height: 2rem;
    `;
    case 'lg': return css`
      padding: 0.75rem 1.5rem;
      font-size: 1.125rem;
      height: 3rem;
    `;
    case 'md':
    default: return css`
      padding: 0.5rem 1rem;
      font-size: 1rem;
      height: 2.5rem;
    `;
  }
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const ripple = keyframes`
  to {
    transform: scale(4);
    opacity: 0;
  }
`;

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.rounded ? '9999px' : '0.375rem'};
  font-weight: 500;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  outline: none;
  position: relative;
  overflow: hidden;
  line-height: 1;
  white-space: nowrap;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  text-decoration: none;

  ${props => getVariantStyles(props.variant || 'primary')}
  ${props => getSizeStyles(props.size || 'md', props.iconOnly)}

  &:disabled, &.disabled {
    opacity: 0.65;
    cursor: not-allowed;
    pointer-events: none;
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ${ripple} 0.6s linear;
    background-color: rgba(255, 255, 255, 0.7);
  }

  svg {
    width: ${props => {
      switch (props.size) {
        case 'xs': return '0.75rem';
        case 'sm': return '0.875rem';
        case 'lg': return '1.25rem';
        case 'md':
        default: return '1rem';
      }
    }};
    height: ${props => {
      switch (props.size) {
        case 'xs': return '0.75rem';
        case 'sm': return '0.875rem';
        case 'lg': return '1.25rem';
        case 'md':
        default: return '1rem';
      }
    }};
  }

  ${props => !props.iconOnly && props.leftIcon && css`
    svg:first-child {
      margin-right: 0.5rem;
    }
  `}

  ${props => !props.iconOnly && props.rightIcon && css`
    svg:last-child {
      margin-left: 0.5rem;
    }
  `}
`;

const Spinner = styled.span`
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 0.15em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
  margin-right: 0.5rem;
  opacity: 0.7;
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  rounded = false,
  disabled,
  onClick,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick && !isLoading && !disabled) {
      // Adicionar efeito de ripple
      const button = e.currentTarget;
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
      circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
      circle.classList.add('ripple');

      const ripple = button.getElementsByClassName('ripple')[0];
      if (ripple) {
        ripple.remove();
      }

      button.appendChild(circle);
      onClick(e);
    }
  };

  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      iconOnly={iconOnly}
      rounded={rounded}
      onClick={handleClick}
      {...rest}
    >
      {isLoading && <Spinner />}
      {!isLoading && leftIcon && leftIcon}
      {!iconOnly && children}
      {!isLoading && rightIcon && rightIcon}
    </StyledButton>
  );
};

export default Button; 