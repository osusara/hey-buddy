import React from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../../layout/Spinner";

const Home = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <h1>Home</h1>
    </>
  );
};

Home.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {})(Home);
