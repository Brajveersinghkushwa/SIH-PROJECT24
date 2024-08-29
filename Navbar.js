import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom'; // Import Outlet
import './Navbar.css'; // Adjust the path as needed
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Crypto_logo from './Media/Crypto_logo.jpg';

function CustomNavbar() {
  return (
    <div>
      <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="navbar-custom">
        <Container>
        <img src={Crypto_logo} alt="Transaction" height={'60px'} width={'60px'}  />
          <BootstrapNavbar.Brand href="/" className="mr-auto" >CryptoTrackr</BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link href="/" className="nav-link">HOME</Nav.Link>
              <Nav.Link href="/history" className="nav-link">HISTORY</Nav.Link>
              <Nav.Link href="/analyse" className="nav-link">ANALYSE</Nav.Link>
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
      <main>
        <Outlet /> {/* This is where nested routes will render */}
      </main>
    </div>
  );
}

export default CustomNavbar;
