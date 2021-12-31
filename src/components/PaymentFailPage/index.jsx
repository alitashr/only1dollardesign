import React, { PropTypes } from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CategoryTitle } from "../StyledComponents";

const PaymentFailPage = (props) => {
  return (
    <Col lg={{ span: 8, offset: 2 }} md={{ span: 8, offset: 2 }} sm={{ span: 8, offset: 1 }} xm={12}>
      <CategoryTitle marginbottom="2em" text={"Transaction Failed"} />

      <div className="payment-fail-text">
        Please make sure that the following conditions are satisfied:
        <ul>
          <li>Your card details (Card Number, Expiry Date, Card Holder's Name) are correct</li>
          <li>You are using Visa card (not other cards like Master card)</li>
          <li>Your card is enabled for online transactions</li>
        </ul>
        <div>
          <Link to={{ pathname: "/checkout" }} className="galaincha-buttons try-again">
            <div className="galaincha-buttons">Try again</div>
          </Link>
        </div>
      </div>
    </Col>
  );
};

PaymentFailPage.propTypes = {};

export default PaymentFailPage;
