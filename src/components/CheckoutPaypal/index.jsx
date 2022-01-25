import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";

import { Form } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import AppNewProvider, { getApiKey, paymentProvider } from "../../api/appProvider";
import { WholeContext } from "../../App";
import { getCacheId, getDesignName, getDesignsListStr, getZipFilename, validateEmail } from "../../utils/utils";
import GeneralInfo from "../GeneralInfo";
import Input from "../Input";
import { BtnLink, CategoryTitle, CheckoutButton, CouponMsg } from "../StyledComponents";

const CheckoutPaypal = (props) => {
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [formValidation, setFormValidation] = useState(false);
  const [hidePaymentButtonImage, setHidePaymentButtonImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isIframeFirstLoad, setIsIframeFirstLoad] = useState(true);

  const checkoutContext = useContext(WholeContext);
  let cart = checkoutContext.state.cart;
  cart = cart ? cart : [];

  function getJsonFromUrl(url) {
    if (!url) url = window.location.search;
    var query = url.substr(1);
    var result = {};
    query.split("&").forEach(function (part) {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }

  useEffect(() => {
    if (!formValidation) {
      setHidePaymentButtonImage(false);
    } else {
      if (isIframeFirstLoad) {
        setTimeout(() => {
          setIsIframeFirstLoad(false);
          setHidePaymentButtonImage(true);
        }, 3000);
      } else {
        setHidePaymentButtonImage(true);
      }
    }
  }, [formValidation]);

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

  const checkOutAction = () => {
    var itemList = "";
    cart.forEach((element, index) => {
      let i = index + 1;
      itemList += "&item_name_" + i + "=" + getDesignName(element.design) + "&amount_" + i + "=1";
    });

    //sendEmail(userInfo);
    sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    console.log("checkOutAction -> userInfo", userInfo, cart);
    //window.location = "http://localhost:3000/index.html#/payment";

    //for now
    // itemList =
    //   itemList !== ""
    //     ? itemList
    //     : "&item_name_1=Lunazoph&amount_1=1" +
    //       "&item_name_2=Mechanic&amount_2=1" +
    //       "&item_name_3=Wiros Egolox&amount_3=1";

    var link =
      "https://www.paypal.com/cgi-bin/webscr?currency_code=USD&cmd=_cart&upload=1&business=sb-nemls7012451@business.example.com&lc=US&notify_url=http%3a%2f%2fwww%2eonly1dollardesign%2ecom%2fipn%2ephp" +
      itemList +
      //"&custom=543a385a-cbe8-4aae-bd17-a06e31cc8e93"+
      "&button_subtype=services&no_note=1&no_shipping=1&rm=1" +
      "&return=http%3a%2f%2fwww%2eonly1dollardesigns%2ecom%2fpayment" +
      "&cancel_return=http%3a%2f%2fwww%2eonly1dollardesign%2ecom%2fhelp&bn=PP%2dBuyNowBF%3abtn_buynow_LG%2egif%3aNonHosted";
    console.log(link);

    window.location = link;
  };

  const sendEmail = (userInfo) => {
    console.log("sendEmail -> userInfo", userInfo);
    return new Promise((resolve, reject) => {
      const buyer = userInfo.name.replace(/ /g, "-");
      const buyeremail = userInfo.email;

      const filename = getZipFilename(userInfo.name);
      const designArrStr = getDesignsListStr(cart);

      const cacheId = getCacheId(cart[0].thumb);

      const url =
        "https://alternative.com.np/atcurrency/sendemail1dol.php?buyer=" +
        buyer +
        "&buyeremail=" +
        buyeremail +
        "&filename=" +
        filename +
        "&cache=" +
        cacheId +
        "&designs=" +
        designArrStr;
      console.log("returnnewPromise -> url", url);

      //https://only1dollardesigns.com/sendemail.php?buyer=alita-shrestha&buyeremail=alita@explorug.net&filename=shrestha230292&cache=AF802D76625EA3B4066EC8241EB98997&designs=Abstract/Nimrite%7CDesigners-Collection/Ageicent%7CAbstract/Heliolood%7CAbstract/Axiomio
      axios
        .post(url)
        .then((response) => {
          console.log("data after sendemail", response.data);
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
      console.log("orderData", orderData);
      sendEmail(userInfo);
      //setdesignFinalUploading('paypal');
      //onPaymentSuccess();
    });
  };

  return (
    <Col lg={{ span: 8, offset: 2 }} md={{ span: 8, offset: 2 }} sm={{ span: 8, offset: 1 }} xm={12}>
      <CategoryTitle text={"Checkout using Paypal"} marginbottom="2em" />

      <div style={{ margin: "auto" }} className="checkout-form-container">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("form submit");
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
              {/* <CheckoutButton inlineBlock onClick={checkOutAction}>
                <strong>
                  <span>Use Paypal</span>
                </strong>

                <br />
              </CheckoutButton> */}
              
              <div className="checkout-back-button" style={{ display: !hidePaymentButtonImage ? "block" : "none" }}
               onClick={showErrorMsg}
               >
                <div className="galaincha-buttons">
                  <div className="galaincha-buttons back-button">
                    <span>Use Paypal</span>
                  </div>
                </div>
              </div>
              <div style={{ display: !hidePaymentButtonImage ? "none" : "block" }}>
                <PayPalScriptProvider
                  options={{
                    "client-id": "AfwdJe28NtRL8n0tlLZMxWngJtnJZ-KN0Ep_JSYl4bRVz0EkF_99InvNtQYlWXu4eX9ys207UKBCyUvU",
                    currency: "USD",
                    // ,
                    // "disable-funding": "credit,card"
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

              {/* <BtnLink to={{ pathname: "/checkout" }}>
              <CheckoutButton inlineBlock bgColor="#ccc" bgColorHover="#ccc" bgHoverText="#323232">
                <strong>
                  <span>
                    BACK TO
                    <br />
                    CART
                  </span>
                </strong>
              </CheckoutButton>
            </BtnLink> */}
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
