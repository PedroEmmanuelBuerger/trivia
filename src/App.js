import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import Question from './pages/Game';
import Settings from './pages/Settings';
import Feedback from './pages/Feedback';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route path="/game" component={ Question } />
      <Route path="/settings" component={ Settings } />
      <Route path="/feedback" component={ Feedback } />
    </Switch>
  );
}
