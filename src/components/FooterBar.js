import React, { Component } from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import logo from '../images/logo.png';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import HomePage from './HomePage';

class FooterBar extends Component {
    render() {
        return (
            
            <div>
               <Navbar bg="light" expand="sm" fixed="bottom">   
                <Navbar.Brand href="#home" id="logoarea" className="pull-left"><img src={logo} alt="logo"/> </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <Link to="/" className="nav-link">Designs</Link>
                    <Link to="/faq" className="nav-link">FAQ</Link>
                    <Nav.Link href="">Terms Of Use</Nav.Link>
                    <Nav.Link href="#cart">Your cart is empty</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                </Navbar> 
            </div>
            

        );
    }
}

export default FooterBar;