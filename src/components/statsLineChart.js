import React from 'react';
import { Line } from 'react-chartjs-2';  // Import Line from react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatsLineChart = ({ data, yTitle }) => {
  const options = {
    responsive: true,  // Makes the chart responsive to window resizing
    plugins: {
      legend: {
        position: 'top', // Position of the legend
      },
      tooltip: {
        mode: 'index', // Tooltip mode
        intersect: false, // Tooltip shows when hovering over any part of the line
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',  // X-axis title
        },
        grid: {
            display: false,
            lineWidth: 1,
        },
        border: {
            display: true,
            color: "black",
            lineWidth: 2,
        },
      },
      y: {
        title: {
          display: true,
          text: yTitle,  // Y-axis title
        },
        ticks: {
            beginAtZero: true,
        },
        border: {
            display: true,
            color: "black",
            lineWidth: 2,
        },
        min: 0
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default StatsLineChart;
