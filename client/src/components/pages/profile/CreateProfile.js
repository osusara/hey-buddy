import React, { useState} from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createProfile } from "../../../actions/profile";

const CreateProfile = ({ createProfile, history }) => {

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    gender: "Not set",
    relationship: "Not set",
    address: "",
    interests: null,
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
    score: 10,
    privacy: false,
  });

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const {
    name,
    bio,
    gender,
    relationship,
    address,
    interests,
    facebook,
    twitter,
    instagram,
    youtube,
    privacy,
  } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history);
  }

  return (
    <Container>
      <Row>
        <Col md={8} sm={10} xs={12} className="mx-auto">
          <Card bg="primary" className="my-4">
            <Card.Body className="m-4 px-4">
              <Card.Title className="text-center">
                <h1 className="large text-dark">Create Your Profile</h1>
                <p>Let your buddies know who you are</p>
              </Card.Title>

              <Form onSubmit={(e) => onSubmit(e)}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    value={name}
                    onChange={(e) => onChange(e)}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Control
                    placeholder="About You"
                    as="textarea"
                    name="bio"
                    value={bio}
                    onChange={(e) => onChange(e)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Control
                    as="select"
                    name="gender"
                    value={gender}
                    onChange={(e) => onChange(e)}
                  >
                    <option value="Not set" hidden>
                      Your gender
                    </option>
                    <option value="Male">Male 👦</option>
                    <option value="Female">Female 👧</option>
                    <option value="Other">Other 😺</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Control
                    as="select"
                    name="relationship"
                    value={relationship}
                    onChange={(e) => onChange(e)}
                  >
                    <option value="Not set" hidden>
                      Relationship Status
                    </option>
                    <option value="Still Single">Still single 😉</option>
                    <option value="In a relationship">
                      In a relationship 😍
                    </option>
                    <option value="Engaged">Engaged 🥰</option>
                    <option value="Married">Married 😚</option>
                    <option value="It's Complicated">
                      It's Complicated 🤔
                    </option>
                    <option value="Single forever">Single forever 😎</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="From Where?"
                    name="address"
                    value={address}
                    onChange={(e) => onChange(e)}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Interests or Hobbies?"
                    name="interests"
                    value={interests}
                    onChange={(e) => onChange(e)}
                  />
                  <small className="text-secondary"> Comma separated</small>
                </Form.Group>

                <Form.Group>
                  <Button
                    onClick={() => toggleSocialInputs(!displaySocialInputs)}
                    type="button"
                    className="btn-info"
                  >
                    Add Your Social Links{" "}
                    <i
                      className={`fas fa-caret-${
                        displaySocialInputs ? "up" : "down"
                      }`}
                    ></i>
                  </Button>
                </Form.Group>

                {displaySocialInputs && (
                  <>
                    <Form.Group as={Row} className="social-input">
                      <Form.Label column sm={1} xs={2} className="text-center">
                        <i className="fab fa-facebook fa-2x"></i>
                      </Form.Label>
                      <Col sm={11} xs={10}>
                        <Form.Control
                          type="text"
                          placeholder="Facebook Username"
                          name="facebook"
                          value={facebook}
                          onChange={(e) => onChange(e)}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="social-input">
                      <Form.Label column sm={1} xs={2} className="text-center">
                        <i className="fab fa-twitter fa-2x"></i>
                      </Form.Label>
                      <Col sm={11} xs={10}>
                        <Form.Control
                          type="text"
                          placeholder="Twitter Username"
                          name="twitter"
                          value={twitter}
                          onChange={(e) => onChange(e)}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="social-input">
                      <Form.Label column sm={1} xs={2} className="text-center">
                        <i className="fab fa-instagram fa-2x"></i>
                      </Form.Label>
                      <Col sm={11} xs={10}>
                        <Form.Control
                          type="text"
                          placeholder="Instagram Username"
                          name="instagram"
                          value={instagram}
                          onChange={(e) => onChange(e)}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="social-input">
                      <Form.Label column sm={1} xs={2} className="text-center">
                        <i className="fab fa-youtube fa-2x"></i>
                      </Form.Label>
                      <Col sm={11} xs={10}>
                        <Form.Control
                          type="text"
                          placeholder="YouTube Username"
                          name="youtube"
                          value={youtube}
                          onChange={(e) => onChange(e)}
                        />
                      </Col>
                    </Form.Group>
                  </>
                )}

                <Form.Check
                  label="Private Account"
                  type="checkbox"
                  name="privacy"
                  checked={privacy}
                  onChange={e => setFormData({ ...formData, [e.target.name]: e.target.checked })}
                />

                <Form.Group className="mt-3">
                  <Button type="submit" className="btn-dark mr-1">
                    Save
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
};

export default connect(null, { createProfile })(withRouter(CreateProfile));
