import React from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rounded?: boolean;
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.blue[600]};
          transform: translateY(-1px);
        }
        &:active:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.blue[700]};
          transform: translateY(0);
        }
        &:focus-visible {
          box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.blue[200]};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${({ theme }) => theme.colors.secondary};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.green[600]};
          transform: translateY(-1px);
        }
        &:active:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.green[700]};
          transform: translateY(0);
        }
        &:focus-visible {
          box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.green[200]};
        }
      `;
    case 'accent':
      return css`
        background-color: ${({ theme }) => theme.colors.accent};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.red[600]};
          transform: translateY(-1px);
        }
        &:active:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.red[700]};
          transform: translateY(0);
        }
        &:focus-visible {
          box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.red[200]};
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.text};
        border: 1px solid ${({ theme }) => theme.colors.border};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.gray[100]};
          border-color: ${({ theme }) => theme.colors.gray[400]};
        }
        &:active:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.gray[200]};
        }
        &:focus-visible {
          box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.gray[200]};
        }
      `;
    case 'ghost':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.text};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.gray[100]};
        }
        &:active:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.gray[200]};
        }
        &:focus-visible {
          box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.gray[200]};
        }
      `;
    case 'link':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.primary};
        padding: 0;
        height: auto;
        font-weight: ${({ theme }) => theme.fontWeights.medium};
        &:hover:not(:disabled) {
          text-decoration: underline;
        }
        &:focus-visible {
          box-shadow: none;
          text-decoration: underline;
        }
      `;
    default:
      return '';
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'xs':
      return css`
        height: 1.5rem;
        padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
        font-size: ${({ theme }) => theme.fontSizes.xs};
        
        .left-icon, .right-icon {
          width: 0.75rem;
          height: 0.75rem;
        }
      `;
    case 'sm':
      return css`
        height: 2rem;
        padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
        font-size: ${({ theme }) => theme.fontSizes.sm};
        
        .left-icon, .right-icon {
          width: 0.875rem;
          height: 0.875rem;
        }
      `;
    case 'lg':
      return css`
        height: 3rem;
        padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[5]}`};
        font-size: ${({ theme }) => theme.fontSizes.lg};
        
        .left-icon, .right-icon {
          width: 1.25rem;
          height: 1.25rem;
        }
      `;
    case 'xl':
      return css`
        height: 3.5rem;
        padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
        font-size: ${({ theme }) => theme.fontSizes.xl};
        
        .left-icon, .right-icon {
          width: 1.5rem;
          height: 1.5rem;
        }
      `;
    case 'md':
    default:
      return css`
        height: 2.5rem;
        padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
        font-size: ${({ theme }) => theme.fontSizes.base};
        
        .left-icon, .right-icon {
          width: 1rem;
          height: 1rem;
        }
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme, rounded }) => rounded ? theme.borderRadius.full : theme.borderRadius.DEFAULT};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  outline: none;
  position: relative;
  overflow: hidden;
  
  ${({ variant = 'primary' }) => getVariantStyles(variant)}
  ${({ size = 'md' }) => getSizeStyles(size)}
  ${({ fullWidth }) => fullWidth && css`width: 100%;`}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  &:after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform 0.3s, opacity 0.5s;
  }
  
  &:active:after {
    transform: scale(0, 0);
    opacity: 0.3;
    transition: 0s;
  }
  
  .left-icon {
    margin-right: ${({ theme }) => theme.spacing[2]};
    display: inline-flex;
  }
  
  .right-icon {
    margin-left: ${({ theme }) => theme.spacing[2]};
    display: inline-flex;
  }
  
  .loading-spinner {
    margin-right: ${({ theme, children }) => children ? theme.spacing[2] : 0};
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingSpinner = () => (
  <svg 
    className="loading-spinner" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeDasharray="30 30" 
      strokeDashoffset="0" 
    />
    <path 
      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      opacity="0.3"
    />
  </svg>
);

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  rounded = false,
  ...props 
}) => {
  return (
    <StyledButton 
      variant={variant} 
      size={size} 
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      rounded={rounded}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {!isLoading && leftIcon && <span className="left-icon">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="right-icon">{rightIcon}</span>}
    </StyledButton>
  );
};

export default Button; 