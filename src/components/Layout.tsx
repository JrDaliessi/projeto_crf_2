import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Menu from './Menu';
import TopBar from './TopBar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
`;

const MainContent = styled.div<{ sidebarWidth: string }>`
  flex: 1;
  margin-left: ${props => props.sidebarWidth};
  transition: margin-left var(--transition-normal) ease;
  width: calc(100% - ${props => props.sidebarWidth});
  
  @media (max-width: 1024px) {
    margin-left: 0;
    width: 100%;
  }
`;

const ContentWrapper = styled.div`
  padding: var(--spacing-6);
  
  @media (max-width: 640px) {
    padding: var(--spacing-4);
  }
`;

const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 990;
  opacity: ${props => props.isVisible ? '1' : '0'};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: opacity var(--transition-normal) ease, visibility var(--transition-normal) ease;
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Lidar com redimensionamento da janela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Se redimensionar para não-móvel, fechar menu móvel
      if (!mobile && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);
  
  // Alternar colapsamento da barra lateral
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  // Alternar menu móvel
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Determinar a largura da barra lateral
  const sidebarWidth = isMobile 
    ? '0px' 
    : (isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)');
  
  return (
    <LayoutContainer>
      {/* Menu para desktop */}
      {!isMobile && (
        <Menu 
          isCollapsed={isCollapsed} 
          toggleCollapse={toggleCollapse}
          isMobile={false}
        />
      )}
      
      {/* Menu para móvel */}
      {isMobile && isMobileMenuOpen && (
        <Menu 
          isCollapsed={false} 
          toggleCollapse={toggleCollapse}
          isMobile={true}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Overlay para fechar menu móvel */}
      {isMobile && (
        <Overlay 
          isVisible={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <MainContent sidebarWidth={sidebarWidth}>
        <TopBar onToggleMenu={isMobile ? toggleMobileMenu : toggleCollapse} />
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 