import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionHistory = ({ address }) => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactionHistory = async () => {
            try {
                const apiKey = '1bfe61aeeab947fd8dc8e8f00d1a8cc6'; // Replace with your actual API key
                const url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?token=${apiKey}`;

                const response = await axios.get(url);
                const txs = response.data.txs;

                // Format the transaction data
                const formattedTransactions = txs.map(tx => {
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

                setTransactions(formattedTransactions);
            } catch (error) {
                console.error('Error fetching transaction history:', error);
            }
        };

        fetchTransactionHistory();
    }, [address]);

    return (
        <div>
            <h2>Transaction History for {address}</h2>
            <ul>
                {transactions.map((tx, index) => (
                    <li key={index}>
                        <p><strong>Receiver:</strong> {tx.receiver}</p>
                        <p><strong>Sender:</strong> {tx.sender}</p>
                        <p><strong>Amount in BTC:</strong> {tx.amount}</p>
                        <p><strong>Time (IST):</strong> {tx.time}</p>
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionHistory;
