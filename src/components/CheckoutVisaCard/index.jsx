import React, { PropTypes, useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { WholeContext } from "../../App";
import { getDesignName, validateEmail } from "../../functions/utils";
import GeneralInfo from "../GeneralInfo";
import Input from "../Input";
import { BtnLink, CategoryTitle, CheckoutButton, CouponMsg } from "../StyledComponents";

const CheckoutVisaCard = (props) => {
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [formValidation, setFormValidation] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [NIBLIframeSrc, setNIBLIframeSrc] = useState("");

  const checkoutContext = useContext(WholeContext);

  let cart = checkoutContext.state.cart;

  cart = cart ? cart : [];

  useEffect(() => {
    const NIBLLink = NIBLcheckOutAction();
    console.log("useEffect -> NIBLLink", NIBLLink);
    setNIBLIframeSrc(NIBLLink);
  }, [cart, formValidation]);

  const handleNameChange = (e)=>{
    let val = e.target.value;
    const newUserInfo = {...userInfo, name: val};
    setUserInfo(newUserInfo);
    validateVisaCardForm(newUserInfo)
  }
  const handleEmailChange = (e)=>{
    let val = e.target.value;
    const newUserInfo = {...userInfo, email: val}
    setUserInfo(newUserInfo);
    validateVisaCardForm(newUserInfo)
  }
  const validateVisaCardForm=(userInfo)=>{
    setErrorMsg('')
  console.log("validateVisaCardForm -> userInfo", userInfo)
    let validated = false;

    if(userInfo.name && userInfo.name !=='' && userInfo.email && userInfo.email!=='' ){
      if(validateEmail(userInfo.email)){
        validated=true
      }
    }
  if(formValidation!==validated){
  console.log("validateVisaCardForm -> formValidation!==validated", formValidation, validated)
    
    setFormValidation(validated);}
    
  }
  // const checkFormValidation=()=>{
  //   if(validateVisaCardForm()){

  //   }
  // }
  const showErrorMsg=()=>{
    if(!formValidation){
      setErrorMsg('Please enter your name and email address');
    }
  }

  const NIBLcheckOutAction = () => {
    var itemList = "";
    console.log("cart.forEach -> cart", cart);

    cart.forEach((element, index) => {
      let i = index + 1;
      itemList += "item_name_" + i + "=" + getDesignName(element.design) + "|amount_" + i + "=1|";
    });

    //for now
    itemList =
      itemList !== ""
        ? itemList
        : "&item_name_1=Lunazoph&amount_1=1" +
          "&item_name_2=Mechanic&amount_2=1" +
          "&item_name_3=Wiros Egolox&amount_3=1";

    console.log(itemList);

    var link =
      "https://explorug.com/archanastools/niblpayment/O1DDPayNPR.aspx?itemlist=" +
      itemList +
      "&return=http%3a%2f%2fwww%2eonly1dollardesigns%2ecom%2fthank" +
      "&cancel_return=http%3a%2f%2fwww%2eonly1dollardesign%2ecom%2fhelp&bn=PP%2dBuyNowBF%3abtn_buynow_LG%2egif%3aNonHosted&name="+userInfo.name+"&email="+userInfo.email;
    return link;
    //window.location = link;
    // postToNIBL(itemList).then((status)=>{
    //     console.log(status);

    // })
    // var link = 'http://explorug.com/archanastools/niblpayment/O1DDPay.aspx?itemlist='+ itemList;
    // console.log(link)
    // window.location = link;
  };
  return (
    <Col lg={{ span: 8, offset: 2 }} md={{ span: 8, offset: 2 }} sm={{ span: 8, offset: 1 }} xm={12}>
      <CategoryTitle text={"Checkout using Visa card"} marginBottom="2em" />

      <Col sm={{ span: 6 }} style={{margin:"auto"}}>
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
          <div style={{ textAlign: "center" }}>
            
              <img
                 style={{display: !formValidation? 'block': "none"}}
                 src="https://explorug.com/archanastools/niblpayment/TrialPageAssets/Pay-with-card.jpg" onClick={showErrorMsg} alt="visa card button" />
            
              <iframe
              src={NIBLIframeSrc}
              style={{display: formValidation? 'block': "none"}}
              frameborder="0"
              height="50"
              width="210"
              scrolling="no"
              seamless=""
              id="PayLink"
              class=""
              title='checkout using visa card'
            ></iframe>

            
            
          
            {/* <CheckoutButton 
                  inlineBlock 
                  onClick={gotoPayment('paypal')}>
              <strong><span>Use Paypal</span></strong>
                  <br/>
                  <span>$ {couponFormState.couponTotalAmt}.00 TOTAL</span>
              </CheckoutButton> */}

           
          </div>
          <div>
            <Link to={{pathname:"/checkout"}}>
            <div className = "back-button"
          >
                <strong>
                  <span>
                    BACK TO
                    <br />
                    CART
                  </span>
                </strong>
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
          <GeneralInfo />
        </Form>
      </Col>
    </Col>
  );
};

CheckoutVisaCard.propTypes = {};

export default CheckoutVisaCard;
