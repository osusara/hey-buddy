import React from "react";
import { Navbar, Nav, Form, Button, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Header = ({ logout, auth: { isAuthenticated, loading } }) => {
  const authLinks = (
    <Nav className="ml-2">
      <Nav.Link className="my-auto" href="/profile">Profile</Nav.Link>
      <Nav.Link className="my-auto" href="/post">Posts</Nav.Link>
      <Nav.Link href="/login" onClick={logout}>
        <Button variant="dark">
          <i className="text-primary fas fa-power-off"></i>
        </Button>
      </Nav.Link>
    </Nav>
  );

  const guestLinks = (
    <Nav className="ml-2">
      <Nav.Link href="/login">Login</Nav.Link>
      <Nav.Link href="/register">Sign Up</Nav.Link>
    </Nav>
  );

  return (
    <Navbar bg="primary" expand="lg" variant="light" className="shadow-sm">
      <Navbar.Brand href="/">Hey, Buddy!</Navbar.Brand>
      <Navbar.Toggle className="btn" aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Form className="ml-auto">
          <Row>
            <Col md={9} xs={9} style={{ paddingRight: "0" }}>
              <Form.Control type="text" placeholder="Search" />
            </Col>
            <Col
              md={3}
              xs={3}
              style={{ paddingLeft: "5px" }}
              className="my-auto"
            >
              <Button>
                <i className="fas fa-search"></i>
              </Button>
            </Col>
          </Row>
        </Form>
        {!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}
      </Navbar.Collapse>
    </Navbar>
  );
};

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);
