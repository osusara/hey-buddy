import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    verify: "",
  });

  const { username, email, password, verify } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== verify) {
      console.log("Password doesn't match");
    } else {
      console.log("Success");
    }
  };

  return (
    <Container fluid={true}>
      <Row className="full-hight">
        <Col lg={4} md={8} sm={10} xs={12} className="m-auto">
          <Card className="bg-primary shadow-sm p-3">
            <Card.Body className="text-center">
              <Card.Title className="text-dark">
                <h2>Become a Buddy</h2>
                <hr className="hr-width mx-auto" />
              </Card.Title>
              <Form onSubmit={(e) => onSubmit(e)}>
                <Form.Group>
                  <Form.Control
                    className="shadow-sm text-center text-dark"
                    placeholder="Username"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => onChange(e)}
                    required
                  ></Form.Control>
                </Form.Group>
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
                  <Form.Text className="text-light">
                    Your confidential data are totaly safe buddy!
                  </Form.Text>
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
                  <Form.Control
                    className="shadow-sm text-center"
                    placeholder="Confirm Password"
                    type="password"
                    name="verify"
                    value={verify}
                    onChange={(e) => onChange(e)}
                    required
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Button variant="dark" type="submit" className="shadow-sm">
                    Sign Up
                  </Button>
                  <p className="mt-2">
                    Already a Buddy?{" "}
                    <Link to="/login" className="text-dark">
                      Login
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

export default Register;
