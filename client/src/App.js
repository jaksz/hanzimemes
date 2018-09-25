import React, { Component } from "react";
import { Container } from "reactbulma";
import Header from "./Header";
import Hanzi from "./Hanzi";
import { Switch, Route, Router } from "react-router-dom";
import history from "./history";

export default class App extends Component {
  state = {};

  async componentDidMount() {}

  render() {
    return (
      <div>
        <Router history={history}>
          <Container>
            <Header />
            <Switch>
              <Route
                path="/hanzi/:hanzi"
                children={props => <Hanzi {...props} />}
              />
            </Switch>
          </Container>
        </Router>
      </div>
    );
  }
}
