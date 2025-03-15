import React from 'react';
import styled, { css } from 'styled-components';

type CardVariant = 'default' | 'outlined' | 'elevated';

interface CardProps {
  variant?: CardVariant;
  padding?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const getVariantStyles = (variant: CardVariant) => {
  switch (variant) {
    case 'outlined':
      return css`
        border: 1px solid ${({ theme }) => theme.colors.gray[200]};
        background-color: transparent;
      `;
    case 'elevated':
      return css`
        box-shadow: ${({ theme }) => theme.shadows.md};
        background-color: white;
      `;
    case 'default':
    default:
      return css`
        background-color: white;
        box-shadow: ${({ theme }) => theme.shadows.sm};
      `;
  }
};

const StyledCard = styled.div<Omit<CardProps, 'children'>>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ padding, theme }) => padding || theme.spacing[6]};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  ${({ variant = 'default' }) => getVariantStyles(variant)}
  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
      &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.md};
      }
    `}
`;

const CardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const CardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
`;

const CardBody = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Subtitle: typeof CardSubtitle;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
} = ({ children, variant = 'default', padding, onClick, className }) => {
  return (
    <StyledCard 
      variant={variant} 
      padding={padding} 
      onClick={onClick}
      className={className}
    >
      {children}
    </StyledCard>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card; 