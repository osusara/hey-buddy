import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../../actions/profile";
import Spinner from "../../layout/Spinner";

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
    <>
      <h1>Profile</h1>
      <p>
        <i className="fas fa-user"></i> Welcome {user && user.username}
      </p>
      {profile !== null ? (
        <>Has</>
      ) : (
        <>
          <p>You have not yet setup a profile, buddy!</p>
          <Link
            to="/create-profile"
            newProfile={true}
            className="btn btn-primary my-1"
          >
            Create Profile
          </Link>
        </>
      )}
    </>
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
