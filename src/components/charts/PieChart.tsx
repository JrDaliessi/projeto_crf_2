import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

// Registrando os componentes necessários do Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface PieChartProps {
  data: ChartData<'pie'>;
  options?: ChartOptions<'pie'>;
  height?: number;
  width?: number;
}

const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  options, 
  height,
  width 
}) => {
  const defaultOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Gráfico de Pizza',
      },
    },
  };

  return (
    <div style={{ height, width }}>
      <Pie data={data} options={options || defaultOptions} />
    </div>
  );
};

export default PieChart; 