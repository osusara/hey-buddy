import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile } from "../../../actions/profile";
import Spinner from "../../layout/Spinner";

const Home = ({
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
      <h1>Home</h1>
      <p>
        <i className="fas fa-user">Welcome {user && user.username}</i>
      </p>
      { profile !== null ? <>
        Has
      </> : <>
        Has not
      </>}
    </>
  );
};

Home.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Home);
