import React from 'react';
import {Router, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { routes} from './routes';
import Navbar from "./components/NavBar";

const history = createBrowserHistory();


function App() {
  return (
      <Router history={history}>
        <Navbar />
        <Switch>
            {routes}
        </Switch>
      </Router>);
}

export default App
