import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

// Registrando os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
  height?: number;
  width?: number;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  options, 
  height,
  width 
}) => {
  const defaultOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Gráfico de Barras',
      },
    },
  };

  return (
    <div style={{ height, width }}>
      <Bar data={data} options={options || defaultOptions} />
    </div>
  );
};

export default BarChart; 