import React, { useContext, useEffect } from "react";
import { Col } from "react-bootstrap";
import { WholeContext } from "../App";

import { CategoryTitle } from "./StyledComponents";
import Thankyou from "./Thankyou";

const ThankyouPage = () => {
  const checkoutContext = useContext(WholeContext);

  let cartDispatch = checkoutContext.dispatch;

  const emptyCart = () => {
    var newCart = [];
    window.sessionStorage.setItem("cart", JSON.stringify(newCart));
    cartDispatch({
      type: "set_cart",
      payload: newCart,
    });
  };
  useEffect(() => {
    emptyCart();
  }, []);

  return (
    <Col lg={{ span: 8, offset: 2 }} md={{ span: 8, offset: 2 }} sm={{ span: 8, offset: 1 }} xm={12}>
      <CategoryTitle marginbottom="2em" text={"Thank you"} />

      <Thankyou></Thankyou>
    </Col>
  );
};

export default ThankyouPage;
