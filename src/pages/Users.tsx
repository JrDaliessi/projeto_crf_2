import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUser, FiEdit2, FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Table, { ColumnDef } from '../components/Table';
import { useNavigate } from 'react-router-dom';

// Tipo para representar um usuário na tabela
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'ativo' | 'inativo';
  createdAt: string;
}

// Componentes estilizados
const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-6);
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-4);
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
`;

const StatusBadge = styled.span<{ status: 'ativo' | 'inativo' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => 
    props.status === 'ativo' 
      ? 'rgba(var(--color-success-rgb), 0.1)' 
      : 'rgba(var(--color-error-rgb), 0.1)'};
  color: ${props => 
    props.status === 'ativo' 
      ? 'var(--color-success)' 
      : 'var(--color-error)'};
  
  svg {
    margin-right: 0.25rem;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: var(--spacing-2);
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-md);
  border: none;
  background-color: transparent;
  color: var(--color-text-light);
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  
  &:hover {
    background-color: var(--color-background);
    color: var(--color-primary);
  }
  
  &.edit:hover {
    color: var(--color-info);
  }
  
  &.delete:hover {
    color: var(--color-error);
  }
`;

const Users: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simular carregamento de dados
    const fetchUsers = async () => {
      setIsLoading(true);
      
      // Dados de exemplo
      const mockUsers: UserData[] = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao.silva@email.com',
          role: 'ADMIN',
          status: 'ativo',
          createdAt: '2023-01-15T10:30:00'
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria.santos@email.com',
          role: 'FUNCIONARIO',
          status: 'ativo',
          createdAt: '2023-02-20T14:45:00'
        },
        {
          id: '3',
          name: 'Pedro Almeida',
          email: 'pedro.almeida@email.com',
          role: 'ASSOCIADO',
          status: 'ativo',
          createdAt: '2023-03-10T09:15:00'
        },
        {
          id: '4',
          name: 'Ana Carolina',
          email: 'ana.carolina@email.com',
          role: 'ASSOCIADO',
          status: 'inativo',
          createdAt: '2023-01-05T11:20:00'
        },
        {
          id: '5',
          name: 'Roberto Ferreira',
          email: 'roberto.ferreira@email.com',
          role: 'FUNCIONARIO',
          status: 'ativo',
          createdAt: '2023-04-18T16:30:00'
        },
        {
          id: '6',
          name: 'Luciana Mendes',
          email: 'luciana.mendes@email.com',
          role: 'ASSOCIADO',
          status: 'ativo',
          createdAt: '2023-02-28T08:45:00'
        },
        {
          id: '7',
          name: 'Fernanda Costa',
          email: 'fernanda.costa@email.com',
          role: 'ASSOCIADO',
          status: 'inativo',
          createdAt: '2022-12-10T13:20:00'
        },
        {
          id: '8',
          name: 'Ricardo Oliveira',
          email: 'ricardo.oliveira@email.com',
          role: 'FUNCIONARIO',
          status: 'ativo',
          createdAt: '2023-03-25T10:10:00'
        },
        {
          id: '9',
          name: 'Patrícia Lima',
          email: 'patricia.lima@email.com',
          role: 'ASSOCIADO',
          status: 'ativo',
          createdAt: '2023-01-30T15:40:00'
        },
        {
          id: '10',
          name: 'Carlos Eduardo',
          email: 'carlos.eduardo@email.com',
          role: 'ASSOCIADO',
          status: 'ativo',
          createdAt: '2023-05-05T09:30:00'
        },
        {
          id: '11',
          name: 'Amanda Rocha',
          email: 'amanda.rocha@email.com',
          role: 'ASSOCIADO',
          status: 'inativo',
          createdAt: '2023-02-15T11:50:00'
        },
        {
          id: '12',
          name: 'Marcos Pereira',
          email: 'marcos.pereira@email.com',
          role: 'FUNCIONARIO',
          status: 'ativo',
          createdAt: '2023-04-02T14:15:00'
        }
      ];
      
      // Simular atraso na rede
      setTimeout(() => {
        setUsers(mockUsers);
        setIsLoading(false);
      }, 1500);
    };
    
    fetchUsers();
  }, []);
  
  // Não permitir acesso se não for admin ou funcionário
  if (!user || !(isAdmin() || user.roles.role_name === "FUNCIONARIO")) {
    return (
      <Layout>
        <Card>
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
        </Card>
      </Layout>
    );
  }
  
  // Manipuladores de eventos
  const handleAddUser = () => {
    navigate('/usuarios/novo');
  };
  
  const handleEditUser = (id: string) => {
    navigate(`/usuarios/${id}/editar`);
  };
  
  const handleDeleteUser = (id: string) => {
    // Implementar lógica para excluir usuário
    console.log('Excluir usuário', id);
  };
  
  // Definição das colunas da tabela
  const columns: ColumnDef<UserData>[] = [
    {
      header: 'Nome',
      accessorKey: 'name',
      width: '25%'
    },
    {
      header: 'Email',
      accessorKey: 'email',
      width: '25%'
    },
    {
      header: 'Perfil',
      accessorKey: 'role',
      cell: ({ value }) => {
        // Mapeamento de roles para exibição
        const roleMap: Record<string, string> = {
          'ADMIN': 'Administrador',
          'FUNCIONARIO': 'Funcionário',
          'ASSOCIADO': 'Associado',
          'VISITANTE': 'Visitante'
        };
        
        return roleMap[value] || value;
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) => (
        <StatusBadge status={value}>
          {value === 'ativo' ? <FiCheck size={12} /> : <FiX size={12} />}
          {value === 'ativo' ? 'Ativo' : 'Inativo'}
        </StatusBadge>
      )
    },
    {
      header: 'Cadastro',
      accessorKey: 'createdAt',
      cell: ({ value }) => {
        const date = new Date(value);
        return new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(date);
      }
    },
    {
      header: 'Ações',
      accessorKey: 'id',
      sortable: false,
      cell: ({ value }) => (
        <ActionsContainer>
          <ActionButton 
            className="edit" 
            onClick={() => handleEditUser(value)}
            aria-label="Editar usuário"
          >
            <FiEdit2 size={16} />
          </ActionButton>
          <ActionButton 
            className="delete" 
            onClick={() => handleDeleteUser(value)}
            aria-label="Excluir usuário"
          >
            <FiTrash2 size={16} />
          </ActionButton>
        </ActionsContainer>
      )
    }
  ];
  
  return (
    <Layout>
      <PageHeader>
        <PageTitle>Usuários</PageTitle>
        <Button 
          variant="primary" 
          leftIcon={<FiPlus />}
          onClick={handleAddUser}
        >
          Novo Usuário
        </Button>
      </PageHeader>
      
      <Table<UserData>
        data={users}
        columns={columns}
        isLoading={isLoading}
        pageSize={8}
        showPagination={true}
        showSearch={true}
        emptyStateMessage="Nenhum usuário encontrado"
      />
    </Layout>
  );
};

export default Users; 