import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FiSave, FiX } from 'react-icons/fi';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { Form, Input, Select, Textarea } from '../components/Form';

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

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  margin-top: var(--spacing-6);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

interface UserFormData {
  name: string;
  email: string;
  role: string;
  phone: string;
  active: boolean;
  observations: string;
}

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  // Estado do formulário
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'ASSOCIADO',
    phone: '',
    active: true,
    observations: ''
  });
  
  // Estado dos erros
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estado do loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Funções auxiliares
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Lidar com checkbox
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Limpar erro para este campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validação
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'O email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.role) {
      newErrors.role = 'O perfil é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar dados
    if (!validate()) {
      return;
    }
    
    // Preparar para submissão
    setIsSubmitting(true);
    
    try {
      // Simular envio para a API
      console.log('Enviando dados:', formData);
      
      // Simular atraso da rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirecionar para a lista de usuários
      navigate('/usuarios');
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setErrors({
        submit: 'Ocorreu um erro ao salvar o usuário. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Cancelar e voltar para a listagem
  const handleCancel = () => {
    navigate('/usuarios');
  };
  
  return (
    <Layout>
      <PageHeader>
        <PageTitle>
          {isEditMode ? 'Editar Usuário' : 'Novo Usuário'}
        </PageTitle>
      </PageHeader>
      
      <Card>
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <Input
              name="name"
              label="Nome"
              placeholder="Nome completo"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
          </FormRow>
          
          <FormRow>
            <Select
              name="role"
              label="Perfil"
              value={formData.role}
              onChange={handleChange}
              error={errors.role}
              required
            >
              <option value="">Selecione um perfil</option>
              <option value="ADMIN">Administrador</option>
              <option value="FUNCIONARIO">Funcionário</option>
              <option value="ASSOCIADO">Associado</option>
              <option value="VISITANTE">Visitante</option>
            </Select>
            
            <Input
              name="phone"
              label="Telefone"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              helperText="Formato: (00) 00000-0000"
            />
          </FormRow>
          
          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                style={{ marginRight: 'var(--spacing-2)' }}
              />
              Usuário ativo
            </label>
          </div>
          
          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <Textarea
              name="observations"
              label="Observações"
              placeholder="Informações adicionais sobre o usuário..."
              value={formData.observations}
              onChange={handleChange}
              error={errors.observations}
            />
          </div>
          
          {errors.submit && (
            <div style={{ 
              color: 'var(--color-error)', 
              padding: 'var(--spacing-3)', 
              marginTop: 'var(--spacing-4)',
              backgroundColor: 'rgba(var(--color-error-rgb), 0.1)',
              borderRadius: 'var(--radius-md)'
            }}>
              {errors.submit}
            </div>
          )}
          
          <FormActions>
            <Button
              type="button"
              variant="outline"
              leftIcon={<FiX />}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              leftIcon={<FiSave />}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isEditMode ? 'Atualizar' : 'Salvar'}
            </Button>
          </FormActions>
        </Form>
      </Card>
    </Layout>
  );
};

export default UserForm; 