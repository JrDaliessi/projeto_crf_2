import { useState, useEffect } from 'react';
import { ChartData } from 'chart.js';
import { supabase } from '../services/supabaseClient';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Cores para usar nos gráficos
const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
};

// Versões transparentes das cores
const CHART_COLORS_TRANSPARENT = {
  red: 'rgba(255, 99, 132, 0.2)',
  orange: 'rgba(255, 159, 64, 0.2)',
  yellow: 'rgba(255, 205, 86, 0.2)',
  green: 'rgba(75, 192, 192, 0.2)',
  blue: 'rgba(54, 162, 235, 0.2)',
  purple: 'rgba(153, 102, 255, 0.2)',
  grey: 'rgba(201, 203, 207, 0.2)',
};

// Interface para dados mensais
interface MonthlyData {
  month: string;
  value: number;
}

// Interface para dados categorizados
interface CategoryData {
  category: string;
  value: number;
}

// Hook para obter dados de vendas mensais
export function useMonthlySalesData() {
  const [data, setData] = useState<ChartData<'bar'>>({
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlySales = async () => {
      setLoading(true);
      try {
        // Aqui você implementaria a consulta ao Supabase
        // Exemplo:
        // const { data, error } = await supabase.rpc('get_monthly_sales');
        
        // Dados de exemplo para desenvolvimento
        const mockData: MonthlyData[] = [
          { month: 'Jan', value: 1200 },
          { month: 'Fev', value: 1900 },
          { month: 'Mar', value: 1500 },
          { month: 'Abr', value: 2200 },
          { month: 'Mai', value: 2700 },
          { month: 'Jun', value: 2100 },
        ];

        setData({
          labels: mockData.map(item => item.month),
          datasets: [
            {
              label: 'Vendas Mensais (R$)',
              data: mockData.map(item => item.value),
              backgroundColor: CHART_COLORS_TRANSPARENT.blue,
              borderColor: CHART_COLORS.blue,
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Erro ao obter dados de vendas mensais:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlySales();
  }, []);

  return { data, loading };
}

// Hook para obter dados de categorias de despesas
export function useExpenseCategoriesData() {
  const [data, setData] = useState<ChartData<'pie'>>({
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenseCategories = async () => {
      setLoading(true);
      try {
        // Aqui você implementaria a consulta ao Supabase
        // Exemplo:
        // const { data, error } = await supabase.rpc('get_expense_categories');
        
        // Dados de exemplo para desenvolvimento
        const mockData: CategoryData[] = [
          { category: 'Manutenção', value: 3500 },
          { category: 'Eventos', value: 4200 },
          { category: 'Pessoal', value: 8100 },
          { category: 'Estoque', value: 2800 },
          { category: 'Administrativo', value: 1600 },
        ];

        setData({
          labels: mockData.map(item => item.category),
          datasets: [
            {
              label: 'Despesas por Categoria (R$)',
              data: mockData.map(item => item.value),
              backgroundColor: [
                CHART_COLORS_TRANSPARENT.red,
                CHART_COLORS_TRANSPARENT.orange,
                CHART_COLORS_TRANSPARENT.yellow,
                CHART_COLORS_TRANSPARENT.green,
                CHART_COLORS_TRANSPARENT.blue,
              ],
              borderColor: [
                CHART_COLORS.red,
                CHART_COLORS.orange,
                CHART_COLORS.yellow,
                CHART_COLORS.green,
                CHART_COLORS.blue,
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Erro ao obter dados de categorias de despesas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseCategories();
  }, []);

  return { data, loading };
}

// Hook para obter dados de acessos ao clube por dia da semana
export function useWeeklyAccessData() {
  const [data, setData] = useState<ChartData<'line'>>({
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyAccess = async () => {
      setLoading(true);
      try {
        // Aqui você implementaria a consulta ao Supabase
        // Exemplo:
        // const { data, error } = await supabase.rpc('get_weekly_access');
        
        // Dados de exemplo para desenvolvimento
        const mockData = [
          { day: 'Segunda', value: 45 },
          { day: 'Terça', value: 38 },
          { day: 'Quarta', value: 55 },
          { day: 'Quinta', value: 42 },
          { day: 'Sexta', value: 90 },
          { day: 'Sábado', value: 125 },
          { day: 'Domingo', value: 140 },
        ];

        setData({
          labels: mockData.map(item => item.day),
          datasets: [
            {
              label: 'Acessos por Dia',
              data: mockData.map(item => item.value),
              fill: false,
              backgroundColor: CHART_COLORS.green,
              borderColor: CHART_COLORS.green,
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error('Erro ao obter dados de acessos semanais:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyAccess();
  }, []);

  return { data, loading };
}

// Hook para obter distribuição de reservas por área do clube
export function useReservationsByAreaData() {
  const [data, setData] = useState<ChartData<'doughnut'>>({
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservationsByArea = async () => {
      setLoading(true);
      try {
        // Aqui você implementaria a consulta ao Supabase
        // Exemplo:
        // const { data, error } = await supabase.rpc('get_reservations_by_area');
        
        // Dados de exemplo para desenvolvimento
        const mockData = [
          { area: 'Quadras', value: 180 },
          { area: 'Piscina', value: 120 },
          { area: 'Churrasqueira', value: 90 },
          { area: 'Salão de Festas', value: 40 },
        ];

        setData({
          labels: mockData.map(item => item.area),
          datasets: [
            {
              label: 'Reservas por Área',
              data: mockData.map(item => item.value),
              backgroundColor: [
                CHART_COLORS_TRANSPARENT.red,
                CHART_COLORS_TRANSPARENT.blue,
                CHART_COLORS_TRANSPARENT.yellow,
                CHART_COLORS_TRANSPARENT.purple,
              ],
              borderColor: [
                CHART_COLORS.red,
                CHART_COLORS.blue,
                CHART_COLORS.yellow,
                CHART_COLORS.purple,
              ],
              borderWidth: 1,
              hoverOffset: 4,
            },
          ],
        });
      } catch (error) {
        console.error('Erro ao obter dados de reservas por área:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservationsByArea();
  }, []);

  return { data, loading };
} 