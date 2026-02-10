import React from 'react';
import {Router, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { routes} from './routes';
import Navbar from "./components/NavBar";
import { ToastProvider } from './components/ui/ToastContext';

const history = createBrowserHistory();


function App() {
  return (
      <Router history={history}>
        <ToastProvider>
          <Navbar />
          <Switch>
              {routes}
          </Switch>
        </ToastProvider>
      </Router>);
}

export default App
