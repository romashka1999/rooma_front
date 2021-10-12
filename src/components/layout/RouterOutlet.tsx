import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Main from "../../pages/Main";
import Room from "../../pages/Room";

const RouterOutlet = () => {
  return (
    <div className="flex justify-center items-center bg-secondary h-screen">
      <Router>
        <Switch>
          <Route path="/main">
            <Main />
          </Route>
          <Route path="/rooms/:roomId">
            <Room />
          </Route>
          <Route path="/*">
            <Redirect to="/main" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default RouterOutlet;
