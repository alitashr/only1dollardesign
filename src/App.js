import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './App.css';
import HomePage from './components/HomePage';
import FAQ from './components/FAQ';
import Layout from './components/Layout';

class App extends Component {
  render(){
    return (
      <div>
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/faq" component={FAQ} />
          
      </Router>        
      </div>
    );
  }
  
}

export default App;
