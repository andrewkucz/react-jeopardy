import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Game';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

const Index = () => {
  return <Router basename={process.env.PUBLIC_URL}>
  <Switch>
    <Route exact path="/">
      <Game />
    </Route>
  </Switch>
</Router>
}

ReactDOM.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>,
  document.getElementById('root')
);