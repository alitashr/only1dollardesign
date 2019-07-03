import React, {Component} from 'react';

import './App.css';
import HomePage from './components/HomePage';
import FooterBar from './components/FooterBar';
import FAQ from './components/FAQ';
import Layout from './components/Layout';

class App extends Component {
  render(){
    return (
      <div>
        <Layout>
          <HomePage/>
          <FooterBar/>          
        </Layout>
      </div>
    );
  }
  
}

export default App;
