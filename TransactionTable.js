// src/components/TransactionTable.js
import React from 'react';
import txnDetails from './Txn_details.json'; // Import the JSON file

const TransactionTable = () => {
    return (
        <div>
            <h2>Bitcoin Transactions</h2>
            <table>
                <thead>
                    <tr>
                        <th>Sender</th>
                        <th>Receiver</th>
                        <th>Timestamp</th>
                        <th>Amount (BTC)</th>
                    </tr>
                </thead>
                <tbody>
                    {txnDetails.map((txn, index) => (
                        <tr key={index}>
                            <td>{txn.sender}</td>
                            <td>{txn.receiver}</td>
                            <td>{txn.timestamp}</td>
                            <td>{txn.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
