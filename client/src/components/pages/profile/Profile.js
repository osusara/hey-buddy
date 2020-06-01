import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../../actions/profile";
import Spinner from "../../layout/Spinner";
import ProfileActions from "./ProfileActions";

const Profile = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Container>
      <Card className="my-4" bg="primary">
        <Card.Body>
          <Card.Title className="text-center text-dark">
            <h3> Hey! {user && user.username} </h3>
          </Card.Title>
          <Card.Text>
            {profile !== null ? (
              <>
                <ProfileActions />
                <Row>
                  <Col md={12} className="text-center">
                    <h1>{profile.name}</h1>
                    <p>{profile.bio}</p>
                  </Col>
                  <Col md={4}>
                    <Card bg={"dark"} className="shadow-sm text-white">
                      <Card.Body>
                        <div>
                          <b>Score</b>
                          <h2 className="text-primary">{profile.score} BPs</h2>
                        </div>
                        <div>
                          <b>privacy</b>
                          <p>{profile.privacy ? "Private" : "Public"}</p>
                        </div>
                        <div>
                          <b>Activeness</b>
                          <p>{profile.active ? "Active" : "Inactive"}</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="shadow-sm">
                      <Card.Body>
                        <div>
                          <b>Gender</b>
                          <p>{profile.gender}</p>
                        </div>
                        <div>
                          <b>City</b>
                          <p>{profile.address}</p>
                        </div>
                        <div>
                          <b>Relationship Status</b>
                          <p>{profile.relationship}</p>
                        </div>
                        <div>
                          <b>Interests</b>
                          <br />
                          {profile.interests.map((interest) => (
                            <Badge className="mr-2" variant="dark">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="shadow-sm">
                      <Card.Body>
                        <div>
                          <b>Social Links</b>
                          <br />
                          <br />

                          {profile.social ? (
                            <>
                              {profile.social.facebook ? (
                              <p>
                                <a
                                  className="text-secondary"
                                  href={`https://facebook.com/${profile.social.facebook}`}
                                  target="_blank"
                                >
                                  <i className="fab fa-facebook"></i>{" "}
                                  {profile.social.facebook}
                                </a>
                              </p>
                              ) : ('')}

                              {profile.social.twitter ? (
                              <p>
                                <a
                                  className="text-secondary"
                                  href={`https://twitter.com/${profile.social.twitter}`}
                                  target="_blank"
                                >
                                  <i className="fab fa-twitter"></i> @
                                  {profile.social.twitter}
                                </a>
                              </p>
                              ) : ('')}
                              
                              {profile.social.instagram ? (
                              <p>
                                <a
                                  className="text-secondary"
                                  href={`https://instagram.com/${profile.social.instagram}`}
                                  target="_blank"
                                >
                                  <i className="fab fa-instagram"></i>{" "}
                                  {profile.social.instagram}
                                </a>
                              </p>
                              ) : ('')}
                              
                              {profile.social.youtube ? (
                              <p>
                                <a
                                  className="text-secondary"
                                  href={`https://youtube.com/${profile.social.youtube}`}
                                  target="_blank"
                                >
                                  <i className="fab fa-youtube"></i>{" "}
                                  {profile.social.youtube}
                                </a>
                              </p>
                              ) : ('')}
                            </>
                          ) : (
                            <p>You haven't added any social link in your profile. Adding social links may help your buddies to reach you 😉</p>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <p>
                  You have not yet setup your profile, buddy! Create your
                  profile now to earn 10BPs 😉
                </p>
                <Link to="/create-profile" className="btn btn-dark my-1">
                  Create Profile
                </Link>
              </>
            )}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

Profile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Profile);
