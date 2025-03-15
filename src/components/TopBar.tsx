import React from 'react';
import styled from 'styled-components';
import { FiMenu, FiBell, FiSearch, FiHelpCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface TopBarProps {
  onToggleMenu: () => void;
}

const TopBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--topbar-height);
  padding: 0 var(--spacing-6);
  background-color: var(--color-topbar);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: var(--shadow-sm);
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: none;
  background-color: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color var(--transition-fast) ease;
  
  &:hover {
    background-color: var(--color-background);
  }
  
  @media (min-width: 1024px) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-left: var(--spacing-4);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 300px;
  height: 40px;
  padding: 0 var(--spacing-4) 0 var(--spacing-10);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 0.875rem;
  transition: all var(--transition-fast) ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
  }
  
  &::placeholder {
    color: var(--color-text-light);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: var(--spacing-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: none;
  background-color: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color var(--transition-fast) ease;
  position: relative;
  margin-left: var(--spacing-1);
  
  &:hover {
    background-color: var(--color-background);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: var(--color-error);
`;

const TopBar: React.FC<TopBarProps> = ({ onToggleMenu }) => {
  const { user } = useAuth();
  
  return (
    <TopBarContainer>
      <TopBarLeft>
        <MenuButton onClick={onToggleMenu} aria-label="Toggle menu">
          <FiMenu size={20} />
        </MenuButton>
        
        <SearchContainer>
          <SearchIcon>
            <FiSearch size={16} />
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Buscar..." 
            aria-label="Buscar"
          />
        </SearchContainer>
      </TopBarLeft>
      
      <TopBarRight>
        <TopBarActions>
          <ActionButton aria-label="Ajuda">
            <FiHelpCircle size={20} />
          </ActionButton>
          
          <ActionButton aria-label="Notificações">
            <FiBell size={20} />
            <NotificationBadge />
          </ActionButton>
        </TopBarActions>
      </TopBarRight>
    </TopBarContainer>
  );
};

export default TopBar; 