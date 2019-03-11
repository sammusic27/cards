import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/app.css';

import React  from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { App } from './app.jsx';

ReactDOM.render(
  <App />,
  document.getElementById('main')
);
