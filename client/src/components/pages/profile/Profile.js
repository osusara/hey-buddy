import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
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
            <h1> Hey! {user && user.username} </h1>
          </Card.Title>
          <Card.Text>
            {profile !== null ? (
              <>
                <ProfileActions />
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
