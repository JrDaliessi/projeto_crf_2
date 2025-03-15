import React from 'react';
import styled, { css } from 'styled-components';

type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled' | 'accent';

interface CardProps {
  variant?: CardVariant;
  padding?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const getVariantStyles = (variant: CardVariant) => {
  switch (variant) {
    case 'outlined':
      return css`
        border: 1px solid var(--color-border);
        background-color: white;
      `;
    case 'elevated':
      return css`
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background-color: white;
      `;
    case 'filled':
      return css`
        background-color: var(--color-background);
      `;
    case 'accent':
      return css`
        border-left: 4px solid var(--color-primary);
        background-color: white;
      `;
    case 'default':
    default:
      return css`
        background-color: white;
        border: 1px solid var(--color-border);
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      `;
  }
};

const StyledCard = styled.div<Omit<CardProps, 'children' | 'title' | 'subtitle' | 'action'>>`
  border-radius: 0.5rem;
  padding: ${({ padding }) => padding || '1.5rem'};
  transition: all 0.2s ease;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  ${({ variant = 'default' }) => getVariantStyles(variant)}
  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      &:active {
        transform: translateY(-1px);
      }
    `}
`;

const InternalCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CardTitleBlock = styled.div`
  flex: 1;
`;

const CardTitleText = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  margin-bottom: 0.25rem;
`;

const CardSubtitleText = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin: 0;
`;

const CardActionArea = styled.div`
  margin-left: 1rem;
`;

const CardContent = styled.div``;

const InternalCardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
`;

// Componentes exportados para uso composicional
export const CardHeader = styled.div`
  margin-bottom: 1rem;
`;

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  margin-bottom: 0.25rem;
`;

export const CardSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin: 0;
`;

export const CardBody = styled.div``;

export const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
`;

const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  padding, 
  onClick, 
  className, 
  fullWidth = false,
  title,
  subtitle,
  action,
}) => {
  const hasHeader = title || subtitle || action;

  return (
    <StyledCard 
      variant={variant} 
      padding={hasHeader || padding ? padding : undefined}
      onClick={onClick}
      className={className}
      fullWidth={fullWidth}
    >
      {hasHeader && (
        <InternalCardHeader>
          <CardTitleBlock>
            {title && <CardTitleText>{title}</CardTitleText>}
            {subtitle && <CardSubtitleText>{subtitle}</CardSubtitleText>}
          </CardTitleBlock>
          {action && <CardActionArea>{action}</CardActionArea>}
        </InternalCardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </StyledCard>
  );
};

Card.displayName = 'Card';

export default Card; 