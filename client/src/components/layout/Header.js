import React from "react";
import { Navbar, Nav, Form, Button } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar bg="primary" variant="light">
      <Navbar.Brand href="#home">Hey Buddy</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#features">Features</Nav.Link>
        <Nav.Link href="#pricing">Pricing</Nav.Link>
      </Nav>
      <Form inline>
        <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
        <Button variant="outline-dark">Search</Button>
      </Form>
    </Navbar>
  );
};

export default Header;
