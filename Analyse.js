import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import txnData from './Data.json'; // Import JSON data (or use fetch for dynamic data)
import './Analyse.css'

ChartJS.register(LineElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement);

const TransactionFrequencyChart = () => {
  const [hourlyCounts, setHourlyCounts] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);
  const [receiverCounts, setReceiverCounts] = useState([]);
  const [receiverLabels, setReceiverLabels] = useState([]);

  useEffect(() => {
    const hourlyFrequency = {};
    const timeLabelsSet = new Set();

    // Group transactions by 1-hour intervals and count the number of transactions in each interval
    txnData.forEach((txn, index) => {
      const [datePart, timePart] = txn.timestamp.split(', ');
      const [day, month, year] = datePart.split('/');
      const [time, period] = timePart.split(' ');
      let [hours] = time.split(':');

      // Convert to 24-hour format if needed
      if (period === 'pm' && hours !== '12') {
        hours = parseInt(hours) + 12;
      } else if (period === 'am' && hours === '12') {
        hours = '00';
      }

      const hourInterval = `${hours}:00 - ${parseInt(hours) + 1}:00`;
      timeLabelsSet.add(hourInterval);
      hourlyFrequency[hourInterval] = (hourlyFrequency[hourInterval] || 0) + 1;
    });

    // Sort the time labels to maintain the correct time order
    const sortedLabels = Array.from(timeLabelsSet).sort((a, b) => {
      const [startA] = a.split(' - ');
      const [startB] = b.split(' - ');
      return parseInt(startA) - parseInt(startB);
    });

    setTimeLabels(sortedLabels);
    setHourlyCounts(sortedLabels.map(label => hourlyFrequency[label] || 0));
    const transactionCounts = {};

    // Count the number of transactions for each receiver
    txnData.forEach((txn) => {
      const receiver = txn.receiver;
      transactionCounts[receiver] = (transactionCounts[receiver] || 0) + 1;
    });

    // Prepare labels and counts for the chart
    const labels = Object.keys(transactionCounts);
    const counts = labels.map((receiver) => transactionCounts[receiver]);

    setReceiverLabels(labels);
    setReceiverCounts(counts);
  }, []);

  // Bar chart data configuration
  const barData = {
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

  const barOptions = {
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

  // Line chart data configuration
  const receivers = txnData.map(entry => entry.receiver);
  const amounts = txnData.map(entry => entry.amount);

  const lineData = {
    labels: receivers.map((_, index) => `Wallet ${index + 1}`), // x-axis labels (wallet_no)
    datasets: [
      {
        label: 'Amount',
        data: amounts,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: false, // Ensure no area under the line is filled
        tension: 0.4, // Curve the line for a smoother appearance
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Amount vs Receiver',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const receiverAddress = receivers[tooltipItem.dataIndex]; // Get the corresponding receiver address
            return `Wallet ${tooltipItem.dataIndex + 1}: Amount - ${tooltipItem.raw}, Receiver - ${receiverAddress}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Wallet No',
        },
        ticks: {
          maxTicksLimit: 10, // Limit number of ticks for readability
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount',
        },
        beginAtZero: true,
      },
    },
  };
  // Bar chart data configuration
  const barData1 = {
    labels: receivers.map((_, index) => `Wallet ${index + 1}`), // x-axis labels (receiver addresses)
    datasets: [
      {
        label: 'Number of Transactions',
        data: receiverCounts, // y-axis data (number of transactions)
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions1 = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Number of Transactions vs Receiver Address',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const receiverAddress = receivers[tooltipItem.dataIndex];
            return `Receiver - ${receiverAddress}, Transactions: ${tooltipItem.raw}`; //
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Receiver Address',
        },
        ticks: {
          maxTicksLimit: 10, // Limit number of ticks for readability
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Transactions',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <div className='graph1' style={{ backgroundColor: 'white',marginLeft:'30px',marginRight:'30px', padding: '50px', marginTop: '50px', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2>Transaction Frequency vs Time</h2>
        <Bar data={barData} options={barOptions} />
      </div>
      <div className='graph2' style={{ backgroundColor: 'white',marginLeft:'30px',marginRight:'30px', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)',marginBottom: '30px'  }}>
        <h2>Amount vs Receiver</h2>
        <Line data={lineData} options={lineOptions} />
      </div>
      <div className='graph3' style={{ backgroundColor: 'white', marginLeft:'30px',marginRight:'30px',padding: '30px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2>Number of Transactions vs Receiver Address</h2>
      <Bar data={barData1} options={barOptions1} />
    </div>
    </div>
  );
};

export default TransactionFrequencyChart;
