import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";

import { Form } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { downloadLinkPrefix, getApiKey, paypalProvider } from "../../api/appProvider";
import { WholeContext } from "../../App";
import { getCacheId, getDesignsListStr, getZipFilename, validateEmail } from "../../utils/utils";
import GeneralInfo from "../GeneralInfo";
import Input from "../Input";
import { CategoryTitle, CouponMsg } from "../StyledComponents";

const CheckoutPaypal = (props) => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [formValidation, setFormValidation] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);

  const checkoutContext = useContext(WholeContext);
  let cart = checkoutContext.state.cart;
  cart = cart ? cart : [];

  useEffect(() => {
    if (paymentComplete) {
      sendEmail(userInfo).then(() => {
        navigate("/thank");
      });
      setPaymentComplete(false);
    }
  }, [paymentComplete]);

  const handleNameChange = (e) => {
    let val = e.target.value;
    const newUserInfo = { ...userInfo, name: val };
    setUserInfo(newUserInfo);
    validateVisaCardForm(newUserInfo);
  };
  const handleEmailChange = (e) => {
    let val = e.target.value;
    const newUserInfo = { ...userInfo, email: val };
    setUserInfo(newUserInfo);
    validateVisaCardForm(newUserInfo);
  };
  const validateVisaCardForm = (userInfo) => {
    setErrorMsg("");
    let validated = false;

    if (userInfo.name && userInfo.name !== "" && userInfo.email && userInfo.email !== "") {
      if (validateEmail(userInfo.email)) {
        validated = true;
      }
    }
    if (formValidation !== validated) {
      setFormValidation(validated);
    }
  };

  const showErrorMsg = () => {
    if (!formValidation) {
      setErrorMsg("Please enter your name and email address");
    }
  };

  const sendEmail = (userInfo) => {
    return new Promise((resolve, reject) => {
      const buyer = userInfo.name.replace(/ /g, "-");
      const buyeremail = userInfo.email;
      const filename = getZipFilename(userInfo.name);
      const designArrStr = getDesignsListStr(cart);
      const cacheId = getCacheId(cart[0].thumb);
      const url =
        paypalProvider +
        "?buyer=" +
        buyer +
        "&buyeremail=" +
        buyeremail +
        "&filename=" +
        filename +
        "&cache=" +
        cacheId +
        "&key=" +
        getApiKey() +
        "&designs=" +
        designArrStr;
      axios
        .post(url)
        .then((response) => {
          const downloadLink = `${downloadLinkPrefix}${filename}.zip`;
          sessionStorage.setItem("downloadLink", downloadLink);
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: cart.length,
          },
        },
      ],
      style: {
        layout: "horizontal",
      },
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (orderData) {
      setPaymentComplete(true);
    });
  };

  return (
    <Col lg={{ span: 8, offset: 2 }} md={{ span: 8, offset: 2 }} sm={{ span: 8, offset: 1 }} xm={12}>
      <CategoryTitle text={"Checkout using Paypal"} marginbottom="2em" />

      <div style={{ margin: "auto" }} className="checkout-form-container">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Form.Group>
            <Input
              type={"text"}
              title={"Full Name"}
              name={"name"}
              value={userInfo.name}
              placeholder={"Your Name"}
              handleChange={handleNameChange}
              required
            />
            <Input
              type={"email"}
              title={"email"}
              name={"email"}
              value={userInfo.email}
              placeholder={"Email Address where designs will be sent"}
              handleChange={handleEmailChange}
              required
            />
          </Form.Group>

          <div className="errorMsg">{errorMsg !== "" ? <CouponMsg>{errorMsg}</CouponMsg> : null}</div>
          <div className="checkoutButtons">
            <div className="checkout-back-button">
              <div
                className="checkout-back-button"
                style={{ display: !formValidation ? "block" : "none" }}
                onClick={showErrorMsg}
              >
                <div className="galaincha-buttons use-paypal-button">
                  <div className="back-button">
                    <span>Use Paypal</span>
                  </div>
                </div>
              </div>
              <div style={{ display: !formValidation ? "none" : "block" }}>
                <PayPalScriptProvider
                  options={{
                    "client-id": "AX5aiX2MSdhH3untE0-YrP67Rj133tlkRvVHy2JKHpasPHZrqQfJJGjNewPisoiNWvUGsDmUErMz0kZc",
                    //"AfwdJe28NtRL8n0tlLZMxWngJtnJZ-KN0Ep_JSYl4bRVz0EkF_99InvNtQYlWXu4eX9ys207UKBCyUvU", //sandbox
                    currency: "USD",
                  }}
                >
                  <PayPalButtons
                    fundingSource={FUNDING.PAYPAL}
                    style={{ label: "pay", height: 40 }}
                    createOrder={(data, actions) => createOrder(data, actions)}
                    onApprove={(data, actions) => onApprove(data, actions)}
                  />
                </PayPalScriptProvider>
              </div>
              <div className="checkout-back-button">
                <Link to={{ pathname: "/checkout" }} className="galaincha-buttons">
                  <div className="galaincha-buttons back-button">
                    <span>BACK TO CART</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <GeneralInfo />
        </Form>
      </div>
    </Col>
  );
};

CheckoutPaypal.propTypes = {};

export default CheckoutPaypal;
