import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Table } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./History.css"; // Assume you add the necessary CSS here

const History = () => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [transactions, setTransactions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const regex = /^[a-zA-Z0-9]+$/;

    if (!regex.test(address)) {
      setError("Address must be alphanumeric.");
      return;
    }

    if (address.length < 26 || address.length > 62) {
      setError("Address must be between 26 and 62 characters long.");
      return;
    }

    setError("");
    setWalletAddress(address); // Save the input in Wallet_Address variable
    console.log("Suspected Address:", address);
  };

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!walletAddress) return;

      try {
        const apiKey = "1bfe61aeeab947fd8dc8e8f00d1a8cc6"; // Replace with your actual API key
        const url = `https://api.blockcypher.com/v1/btc/main/addrs/${walletAddress}/full?token=${apiKey}`;

        const response = await axios.get(url);
        const txs = response.data.txs;

        // Format the transaction data
        const formattedTransactions = txs
          .map((tx) => {
            const time = new Date(tx.received).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            });
            return tx.outputs.map((output) => ({
              receiver: output.addresses[0],
              sender: tx.inputs[0].addresses[0],
              amount: output.value / 100000000, // Convert satoshis to BTC
              time: time,
            }));
          })
          .flat();

        setTransactions(formattedTransactions);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    };

    fetchTransactionHistory();
  }, [walletAddress]);

  return (
    <div className="page-background">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        {!walletAddress ? (
          <Form
            className="p-5 rounded shadow animated-container"
            onSubmit={handleSubmit}
          >
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="formAddress">
              <Form.Label className="h5 text-light">
                Enter the suspected address
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mb-3"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Submit
            </Button>
          </Form>
        ) : (
          <Container className="mt-4 animated-container">
            <h2 className="text-light mb-4 text-center">
              Transaction History for {walletAddress}
            </h2>
            <Table striped bordered hover variant="dark" className="table-responsive">
              <thead>
                <tr>
                  <th>Receiver</th>
                  <th>Sender</th>
                  <th>Amount (BTC)</th>
                  <th>Time (IST)</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index}>
                    <td>{tx.receiver}</td>
                    <td>{tx.sender}</td>
                    <td>{tx.amount}</td>
                    <td>{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        )}
      </Container>
    </div>
  );
};

export default History;
