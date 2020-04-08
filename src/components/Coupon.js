import React, {useReducer, useContext, useEffect} from 'react';
import {Col, Form} from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';

import {CategoryTitle, CouponMsg, CheckoutButton, BtnLink} from './StyledComponents';
import Input from './Input';
import GeneralInfo from './GeneralInfo';

import {WholeContext} from '../App';

let errorMsgs = ['Must match the previous entry', 'Coupon code is not valid', 'Not enough coupon balance to checkout', '**Please fill up the form'];

const couponForm = {
  code: '',
  name: '',
  email: '',
  retypedEmail: '',
  couponTotalAmt: 0,
  errorMsg: '',
  couponSuccess: false,
};
const formReducer = (state, action) => {
  switch (action.type) {
    case 'set_code':
      return {
        ...state,
        code: action.payload,
      };
    case 'set_name':
      return {
        ...state,
        name: action.payload,
      };
    case 'set_email':
      return {
        ...state,
        email: action.payload,
      };
    case 'set_retypedEmail':
      return {
        ...state,
        retypedEmail: action.payload,
      };
    case 'set_errorMsg':
      return {
        ...state,
        errorMsg: action.payload,
      };
    case 'set_couponSuccess':
      return {
        ...state,
        couponSuccess: action.payload,
      };
    case 'set_couponTotalAmt':
      return {
        ...state,
        couponTotalAmt: action.payload,
      };
    case 'set_formData':
      return {
        ...state,
        code: action.payload.code,
        name: action.payload.name,
        email: action.payload.email,
        retypedEmail: action.payload.retypedEmail,
      };
    default:
      return state;
  }
};
const checkCoupon = (code, total) => {
  return new Promise((resolve, reject) => {
    axios
      .post('http://alternative.com.np/atcurrency/atapp.php?action=checkcoupon&id=' + code + '&total=' + total)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
const CouponForm = styled(Col)`
  margin: auto;
`;
const CouponSuccess = styled(CouponForm)`
  text-align: center;
  font-size: 1em;
  padding: 10px;
  line-height: 2;
  & > div {
    font-size: 1.2em;
    margin: 15px;
  }
  & > div > span {
    font-size: 0.9em;
  }
  & .thanku {
    font-size: 2em;
  }
`;

const Coupon = () => {
  const checkoutContext = useContext(WholeContext);

  let cart = checkoutContext.state.cart;
  let cartDispatch = checkoutContext.dispatch;

  const [couponFormState, dispatch] = useReducer(formReducer, couponForm);

  useEffect(() => {
    if (couponFormState.code !== '') {
      checkCoupon(couponFormState.code, 0).then((response) => {
        if (response.state) {
          //coupon valid
          dispatch({
            type: 'set_couponTotalAmt',
            payload: response.value,
          });
        }
      });
    }
  }, [couponFormState.code]);
  useEffect(() => {
    var formData = window.sessionStorage.getItem('couponFormdata') || '';

    if (formData !== '') {
      console.log(formData);
      var jsonData = JSON.parse(formData);
      dispatch({
        type: 'set_formData',
        payload: jsonData,
      });
    }
  }, []);
  const handleCoupon = (e) => {
    let val = e.target.value;
    console.log('value is ' + val);
    dispatch({
      type: 'set_code',
      payload: val,
    });
  };
  const handleName = (e) => {
    let val = e.target.value;
    console.log('name is ' + val);
    dispatch({
      type: 'set_name',
      payload: val,
    });
  };
  const handleEmail = (e) => {
    let val = e.target.value;
    console.log('value is ' + val);
    dispatch({
      type: 'set_email',
      payload: val,
    });
  };

  const handleEmailPaste = (e) => {
    console.log('paste');
    e.preventDefault();
    return false;
  };
  const handleReTypedEmail = (e) => {
    let target = e.target;

    let val = target.value;
    dispatch({
      type: 'set_retypedEmail',
      payload: val,
    });
    let err = couponFormState.email === val ? '' : errorMsgs[0];
    dispatch({
      type: 'set_errorMsg',
      payload: err,
    });
  };
  const verifyForm = () => {
    if (couponFormState.errorMsg !== '') {
      return false;
    } else {
      return true;
    }
  };
  const buyFromCoupon = (code, total) => {
    return new Promise((resolve, reject) => {
      const buyer = couponFormState.name.replace(/ /g, '-');
      console.log('sendEmail -> buyer', buyer);
      const buyeremail = couponFormState.email;
      console.log('sendEmail -> buyeremail', buyeremail);

      const filename = getZipFilename(couponFormState.name);
      console.log(cart);
      const designArrStr = getDesignsListStr(cart);

      const cacheId = getCacheId(cart[0].fullDesign);
      console.log(cacheId);
      //https://only1dollardesigns.com/sendemail.php?buyer=alita-shrestha&buyeremail=alita@explorug.net&filename=shrestha230292&cache=AF802D76625EA3B4066EC8241EB98997&designs=Abstract/Nimrite%7CDesigners-Collection/Ageicent%7CAbstract/Heliolood%7CAbstract/Axiomio
      //https://alternative.com.np/atcurrency/atPayPal-Coupon.php?action=checkcoupon&id=ATPADMA&total=0&buyer=alita-shrestha&buyeremail=alita@explorug.net&filename=shrestha230292&cache=AF802D76625EA3B4066EC8241EB98997&designs=Nimrite&card=coupon
      axios
        .post(
          'https://alternative.com.np/atcurrency/atPayPal-Coupon.php?action=checkcoupon&id=' +
            code +
            '&total=' +
            total +
            '&buyer=' +
            buyer +
            '&buyeremail=' +
            buyeremail +
            '&filename=' +
            filename +
            '&cache=' +
            cacheId +
            '&designs=' +
            designArrStr +
            '&card=coupon'
        )
        .then((response) => {
            console.log(response)
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const submitForm = (e) => {
    e.preventDefault();
    const formVerified = verifyForm();
    console.log('form verified ', formVerified);
    if (formVerified) {
        buyFromCoupon(couponFormState.code, cart.length).then((data) => {
        console.log(data);
        let response = data;

        if (response.state) {
          dispatch({
            type: 'set_couponSuccess',
            payload: response.state,
          });
          emptyCart();
          storeFormInSession();
          dispatch({
            type: 'set_couponTotalAmt',
            payload: response.value,
          });
        } else {
          //payment unsuccessful
          const errVal = response.state ? errorMsgs[2] : errorMsgs[1];
          dispatch({
            type: 'set_errorMsg',
            payload: errVal,
          });
        }
      });
    }
  };
  const emptyCart = () => {
    var newCart = [];
    window.sessionStorage.setItem('cart', JSON.stringify(newCart));
    cartDispatch({
      type: 'set_cart',
      payload: newCart,
    });
  };
  const storeFormInSession = () => {
    var store = {
      code: couponFormState.code,
      name: couponFormState.name,
      email: couponFormState.email,
      retypedEmail: couponFormState.retypedEmail,
    };
    window.sessionStorage.setItem('couponFormdata', JSON.stringify(store));
  };
  const getZipFilename = (buyerName) => {
    let randomNum = Math.round(Math.random() * 10000000000);
    let buyerStr = buyerName.replace(/ /g, '');
    let filename = buyerStr + randomNum; //"shrestha230292";
    return filename;
  };
  
  const sendEmail = (couponFormState) => {
    console.log(couponFormState.name);
    return new Promise((resolve, reject) => {
      const buyer = couponFormState.name.replace(/ /g, '-');
      console.log('sendEmail -> buyer', buyer);
      const buyeremail = couponFormState.email;
      console.log('sendEmail -> buyeremail', buyeremail);

      const filename = getZipFilename(couponFormState.name);
      console.log(cart);
      const designArrStr = getDesignsListStr(cart);

      const cacheId = getCacheId(cart[0].fullDesign);
      console.log(cacheId);
      //https://only1dollardesigns.com/sendemail.php?buyer=alita-shrestha&buyeremail=alita@explorug.net&filename=shrestha230292&cache=AF802D76625EA3B4066EC8241EB98997&designs=Abstract/Nimrite%7CDesigners-Collection/Ageicent%7CAbstract/Heliolood%7CAbstract/Axiomio
      axios
        .post('http://alternative.com.np/atcurrency/sendemail1dol.php?buyer=' + buyer + '&buyeremail=' + buyeremail + '&filename=' + filename + '&cache=' + cacheId + '&designs=' + designArrStr)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const getDesignsListStr = (cart) => {
    let designArrStr = '';
    cart.forEach((element) => {
      let design = element.design.replace('Designs/', '').replace('.ctf', '');
      designArrStr += design + '|';
    });
    const lastBarPos = designArrStr.lastIndexOf('|');
    designArrStr = designArrStr.substr(0, lastBarPos);
    designArrStr = designArrStr.replace(/ /g, '-');
    console.log(designArrStr);
    return designArrStr;
  };
  const getCacheId = (designPath) => {
    const startPos = designPath.lastIndexOf('Cache/') + 6;
    const endPos = designPath.lastIndexOf('/Designs');
    const cacheId = designPath.substr(startPos, endPos - startPos);
    return cacheId;
  };
  return (
    <Col lg={{span: 8, offset: 2}} md={{span: 8, offset: 2}} sm={{span: 8, offset: 1}} xm={12}>
      <CategoryTitle text={'Checkout using coupon'} marginBottom="2em" />

      {couponFormState.couponSuccess ? (
        <CouponSuccess>
          <div>
            <span>
              PURCHASE COMPLETE
              <br />
              TOTAL PAYMENT:
            </span>
            ${cart.length}.00
          </div>
          <div className="thanku">THANK YOU!</div>
          <CouponMsg style={{fontSize: 16}}>
            You will shortly recieve an email with the download link.
            <br />
            Do not forget to check spam/junk as well
          </CouponMsg>

          <div>
            <span>COUPON BALANCE AFTER CHECKOUT</span>
            <br />${couponFormState.couponTotalAmt}.00
          </div>
        </CouponSuccess>
      ) : (
        <CouponForm sm={{span: 6}}>
          <Form onSubmit={submitForm}>
            <Form.Group>
              <Input type={'text'} title={'Your Coupon Code'} name={'code'} value={couponFormState.code} placeholder={'Your Coupon Code'} handleChange={handleCoupon} required />
              <Input type={'text'} title={'Full Name'} name={'name'} value={couponFormState.name} placeholder={'Your Name'} handleChange={handleName} required />
              <Input type={'email'} title={'email'} name={'email'} value={couponFormState.email} placeholder={'Email Address where designs will be sent'} handleChange={handleEmail} required />

              <Input
                type={'email'}
                title={'email'}
                name={'email'}
                value={couponFormState.retypedEmail}
                placeholder={'Re-type Email Address'}
                handleChange={handleReTypedEmail}
                onpaste={handleEmailPaste}
                required
              />
            </Form.Group>

            <div className="couponErrorMsg">{couponFormState.errorMsg !== '' ? <CouponMsg>{couponFormState.errorMsg}</CouponMsg> : null}</div>
            <div style={{textAlign: 'center'}}>
              <CheckoutButton inlineBlock type="submit">
                <strong>
                  <span>Use Coupon</span>
                </strong>

                <br />
                {couponFormState.couponTotalAmt > 0 ? <span>$ {couponFormState.couponTotalAmt}.00 TOTAL</span> : <br />}
              </CheckoutButton>

              {/* <CheckoutButton 
                    inlineBlock 
                    onClick={gotoPayment('paypal')}>
                <strong><span>Use Paypal</span></strong>
                    <br/>
                    <span>$ {couponFormState.couponTotalAmt}.00 TOTAL</span>
                </CheckoutButton> */}
              <BtnLink to={{pathname: '/checkout'}}>
                <CheckoutButton inlineBlock bgColor="#ccc" bgColorHover="#ccc" bgHoverText="#323232">
                  <strong>
                    <span>
                      BACK TO
                      <br />
                      CART
                    </span>
                  </strong>
                </CheckoutButton>
              </BtnLink>
            </div>
            <GeneralInfo />
          </Form>
        </CouponForm>
      )}
    </Col>
  );
};

export default Coupon;
