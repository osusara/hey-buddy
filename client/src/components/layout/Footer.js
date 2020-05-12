import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <Container fluid={true} className="bg-primary">
      <Row className="mx-auto text-center">
        <Col md={4} xs={12}>
          <h2>Footer Column 1</h2>
          <p>
            Cards include a few options for working with images. Choose from
            appending “image caps” at either end of a card, overlaying images
            with card content, or simply embedding the image in a card.
          </p>
        </Col>
        <Col md={4} xs={12}>
          <h2>Footer Column 2</h2>
          <p>
            Cards include a few options for working with images. Choose from
            appending “image caps” at either end of a card, overlaying images
            with card content, or simply embedding the image in a card.
          </p>
        </Col>
        <Col md={4} xs={12}>
          <h2>Footer Column 3</h2>
          <p>
            Cards include a few options for working with images. Choose from
            appending “image caps” at either end of a card, overlaying images
            with card content, or simply embedding the image in a card.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;
