import React from 'react';
import { Container } from "react-bootstrap";
import { Link } from 'react-router-dom';

const ProfileActions = () => {
    return (
      <Container className="text-center">
        <Link to="/edit-profile" className="btn btn-dark m-1">
          <i className="fas fa-user"></i>
          {" "} Edit Profile
        </Link>
        <Link to="/buddies" className="btn btn-dark m-1">
          <i className="fas fa-users"></i>
          {" "} Your Buddies
        </Link>
      </Container>
    );
}

export default ProfileActions;