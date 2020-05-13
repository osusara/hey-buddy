import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";

import Header from "./components/layout/Header";
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import Footer from "./components/layout/Footer";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Header />
      <Container fluid={true} className="bg-light">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </Container>
      <Footer />
    </Router>
  );
};

export default App;
