import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

// Registrando os componentes necessários do Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface DoughnutChartProps {
  data: ChartData<'doughnut'>;
  options?: ChartOptions<'doughnut'>;
  height?: number;
  width?: number;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ 
  data, 
  options, 
  height,
  width 
}) => {
  const defaultOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Gráfico de Rosca',
      },
    },
  };

  return (
    <div style={{ height, width }}>
      <Doughnut data={data} options={options || defaultOptions} />
    </div>
  );
};

export default DoughnutChart; 