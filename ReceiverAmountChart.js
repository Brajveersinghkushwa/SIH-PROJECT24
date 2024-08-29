import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import txnData from './Txn_details.json'; // Import JSON data (or use fetch for dynamic data)

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TransactionFrequencyChart = () => {
  const [hourlyCounts, setHourlyCounts] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);

  useEffect(() => {
    const hourlyFrequency = {};
    const timeLabelsSet = new Set();

    // Group transactions by 1-hour intervals and count the number of transactions in each interval
    txnData.forEach((txn) => {
      const date = new Date(txn.timestamp);
      const hour = `${date.getHours()}:00 - ${date.getHours() + 1}:00`;
      timeLabelsSet.add(hour);
      hourlyFrequency[hour] = (hourlyFrequency[hour] || 0) + 1;
    });

    // Sort the time labels to maintain the correct time order
    const sortedLabels = Array.from(timeLabelsSet).sort((a, b) => {
      const [startA] = a.split(' - ');
      const [startB] = b.split(' - ');
      return parseInt(startA) - parseInt(startB);
    });

    setTimeLabels(sortedLabels);
    setHourlyCounts(sortedLabels.map(label => hourlyFrequency[label] || 0));
  }, []);

  // Chart.js configuration
  const data = {
    labels: timeLabels, // x-axis labels (time intervals)
    datasets: [
      {
        label: 'Number of Transactions',
        data: hourlyCounts, // y-axis data (frequency of transactions)
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Transaction Frequency vs Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time Intervals',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Frequency of Transactions',
        },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default TransactionFrequencyChart;
