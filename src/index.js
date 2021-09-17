import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Game';
import Clicker from './Clicker'
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
    <Route path="/clicker">
      <Clicker />
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