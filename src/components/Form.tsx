import React, { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import styled from 'styled-components';
import { FiAlertCircle } from 'react-icons/fi';

// Tipos compartilhados
interface FormControlProps {
  error?: string;
  label?: string;
  required?: boolean;
  helperText?: string;
}

// Componentes estilizados
const FormGroup = styled.div`
  margin-bottom: var(--spacing-4);
`;

const Label = styled.label<{ disabled?: boolean }>`
  display: block;
  margin-bottom: var(--spacing-2);
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.disabled ? 'var(--color-text-lighter)' : 'var(--color-text)'};
  
  span {
    color: var(--color-error);
    margin-left: var(--spacing-1);
  }
`;

// Usando o attrs para filtrar props customizadas antes de passá-las para o DOM
const StyledInput = styled.input.attrs<{ hasError?: boolean }>((props) => {
  const { hasError, ...rest } = props;
  return rest;
})<{ hasError?: boolean }>`
  display: block;
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  border: 1px solid ${props => props.hasError ? 'var(--color-error)' : 'var(--color-border)'};
  background-color: var(--color-card-background);
  color: var(--color-text);
  font-size: 0.875rem;
  transition: border-color var(--transition-fast) ease, box-shadow var(--transition-fast) ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? 'var(--color-error)' : 'var(--color-primary)'};
    box-shadow: 0 0 0 2px ${props => 
      props.hasError 
        ? 'rgba(var(--color-error-rgb), 0.2)' 
        : 'rgba(var(--color-primary-rgb), 0.2)'};
  }
  
  &::placeholder {
    color: var(--color-text-lighter);
  }
  
  &:disabled {
    cursor: not-allowed;
    background-color: rgba(0, 0, 0, 0.03);
    color: var(--color-text-lighter);
  }
`;

const StyledSelect = styled.select.attrs<{ hasError?: boolean }>((props) => {
  const { hasError, ...rest } = props;
  return rest;
})<{ hasError?: boolean }>`
  display: block;
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  border: 1px solid ${props => props.hasError ? 'var(--color-error)' : 'var(--color-border)'};
  background-color: var(--color-card-background);
  color: var(--color-text);
  font-size: 0.875rem;
  transition: border-color var(--transition-fast) ease, box-shadow var(--transition-fast) ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--spacing-3) center;
  background-size: 16px;
  padding-right: calc(var(--spacing-4) * 2);
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? 'var(--color-error)' : 'var(--color-primary)'};
    box-shadow: 0 0 0 2px ${props => 
      props.hasError 
        ? 'rgba(var(--color-error-rgb), 0.2)' 
        : 'rgba(var(--color-primary-rgb), 0.2)'};
  }
  
  &::placeholder {
    color: var(--color-text-lighter);
  }
  
  &:disabled {
    cursor: not-allowed;
    background-color: rgba(0, 0, 0, 0.03);
    color: var(--color-text-lighter);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  }
`;

const StyledTextarea = styled.textarea.attrs<{ hasError?: boolean }>((props) => {
  const { hasError, ...rest } = props;
  return rest;
})<{ hasError?: boolean }>`
  display: block;
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  border: 1px solid ${props => props.hasError ? 'var(--color-error)' : 'var(--color-border)'};
  background-color: var(--color-card-background);
  color: var(--color-text);
  font-size: 0.875rem;
  transition: border-color var(--transition-fast) ease, box-shadow var(--transition-fast) ease;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? 'var(--color-error)' : 'var(--color-primary)'};
    box-shadow: 0 0 0 2px ${props => 
      props.hasError 
        ? 'rgba(var(--color-error-rgb), 0.2)' 
        : 'rgba(var(--color-primary-rgb), 0.2)'};
  }
  
  &::placeholder {
    color: var(--color-text-lighter);
  }
  
  &:disabled {
    cursor: not-allowed;
    background-color: rgba(0, 0, 0, 0.03);
    color: var(--color-text-lighter);
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  color: var(--color-error);
  font-size: 0.75rem;
  margin-top: var(--spacing-1);
  
  svg {
    margin-right: var(--spacing-1);
    flex-shrink: 0;
  }
`;

const HelperText = styled.div`
  color: var(--color-text-light);
  font-size: 0.75rem;
  margin-top: var(--spacing-1);
`;

// Componentes de formulário
export const FormField = ({ children, ...props }: React.PropsWithChildren) => {
  return <FormGroup {...props}>{children}</FormGroup>;
};

export const Input = forwardRef<
  HTMLInputElement, 
  InputHTMLAttributes<HTMLInputElement> & FormControlProps
>(({ error, label, required, helperText, ...props }, ref) => {
  const id = props.id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <FormGroup>
      {label && (
        <Label htmlFor={id} disabled={props.disabled}>
          {label}
          {required && <span>*</span>}
        </Label>
      )}
      
      <StyledInput 
        ref={ref} 
        id={id} 
        hasError={!!error} 
        {...props} 
      />
      
      {error && (
        <ErrorMessage>
          <FiAlertCircle size={12} />
          {error}
        </ErrorMessage>
      )}
      
      {helperText && !error && (
        <HelperText>{helperText}</HelperText>
      )}
    </FormGroup>
  );
});

Input.displayName = 'Input';

export const Select = forwardRef<
  HTMLSelectElement, 
  SelectHTMLAttributes<HTMLSelectElement> & FormControlProps
>(({ error, label, required, helperText, children, ...props }, ref) => {
  const id = props.id || `select-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <FormGroup>
      {label && (
        <Label htmlFor={id} disabled={props.disabled}>
          {label}
          {required && <span>*</span>}
        </Label>
      )}
      
      <StyledSelect 
        ref={ref} 
        id={id} 
        hasError={!!error} 
        {...props}
      >
        {children}
      </StyledSelect>
      
      {error && (
        <ErrorMessage>
          <FiAlertCircle size={12} />
          {error}
        </ErrorMessage>
      )}
      
      {helperText && !error && (
        <HelperText>{helperText}</HelperText>
      )}
    </FormGroup>
  );
});

Select.displayName = 'Select';

export const Textarea = forwardRef<
  HTMLTextAreaElement, 
  TextareaHTMLAttributes<HTMLTextAreaElement> & FormControlProps
>(({ error, label, required, helperText, ...props }, ref) => {
  const id = props.id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <FormGroup>
      {label && (
        <Label htmlFor={id} disabled={props.disabled}>
          {label}
          {required && <span>*</span>}
        </Label>
      )}
      
      <StyledTextarea 
        ref={ref} 
        id={id} 
        hasError={!!error} 
        {...props} 
      />
      
      {error && (
        <ErrorMessage>
          <FiAlertCircle size={12} />
          {error}
        </ErrorMessage>
      )}
      
      {helperText && !error && (
        <HelperText>{helperText}</HelperText>
      )}
    </FormGroup>
  );
});

Textarea.displayName = 'Textarea';

const StyledForm = styled.form`
  width: 100%;
`;

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Form: React.FC<React.PropsWithChildren<FormProps>> = ({ 
  children, 
  onSubmit, 
  ...props 
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };
  
  return (
    <StyledForm {...props} onSubmit={handleSubmit}>
      {children}
    </StyledForm>
  );
};

export default { Form, FormField, Input, Select, Textarea }; 