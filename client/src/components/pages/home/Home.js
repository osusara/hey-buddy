import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { getCurrentProfile } from "../../../actions/profile";

const Home = ({ getCurrentProfile, auth, profile }) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

    return (
        <div>
            Home
        </div>
    );
};

Home.propTypes = {
  getCurrentProfile:PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Home);
