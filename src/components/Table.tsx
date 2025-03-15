import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';

// Tipos de dados
export type ColumnDef<T> = {
  header: string;
  accessorKey: keyof T;
  cell?: (info: { row: T; value: any }) => React.ReactNode;
  sortable?: boolean;
  width?: string;
};

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
  showPagination?: boolean;
  showSearch?: boolean;
  emptyStateMessage?: string;
  isLoading?: boolean;
}

// Componentes estilizados
const TableContainer = styled.div`
  background-color: var(--color-card-background);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: var(--spacing-6);
`;

const TableTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-border);
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-3);
  }
`;

const TableTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 300px;
  
  @media (max-width: 640px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-8);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 1px var(--color-primary);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: var(--spacing-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-light);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
`;

const TableHead = styled.thead`
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
`;

const TableHeaderCell = styled.th<{ width?: string }>`
  padding: var(--spacing-3) var(--spacing-4);
  text-align: left;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--color-text-light);
  white-space: nowrap;
  ${props => props.width && `width: ${props.width};`}
`;

const SortableHeader = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    color: var(--color-text);
  }
  
  ${props => props.isActive && css`
    color: var(--color-primary);
  `}
`;

const SortIcon = styled.div`
  display: flex;
  align-items: center;
  margin-left: var(--spacing-2);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--color-border);
  transition: background-color var(--transition-fast) ease;
  
  &:hover {
    background-color: rgba(var(--color-primary-rgb), 0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: var(--spacing-4);
  font-size: 0.875rem;
  color: var(--color-text);
`;

const TableBody = styled.tbody``;

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8);
  color: var(--color-text-light);
  font-size: 0.875rem;
  background-color: rgba(255, 255, 255, 0.8);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8);
  color: var(--color-text-light);
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 2rem;
  color: var(--color-text-lighter);
  margin-bottom: var(--spacing-3);
`;

const EmptyStateText = styled.p`
  margin: 0;
  font-size: 0.875rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4);
  border-top: 1px solid var(--color-border);
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: var(--spacing-3);
  }
`;

const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-light);
`;

const PaginationButtons = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
`;

const PaginationButton = styled.button<{ isActive?: boolean; isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background-color: ${props => props.isActive ? 'var(--color-primary)' : 'var(--color-card-background)'};
  color: ${props => props.isActive ? 'var(--color-text-inverted)' : 'var(--color-text)'};
  cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.isDisabled ? 0.5 : 1};
  font-size: 0.875rem;
  transition: all var(--transition-fast) ease;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.isActive ? 'var(--color-primary-hover)' : 'var(--color-background)'};
    border-color: ${props => props.isActive ? 'var(--color-primary-hover)' : 'var(--color-border-hover)'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

function Table<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  showPagination = true,
  showSearch = true,
  emptyStateMessage = 'Nenhum dado encontrado',
  isLoading = false
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<T[]>([]);
  
  // Função para filtrar dados
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = data.filter(item => {
      return Object.values(item).some(value => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowercaseSearch);
      });
    });
    
    setFilteredData(filtered);
    setCurrentPage(1); // Voltar para a primeira página ao filtrar
  }, [data, searchTerm]);
  
  // Função para ordenar dados
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
      if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc' 
        ? (aValue > bValue ? 1 : -1)
        : (aValue > bValue ? -1 : 1);
    });
  }, [filteredData, sortColumn, sortDirection]);
  
  // Função para paginar dados
  const paginatedData = React.useMemo(() => {
    if (!showPagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, showPagination]);
  
  // Função para lidar com a ordenação
  const handleSort = (columnKey: keyof T) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };
  
  // Cálculo de páginas
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, sortedData.length);
  
  // Navegar para página anterior
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Navegar para próxima página
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  return (
    <TableContainer>
      {(showSearch || !!isLoading) && (
        <TableTopBar>
          <TableTitle>
            {isLoading ? 'Carregando dados...' : `Mostrando ${filteredData.length} registros`}
          </TableTitle>
          
          {showSearch && (
            <SearchContainer>
              <SearchIcon>
                <FiSearch size={16} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
          )}
        </TableTopBar>
      )}
      
      <div style={{ overflowX: 'auto' }}>
        <StyledTable>
          <TableHead>
            <tr>
              {columns.map((column, index) => (
                <TableHeaderCell key={index} width={column.width}>
                  {column.sortable !== false ? (
                    <SortableHeader 
                      isActive={sortColumn === column.accessorKey}
                      onClick={() => handleSort(column.accessorKey)}
                    >
                      {column.header}
                      <SortIcon>
                        {sortColumn === column.accessorKey && (
                          sortDirection === 'asc' ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />
                        )}
                      </SortIcon>
                    </SortableHeader>
                  ) : (
                    column.header
                  )}
                </TableHeaderCell>
              ))}
            </tr>
          </TableHead>
          
          <TableBody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length}>
                  <LoadingOverlay>Carregando dados...</LoadingOverlay>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState>
                    <EmptyStateIcon>📋</EmptyStateIcon>
                    <EmptyStateText>{emptyStateMessage}</EmptyStateText>
                  </EmptyState>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.cell
                        ? column.cell({ row, value: row[column.accessorKey] })
                        : row[column.accessorKey] != null
                          ? String(row[column.accessorKey])
                          : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </StyledTable>
      </div>
      
      {showPagination && !isLoading && sortedData.length > 0 && (
        <PaginationContainer>
          <PaginationInfo>
            Mostrando {startItem} - {endItem} de {sortedData.length}
          </PaginationInfo>
          
          <PaginationButtons>
            <PaginationButton onClick={goToPrevPage} isDisabled={currentPage === 1} disabled={currentPage === 1}>
              <FiChevronLeft size={16} />
            </PaginationButton>
            
            {/* Renderizar botões de página */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber: number;
              
              if (totalPages <= 5) {
                // Mostrar todas as páginas se o total for 5 ou menos
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                // Mostrar páginas 1-5 se estiver no início
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                // Mostrar as últimas 5 páginas se estiver no fim
                pageNumber = totalPages - 4 + i;
              } else {
                // Mostrar 2 páginas antes e 2 depois da página atual
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <PaginationButton
                  key={pageNumber}
                  isActive={pageNumber === currentPage}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </PaginationButton>
              );
            })}
            
            <PaginationButton 
              onClick={goToNextPage} 
              isDisabled={currentPage === totalPages}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight size={16} />
            </PaginationButton>
          </PaginationButtons>
        </PaginationContainer>
      )}
    </TableContainer>
  );
}

export default Table; 