import React, { useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import logo from "../images/logo.png";
import { NavBar, NavbarBrand, BasicNavbarNav, NavLink, NavLinkP, NavCart } from "./StyledComponents";

import { WholeContext } from "../App";

const FooterBar = (props) => {
  const checkoutContext = useContext(WholeContext);
  let cart = checkoutContext.state.cart;
  const { openTou } = props;
  return (
    <div>
      <NavBar expand="md" fixed="bottom" background="#fff">
        <NavbarBrand href="/" pullleft="true">
          <img src={logo} alt="logo" />
        </NavbarBrand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <BasicNavbarNav>
          <Nav className="mr-auto">
            <NavLink href="/">Designs</NavLink>
            <NavLink href="#/faq">FAQ</NavLink>
            <NavLink href="" onClick={openTou}>
              Terms Of Use
            </NavLink>
            {cart.length ? (
              <NavLinkP background="#B398CE" to={{ pathname: "/checkout" }}>
                <NavCart>
                  <div>
                    <span style={{ fontSize: 16 }}>$ {cart.length}.00</span>
                    <div style={{ fontSize: 11 }}>Total</div>
                  </div>
                </NavCart>
              </NavLinkP>
            ) : (
              <NavLink disabled>
                <span>Your cart is empty</span>
              </NavLink>
            )}
          </Nav>
        </BasicNavbarNav>
      </NavBar>
    </div>
  );
};

export default FooterBar;
