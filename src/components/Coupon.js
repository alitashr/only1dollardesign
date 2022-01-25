import React, {useReducer, useContext, useEffect, useState} from 'react';
import {Col, Form} from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';

import {CategoryTitle, CouponMsg, CheckoutButton, BtnLink} from './StyledComponents';
import Input from './Input';
import GeneralInfo from './GeneralInfo';

import {WholeContext} from '../App';
import Thankyou from './Thankyou';
import { getCacheId, getDesignsListStr } from '../utils/utils';
import { getApiKey } from '../api/appProvider';

let errorMsgs = ['Must match the previous entry', 'Coupon code is not valid', 'Not enough coupon balance to checkout', '**Please fill up the form', 'Coupon has been expired'];

let couponErrorMsgs = ['Coupon code is not valid', 'Not enough coupon balance to checkout','Coupon has been expired'];

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
      .post('https://alternative.com.np/atcurrency/atapp.php?action=checkcoupon&id=' + code + '&total=' + total)
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

const Coupon = () => {
  const checkoutContext = useContext(WholeContext);

  let cart = checkoutContext.state.cart;
  let cartDispatch = checkoutContext.dispatch;

  const [couponFormState, dispatch] = useReducer(formReducer, couponForm);
  const [designsCount, setDesignsCount]  = useState(cart.length);
  const [downloadLink, setDownloadLink]  = useState('');
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (couponFormState.code !== '') {
      checkCoupon(couponFormState.code, 0).then((response) => {
        if (response.state) {
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
      var jsonData = JSON.parse(formData);
      dispatch({
        type: 'set_formData',
        payload: jsonData,
      });
    }
  }, []);
  const handleCoupon = (e) => {
    let val = e.target.value;
    dispatch({
      type: 'set_code',
      payload: val,
    });
  };
  const handleName = (e) => {
    let val = e.target.value;
    dispatch({
      type: 'set_name',
      payload: val,
    });
  };
  const handleEmail = (e) => {
    let val = e.target.value;
    dispatch({
      type: 'set_email',
      payload: val,
    });
  };

  const handleEmailPaste = (e) => {
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
      const buyeremail = couponFormState.email;

      const filename = getZipFilename(couponFormState.name);
      const designArrStr = getDesignsListStr(cart);
      sessionStorage.setItem('designArrStr', designArrStr);
      const cacheId = getCacheId(cart[0].thumb);
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
            "&key=" +
            getApiKey() +
            '&designs=' +
            designArrStr +
            '&card=coupon'
        )
        .then((response) => {
            console.log(".then -> response", response)
            const downloadLink = `https://v3.explorug.com/Only1DollarDesign/${filename}.zip`;
          sessionStorage.setItem("downloadLink", downloadLink);
          setDownloadLink(downloadLink)
   
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
    if (formVerified) {
        buyFromCoupon(couponFormState.code, cart.length).then((data) => {
        let response = data;

        if (response.state) {
          dispatch({
            type: 'set_couponSuccess',
            payload: response.state,
          });
          //couponTotalAmt
          sessionStorage.setItem('couponTotalAmt', couponFormState.couponTotalAmt);
          sessionStorage.setItem('designsCount', cart.length);
         
         // sessionStorage.setItem('downloadLink', response.name);
          setDesignsCount(cart.length);
          //setDownloadLink(response.name)

          emptyCart();
          storeFormInSession();
          dispatch({
            type: 'set_couponTotalAmt',
            payload: response.value,
          });
        } else {
          //payment unsuccessful
          //response.value = 0; coupon not valid
          // = 1; balanace not enough
          // 2: coupon expired
          const errVal = response.value ? couponErrorMsgs[1] : response.value === 0 ? couponErrorMsgs[0]:couponErrorMsgs[2];
          // dispatch({
          //   type: 'set_errorMsg',
          //   payload: errVal,
          // });
          setCouponError(errVal)
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
    return new Promise((resolve, reject) => {
      const buyer = couponFormState.name.replace(/ /g, '-');
      const buyeremail = couponFormState.email;
   
      const filename = getZipFilename(couponFormState.name);
      const designArrStr = getDesignsListStr(cart);

      const cacheId = getCacheId(cart[0].thumb);
      //https://only1dollardesigns.com/sendemail.php?buyer=alita-shrestha&buyeremail=alita@explorug.net&filename=shrestha230292&cache=AF802D76625EA3B4066EC8241EB98997&designs=Abstract/Nimrite%7CDesigners-Collection/Ageicent%7CAbstract/Heliolood%7CAbstract/Axiomio
      axios
        .post('https://alternative.com.np/atcurrency/sendemail1dol.php?buyer=' + buyer + '&buyeremail=' + buyeremail + '&filename=' + filename + '&cache=' + cacheId + '&designs=' + designArrStr)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <Col lg={{span: 8, offset: 2}} md={{span: 8, offset: 2}} sm={{span: 8, offset: 1}} xm={12}>
      <CategoryTitle text={'Checkout using coupon'} marginbottom="2em" />
      
      {couponFormState.couponSuccess ? (
        <Thankyou 
        method = {"coupon"}
        designsCount = {designsCount}
        couponTotalAmt = {couponFormState.couponTotalAmt}
        downloadLink = {downloadLink}
        ></Thankyou>
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
            <div className="couponErrorMsg">
              { couponError !== '' && 
                <CouponMsg>{couponError}</CouponMsg> 
              }</div>
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
