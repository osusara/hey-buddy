import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import spinner from "../../assets/spinner.gif";

export default () => (
  <Row className="m-auto">
    <Col md={3} sm={6} xs={10} className="m-auto">
      <Image className="m-auto p-1" src={spinner} alt="Loading..." />
    </Col>
  </Row>
);
