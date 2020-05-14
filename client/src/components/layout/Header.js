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
            <Col md={9} xs={9} style={{ paddingRight: "0" }}>
              <Form.Control type="text" placeholder="Search" />
            </Col>
            <Col md={3} xs={3} style={{ paddingLeft: "5px" }} className="my-auto">
              <Button><i className="fas fa-search"></i></Button>
            </Col>
          </Row>
        </Form>
        <Nav className="ml-2">
          <Nav.Link href="#home">Profile</Nav.Link>
          <Nav.Link href="#link">Sign Out</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
