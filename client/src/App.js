import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";

// Components
import Notification from "./components/layout/Notification";
import Header from "./components/layout/Header";
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import Footer from "./components/layout/Footer";

// Redux
import { Provider } from "react-redux";
import store from "./store";

// Styles
import "./App.css";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Container fluid={true} className="bg-light">
          <Notification />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </Switch>
        </Container>
        <Footer />
      </Router>
    </Provider>
  );
};

export default App;
