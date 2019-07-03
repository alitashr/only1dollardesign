import React, { Component } from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import logo from '../images/logo.png';
class FooterBar extends Component {
    render() {
        return (
            <div>
               <Navbar bg="light" expand="sm" fixed="bottom">   
                <Navbar.Brand href="#home" id="logoarea" className="pull-left"><img src={logo} alt="logo"/> </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                    <Nav.Link href="/">Designs</Nav.Link>
                    <Nav.Link href="/faq">FAQ</Nav.Link>
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