import React from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.blue[600]};
        }
        &:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
        }
      `;
    case 'secondary':
      return css`
        background-color: ${({ theme }) => theme.colors.secondary};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.green[600]};
        }
        &:focus {
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.5);
        }
      `;
    case 'accent':
      return css`
        background-color: ${({ theme }) => theme.colors.accent};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.red[600]};
        }
        &:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5);
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.text};
        border: 1px solid ${({ theme }) => theme.colors.gray[300]};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.gray[100]};
        }
        &:focus {
          box-shadow: 0 0 0 3px rgba(209, 213, 219, 0.5);
        }
      `;
    default:
      return '';
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
        font-size: ${({ theme }) => theme.fontSizes.sm};
      `;
    case 'lg':
      return css`
        padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
        font-size: ${({ theme }) => theme.fontSizes.lg};
      `;
    case 'md':
    default:
      return css`
        padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
        font-size: ${({ theme }) => theme.fontSizes.base};
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  outline: none;
  
  ${({ variant = 'primary' }) => getVariantStyles(variant)}
  ${({ size = 'md' }) => getSizeStyles(size)}
  ${({ fullWidth }) => fullWidth && css`width: 100%;`}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .left-icon {
    margin-right: ${({ theme }) => theme.spacing[2]};
  }
  
  .right-icon {
    margin-left: ${({ theme }) => theme.spacing[2]};
  }
  
  .loading-spinner {
    margin-right: ${({ theme }) => theme.spacing[2]};
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
    <path 
      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeDasharray="1, 5"
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
  ...props 
}) => {
  return (
    <StyledButton 
      variant={variant} 
      size={size} 
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
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