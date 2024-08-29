import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, ListGroup } from 'react-bootstrap';

const TransactionDetails = ({ walletAddress, transactionsCount, timeFilter }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const apiKey = 'your_blockcypher_api_key'; // Replace with your actual API key
        const url = `https://api.blockcypher.com/v1/btc/main/addrs/${walletAddress}/full?token=${apiKey}`;

        const response = await axios.get(url);
        const txs = response.data.txs;

        // Filter and format the transaction data
        const filteredTransactions = filterTransactions(txs).slice(0, transactionsCount);

        setTransactions(filteredTransactions);
      } catch (error) {
        console.error('Error fetching transaction details:', error);
      }
    };

    const filterTransactions = (transactions) => {
      const now = Date.now();
      const oneHourAgo = now - 60 * 60 * 1000;
      const oneDayAgo = now - 24 * 60 * 60 * 1000;
      const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

      return transactions.filter(tx => {
        const txTime = new Date(tx.received).getTime();

        switch (timeFilter) {
          case 'last_hour':
            return txTime >= oneHourAgo;
          case 'last_day':
            return txTime >= oneDayAgo;
          case 'last_month':
          default:
            return txTime >= oneMonthAgo;
        }
      }).map(tx => {
        const time = new Date(tx.received).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata'
        });

        return tx.outputs.map(output => ({
          receiver: output.addresses[0],
          sender: tx.inputs[0].addresses[0],
          amount: output.value / 100000000, // Convert satoshis to BTC
          time: time
        }));
      }).flat();
    };

    fetchTransactionHistory();
  }, [walletAddress, transactionsCount, timeFilter]);

  return (
    <Card className="mt-3">
      <Card.Header>Transactions</Card.Header>
      <ListGroup variant="flush">
        {transactions.map((tx, index) => (
          <ListGroup.Item key={index}>
            <p><strong>Receiver:</strong> {tx.receiver}</p>
            <p><strong>Sender:</strong> {tx.sender}</p>
            <p><strong>Amount in BTC:</strong> {tx.amount}</p>
            <p><strong>Time (IST):</strong> {tx.time}</p>
            <hr />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default TransactionDetails;
