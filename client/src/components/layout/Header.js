import React from "react";
import { Navbar, Nav, Form, Button, Row, Col } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar bg="primary" expand="lg" variant="light" className="shadow-sm">
      <Navbar.Brand href="/">Hey Buddy</Navbar.Brand>
      <Navbar.Toggle className="btn" aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Form className="ml-auto">
          <Row>
            <Col md={8} xs={8} style={{ paddingRight: "0" }}>
              <Form.Control type="text" placeholder="Search" />
            </Col>
            <Col md={4} xs={4} style={{ paddingLeft: "5px" }} className="my-auto">
              <Button variant="dark">Search</Button>
            </Col>
          </Row>
        </Form>
        <Nav className="ml-2">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#link">Link</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
