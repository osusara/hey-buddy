import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../../../actions/auth";

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  if(isAuthenticated)
    return <Redirect to="/" />

  return (
    <Container fluid={true}>
      <Row className="full-hight">
        <Col lg={4} md={8} sm={10} xs={12} className="m-auto">
          <Card className="bg-primary shadow-sm p-3">
            <Card.Body className="text-center">
              <Card.Title className="text-dark">
                <h2>Sign In Buddy</h2>
                <hr className="hr-width mx-auto" />
              </Card.Title>
              <Form onSubmit={(e) => onSubmit(e)}>
                <Form.Group>
                  <Form.Control
                    className="shadow-sm text-center"
                    placeholder="Email Address"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => onChange(e)}
                    required
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    className="shadow-sm text-center"
                    placeholder="New Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => onChange(e)}
                    required
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Button variant="dark" type="submit" className="shadow-sm">
                    Sign In
                  </Button>
                  <p className="mt-2">
                    Not a Buddy Yet?{" "}
                    <Link to="/register" className="text-dark">
                      Sign Up
                    </Link>
                  </p>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login);
