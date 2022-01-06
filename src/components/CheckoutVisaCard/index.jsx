import React, { useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import AppNewProvider, { getApiKey, paymentProvider } from "../../api/appProvider";
import { WholeContext } from "../../App";
import { getCacheId, getDesignName, getZipFilename, validateEmail } from "../../utils/utils";
import GeneralInfo from "../GeneralInfo";
import Input from "../Input";
import { CategoryTitle, CouponMsg } from "../StyledComponents";

const CheckoutVisaCard = (props) => {
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [formValidation, setFormValidation] = useState(false);
  const [hidePaymentButtonImage, setHidePaymentButtonImage] = useState(false);
  const [isIframeFirstLoad, setIsIframeFirstLoad] = useState(true);

  const [errorMsg, setErrorMsg] = useState("");
  const [NIBLIframeSrc, setNIBLIframeSrc] = useState("");

  const checkoutContext = useContext(WholeContext);

  let cart = checkoutContext.state.cart;

  cart = cart ? cart : [];

  useEffect(() => {
    if (!cart || !cart.length) return;
    if (!userInfo || userInfo.name === "" || userInfo.email === "") return;
    const NIBLLink = NIBLcheckOutAction();
    setNIBLIframeSrc(NIBLLink);
    //setdownloadLink
  }, [cart, userInfo]);

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
  useEffect(() => {
    if (!NIBLIframeSrc) return;
    let params = getJsonFromUrl(NIBLIframeSrc);

    var designList = [];
    designList = cart.map((item) => getDesignName(item.design));

    let designPathArr = cart.map((item) => item.design);
    const cacheId = params.cacheId;
    const filename = params.filename;


    AppNewProvider.postListForEmail({
      designpathlist: JSON.stringify(designPathArr),
      itemlist: JSON.stringify(designList),
      name: userInfo.name,
      email: userInfo.email,
      cacheId: cacheId,
      zipFilename: filename,
    }).then((res) => {
      console.log("postListForEmail -> res", res);
    });
  }, [NIBLIframeSrc]);

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

  const NIBLcheckOutAction = () => {
    var designList = [];
    designList = cart.map((item) => getDesignName(item.design));
    console.log("NIBLcheckOutAction -> designList", designList);

    let designPathArr = cart.map((item) => item.design);

    const cacheId = cart && cart.length ? getCacheId(cart[0].thumb) : "";
    const filename = getZipFilename(userInfo.name);

    //let designPathArr = cart.map((item) => item.design);

    sessionStorage.setItem("downloadLink", `https://v3.explorug.com/Only1DollarDesign/${filename}.zip`);
    var link =
      paymentProvider +
      "?itemlist=" +
      JSON.stringify(designList) +
      "&designpathlist=" +
      JSON.stringify(designPathArr) +
      "&key=" +
      getApiKey() +
      "&name=" +
      userInfo.name +
      "&email=" +
      userInfo.email +
      "&cacheId=" +
      cacheId +
      "&filename=" +
      filename;

    return link;
  };

  return (
    <Col lg={{ span: 8, offset: 2 }} md={{ span: 8, offset: 2 }} sm={{ span: 8, offset: 1 }} xm={12}>
      <CategoryTitle text={"Checkout using Visa card"} marginbottom="2em" />

      <div style={{ margin: "auto" }} className="checkout-form-container">
        <Form
          onSubmit={() => {
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
            <div className="paymentButton">
              <button
                className="paymentButton-image"
                type="submit"
                // style={{ display: !formValidation ? "block" : "none" }}
                style={{ display: !hidePaymentButtonImage ? "block" : "none" }}
              >
                <img
                  src="https://explorug.com/archanastools/niblpayment/TrialPageAssets/Pay-with-card.jpg"
                  onClick={showErrorMsg}
                  alt="visa card button"
                />
              </button>

              <iframe
                src={NIBLIframeSrc}
                style={{ display: hidePaymentButtonImage ? "block" : "none" }}
                frameBorder="0"
                height="50"
                width="210"
                scrolling="no"
                seamless=""
                id="PayLink"
                className=""
                title="checkout using visa card"
              ></iframe>

              {/* <CheckoutButton
                  inlineBlock
                  onClick={gotoPayment('paypal')}>
              <strong><span>Use Paypal</span></strong>
                  <br/>
                  <span>$ {couponFormState.couponTotalAmt}.00 TOTAL</span>
              </CheckoutButton> */}
            </div>
            <div className="checkout-back-button">
              <Link to={{ pathname: "/checkout" }} className="galaincha-buttons">
                <div className="galaincha-buttons back-button">
                  <span>BACK TO CART</span>
                </div>
              </Link>
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
            </div>
          </div>

          <GeneralInfo />
        </Form>
      </div>
    </Col>
  );
};

CheckoutVisaCard.propTypes = {};

export default CheckoutVisaCard;
