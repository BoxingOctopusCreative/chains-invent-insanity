import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactGA from 'react-ga';

ReactGA.initialize(process.env.GA_PROPERTY_ID);
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
  <Router>
    <App />
  </Router>, 
  document.getElementById('root')
);
