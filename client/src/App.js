import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";

// Components
import Notification from "./components/layout/Notification";
import Header from "./components/layout/Header";
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/Register";
import Footer from "./components/layout/Footer";
import Home from "./components/pages/home/Home";
import PrivateRoute from "./components/routing/PrivateRoute";

// Actions
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

// Redux
import { Provider } from "react-redux";
import store from "./store";

// Styles
import "./App.css";

// Check if user logged in
if (localStorage.token)
  setAuthToken(localStorage.token);

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Container fluid={true} className="bg-light">
          <Notification />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute exact path="/home" component={Home} />
          </Switch>
        </Container>
        <Footer />
      </Router>
    </Provider>
  );
};

export default App;
