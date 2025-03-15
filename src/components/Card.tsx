import React from 'react';
import styled, { css } from 'styled-components';

type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled' | 'subtle';

interface CardProps {
  variant?: CardVariant;
  padding?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
  hoverEffect?: boolean;
  borderAccent?: boolean;
}

const getVariantStyles = (variant: CardVariant) => {
  switch (variant) {
    case 'outlined':
      return css`
        border: 1px solid ${({ theme }) => theme.colors.border};
        background-color: ${({ theme }) => theme.colors.backgroundAlt};
      `;
    case 'elevated':
      return css`
        box-shadow: ${({ theme }) => theme.shadows.md};
        background-color: ${({ theme }) => theme.colors.backgroundAlt};
      `;
    case 'filled':
      return css`
        background-color: ${({ theme }) => theme.colors.gray[100]};
      `;
    case 'subtle':
      return css`
        background-color: ${({ theme }) => theme.colors.gray[50]};
        border: 1px solid ${({ theme }) => theme.colors.gray[100]};
      `;
    case 'default':
    default:
      return css`
        background-color: ${({ theme }) => theme.colors.backgroundAlt};
        box-shadow: ${({ theme }) => theme.shadows.sm};
      `;
  }
};

const StyledCard = styled.div<Omit<CardProps, 'children'>>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ padding, theme }) => padding || theme.spacing[6]};
  transition: all ${({ theme }) => theme.transitions.default};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  position: relative;
  overflow: hidden;
  
  ${({ variant = 'default' }) => getVariantStyles(variant)}
  
  ${({ borderAccent }) =>
    borderAccent &&
    css`
      border-top: 3px solid ${({ theme }) => theme.colors.primary};
    `}
  
  ${({ hoverEffect, onClick }) =>
    (hoverEffect || onClick) &&
    css`
      cursor: ${onClick ? 'pointer' : 'default'};
      &:hover {
        transform: translateY(-3px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
      }
      &:active {
        transform: translateY(-1px);
      }
    `}
`;

const CardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  line-height: 1.2;
`;

const CardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
  line-height: 1.5;
`;

const CardBody = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.text};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding-top: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[100]};
`;

const CardDivider = styled.hr`
  border: 0;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray[200]};
  margin: ${({ theme }) => `${theme.spacing[4]} 0`};
`;

const CardImage = styled.div<{ src?: string }>`
  width: calc(100% + ${({ theme }) => theme.spacing[12]});
  margin: -${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  height: 200px;
  background-image: ${({ src }) => (src ? `url(${src})` : 'none')};
  background-size: cover;
  background-position: center;
  border-top-left-radius: ${({ theme }) => theme.borderRadius.lg};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Subtitle: typeof CardSubtitle;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
  Divider: typeof CardDivider;
  Image: typeof CardImage;
} = ({ 
  children, 
  variant = 'default', 
  padding, 
  onClick, 
  className,
  fullWidth = false,
  hoverEffect = false,
  borderAccent = false,
}) => {
  return (
    <StyledCard 
      variant={variant} 
      padding={padding} 
      onClick={onClick}
      className={className}
      fullWidth={fullWidth}
      hoverEffect={hoverEffect}
      borderAccent={borderAccent}
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
Card.Divider = CardDivider;
Card.Image = CardImage;

export default Card; 