import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MemoryDistribution {
  lang: string;
  distribution: [string, number][]; // Format: [timestamp, value]
}

const memoryDistribution: MemoryDistribution = {
  lang: 'cpp',
  distribution: [
    ['147000', 2.8986],
    ['151600', 1.4493],
    ['151700', 5.7971],
    ['156200', 1.4493],
    ['156300', 2.8986],
    ['156400', 1.4493],
    ['156500', 1.4493],
    ['170700', 4.3478],
    ['174200', 1.4493],
    ['177300', 1.4493],
    ['178800', 1.4493],
    ['201900', 1.4493],
    ['203300', 1.4493],
    ['203400', 4.3478],
    ['204800', 1.4493],
    ['206300', 1.4493],
    ['222200', 1.4493],
    ['222300', 1.4493],
    ['222500', 1.4493],
    ['229300', 1.4493],
    ['230700', 1.4493],
    ['240600', 1.4493],
    ['252900', 1.4493],
    ['282900', 1.4493],
    ['283100', 1.4493],
    ['322900', 1.4493],
    ['333600', 1.4493],
    ['338700', 2.8986],
    ['344000', 1.4493],
    ['344100', 1.4493],
    ['346700', 1.4493],
    ['346800', 2.8986],
    ['347800', 1.4493],
    ['356500', 1.4493],
    ['359600', 1.4493],
    ['360900', 1.4493],
    ['365900', 1.4493],
    ['379800', 1.4493],
    ['387300', 1.4493],
    ['393100', 1.4493],
    ['401000', 1.4493],
    ['407700', 1.4493],
    ['419000', 1.4493],
    ['440200', 2.8986],
    ['440300', 2.8986],
    ['441500', 1.4493],
    ['459200', 2.8986],
    ['459300', 1.4493],
    ['459400', 1.4493],
    ['506600', 1.4493],
    ['526900', 1.4493]
  ]
};

const MemoryChart: React.FC = () => {
  // Prepare data for the chart
  const timestamps = memoryDistribution.distribution.map((item) => item[0]);
  const values = memoryDistribution.distribution.map((item) => item[1]);

  const data = {
    labels: timestamps, // X-axis labels (timestamps)
    datasets: [
      {
        label: 'Memory Distribution',
        data: values, // Y-axis data (values)
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background color under the line
        fill: true,
        tension: 0.4 // Smooth line
      }
    ]
  };

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top' as const // Ensuring 'top' is treated as a literal type
  //     },
  //     tooltip: {
  //       mode: 'index',
  //       intersect: false
  //     }
  //   },
  //   scales: {
  //     x: {
  //       title: {
  //         display: true,
  //         text: 'Timestamp'
  //       }
  //     },
  //     y: {
  //       title: {
  //         display: true,
  //         text: 'Memory Usage'
  //       },
  //       beginAtZero: true
  //     }
  //   }
  // };

  return <Line data={data} />;
};

export default MemoryChart;
