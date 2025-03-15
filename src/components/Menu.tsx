import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiClipboard,
  FiSettings, 
  FiDollarSign, 
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiMenu
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

interface MenuProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isMobile: boolean;
  onClose?: () => void;
}

const MenuContainer = styled.div<{ isCollapsed: boolean; isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: ${props => props.isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)'};
  background-color: var(--color-sidebar);
  color: var(--color-text-inverted);
  transition: width var(--transition-normal) ease;
  overflow-x: hidden;
  position: relative;
  z-index: 20;
  
  ${props => props.isMobile && css`
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    box-shadow: var(--shadow-lg);
  `}
`;

const MenuHeader = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.isCollapsed ? 'center' : 'space-between'};
  padding: ${props => props.isCollapsed ? 'var(--spacing-4)' : 'var(--spacing-4) var(--spacing-6)'};
  height: var(--topbar-height);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  
  img {
    width: 32px;
    height: 32px;
  }
  
  span {
    font-size: 1.25rem;
    font-weight: 600;
    margin-left: var(--spacing-3);
    white-space: nowrap;
    display: ${props => props.isCollapsed ? 'none' : 'block'};
    transition: opacity var(--transition-normal) ease;
  }
`;

const CollapseButton = styled.button<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--color-text-inverted);
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-normal) ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4) 0;
`;

const MenuSection = styled.div<{ isCollapsed: boolean }>`
  padding: ${props => props.isCollapsed ? '0 var(--spacing-2)' : '0 var(--spacing-4)'};
  margin-bottom: var(--spacing-4);
  
  h3 {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: ${props => props.isCollapsed ? 'var(--spacing-2) 0' : 'var(--spacing-2) var(--spacing-3)'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: var(--spacing-2);
    visibility: ${props => props.isCollapsed ? 'hidden' : 'visible'};
    height: ${props => props.isCollapsed ? '0' : 'auto'};
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li<{ isActive: boolean; isCollapsed: boolean }>`
  margin-bottom: var(--spacing-1);
  
  a {
    display: flex;
    align-items: center;
    padding: ${props => props.isCollapsed 
      ? 'var(--spacing-3) 0' 
      : 'var(--spacing-3) var(--spacing-3)'};
    color: ${props => props.isActive ? 'var(--color-text-inverted)' : 'rgba(255, 255, 255, 0.7)'};
    text-decoration: none;
    border-radius: ${props => props.isCollapsed ? '0' : 'var(--radius-md)'};
    background-color: ${props => props.isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
    transition: all var(--transition-fast) ease;
    position: relative;
    overflow: hidden;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: var(--color-text-inverted);
    }
    
    ${props => props.isActive && css`
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 60%;
        background-color: var(--color-primary);
        border-radius: 0 var(--radius-full) var(--radius-full) 0;
      }
    `}
  }
  
  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin: ${props => props.isCollapsed ? '0 auto' : '0 var(--spacing-3) 0 0'};
  }
  
  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    opacity: ${props => props.isCollapsed ? 0 : 1};
    visibility: ${props => props.isCollapsed ? 'hidden' : 'visible'};
    transition: opacity var(--transition-normal) ease, visibility var(--transition-normal) ease;
    font-size: 0.875rem;
  }
`;

const MenuFooter = styled.div<{ isCollapsed: boolean }>`
  padding: var(--spacing-4) ${props => props.isCollapsed ? 'var(--spacing-2)' : 'var(--spacing-4)'};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled.div<{ isCollapsed: boolean }>`
  display: ${props => props.isCollapsed ? 'none' : 'flex'};
  align-items: center;
  margin-bottom: var(--spacing-3);
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  margin-right: var(--spacing-3);
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  overflow: hidden;
`;

const UserName = styled.div`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LogoutButton = styled.button<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  width: 100%;
  padding: var(--spacing-3) ${props => props.isCollapsed ? '0' : 'var(--spacing-3)'};
  background-color: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: var(--color-text-inverted);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  span {
    margin-left: var(--spacing-3);
    white-space: nowrap;
    display: ${props => props.isCollapsed ? 'none' : 'block'};
  }
`;

// Componente para um item do menu
const MenuItemComponent: React.FC<MenuItemProps> = ({ 
  to, 
  icon, 
  label, 
  isActive, 
  isCollapsed,
  onClick 
}) => {
  return (
    <MenuItem isActive={isActive} isCollapsed={isCollapsed}>
      <Link to={to} onClick={onClick}>
        {icon}
        <span>{label}</span>
      </Link>
    </MenuItem>
  );
};

// Componente principal do menu
const Menu: React.FC<MenuProps> = ({
  isCollapsed,
  toggleCollapse,
  isMobile,
  onClose
}) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Função para detectar rota ativa
  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Função para obter as iniciais do nome do usuário
  const getUserInitials = (name: string) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };
  
  // Função para lidar com o logout
  const handleLogout = () => {
    logout();
  };
  
  // Função para lidar com cliques em links no modo móvel
  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };
  
  // Determinar o papel do usuário para exibição
  const getUserRole = () => {
    if (!user || !user.roles) return 'Usuário';
    
    const roleMap: Record<string, string> = {
      'ADMIN': 'Administrador',
      'FUNCIONARIO': 'Funcionário',
      'MORADOR': 'Morador',
      'VISITANTE': 'Visitante'
    };
    
    return roleMap[user.roles.role_name] || 'Usuário';
  };
  
  return (
    <MenuContainer isCollapsed={isCollapsed} isMobile={isMobile}>
      <MenuHeader isCollapsed={isCollapsed}>
        <Logo isCollapsed={isCollapsed}>
          <img src="/logo.png" alt="Logo" />
          <span>CRF Sistema</span>
        </Logo>
        {!isMobile && (
          <CollapseButton 
            isCollapsed={isCollapsed} 
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </CollapseButton>
        )}
        {isMobile && onClose && (
          <CollapseButton 
            isCollapsed={false} 
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <FiMenu />
          </CollapseButton>
        )}
      </MenuHeader>
      
      <MenuContent>
        <MenuSection isCollapsed={isCollapsed}>
          <h3>Principal</h3>
          <MenuList>
            <MenuItemComponent
              to="/dashboard"
              icon={<FiHome />}
              label="Dashboard"
              isActive={isActiveRoute('/dashboard')}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
            <MenuItemComponent
              to="/usuarios"
              icon={<FiUsers />}
              label="Usuários"
              isActive={isActiveRoute('/usuarios')}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
            <MenuItemComponent
              to="/reservas"
              icon={<FiCalendar />}
              label="Reservas"
              isActive={isActiveRoute('/reservas')}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
          </MenuList>
        </MenuSection>
        
        <MenuSection isCollapsed={isCollapsed}>
          <h3>Gestão</h3>
          <MenuList>
            <MenuItemComponent
              to="/relatorios"
              icon={<FiClipboard />}
              label="Relatórios"
              isActive={isActiveRoute('/relatorios')}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
            <MenuItemComponent
              to="/financeiro"
              icon={<FiDollarSign />}
              label="Financeiro"
              isActive={isActiveRoute('/financeiro')}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
          </MenuList>
        </MenuSection>
        
        <MenuSection isCollapsed={isCollapsed}>
          <h3>Configurações</h3>
          <MenuList>
            <MenuItemComponent
              to="/configuracoes"
              icon={<FiSettings />}
              label="Configurações"
              isActive={isActiveRoute('/configuracoes')}
              isCollapsed={isCollapsed}
              onClick={handleLinkClick}
            />
          </MenuList>
        </MenuSection>
      </MenuContent>
      
      <MenuFooter isCollapsed={isCollapsed}>
        <UserInfo isCollapsed={isCollapsed}>
          <UserAvatar>
            {user && getUserInitials(user.name || '')}
          </UserAvatar>
          <UserDetails>
            <UserName>{user?.name || 'Usuário'}</UserName>
            <UserRole>{getUserRole()}</UserRole>
          </UserDetails>
        </UserInfo>
        <LogoutButton 
          isCollapsed={isCollapsed} 
          onClick={handleLogout}
          aria-label="Sair"
        >
          <FiLogOut />
          <span>Sair</span>
        </LogoutButton>
      </MenuFooter>
    </MenuContainer>
  );
};

export default Menu; 