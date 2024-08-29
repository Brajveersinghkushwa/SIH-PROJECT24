import React from 'react';
import { Container } from 'react-bootstrap';
import Typewriter from 'typewriter-effect';
import './HomePage.css'; // Link to CSS file for styling
import 'bootstrap/dist/css/bootstrap.min.css';
import TransactionImage from './Media/Transaction.jpg';
import Graph_Analys from './Media/graph_analys.jpeg';

function HomePage() {
  return (
    <div className="home-container">
      <div className="content">
        <div className="message">
          <Typewriter
            options={{
              strings: ['Welcome to CryptoTrackr'],
              autoStart: true,
              loop: true,
              delay: 75,
            }}
          />
        </div>
        <h1 className='sub-message'>Unmasking the Shadows of Drug Trafficking</h1>
      </div>
      
      <Container className="my-4">
        <div className="image-container">
          <div className="image-wrapper">
            <a href="/history">
              <img src={TransactionImage} alt="Transaction" style={{height:'210px',width:'260px'}} className="img-fluid" />
              <p className="img-text">Wallet Address Transaction History</p>
            </a>
          </div>
          <div className="image-wrapper">
            <a href="/analyse">
              <img src={Graph_Analys} alt="Graph Analysis"  style={{height:'210px'}} className="img-fluid"  />
              <p className="img-text">Analyse Transaction History</p>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default HomePage;
