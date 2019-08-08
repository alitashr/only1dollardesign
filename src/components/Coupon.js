import React, {useReducer, useContext} from 'react';
import { Col, Form} from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';


import {CategoryTitle, CouponMsg, CheckoutButton, BtnLink} from './StyledComponents';
import Input from './Input';
import GeneralInfo from './GeneralInfo';

import {WholeContext} from '../App';

let errorMsgs = [ "Must match the previous entry", "Coupon code is not valid", "Not enough coupon balance to checkout", "**Please fill up the form"];

const couponForm = {
    code:'',
    name:'',
    email:'',
    retypedEmail:'',
    couponTotalAmt:0,
    errorMsg: ''
}
const formReducer = (state, action)=> {
    switch(action.type){
        case 'set_code':
            return{
                ...state,
                code:action.payload
            }
        case 'set_name':
            return{
                ...state,
                name:action.payload
        }
        case 'set_email':
            return{
                ...state,
                email:action.payload
            }
        case 'set_retypedEmail':
            return{
                ...state,
                retypedEmail:action.payload
            }
        case 'set_errorMsg':
            return{
                ...state,
                errorMsg: action.payload
            }
        default:
            return state
       
    }
}
const checkCoupon = (code, total)=>{
    return new Promise((resolve,reject)=>{
        let data = new FormData();
        data.append("action", "checkcoupon");
        data.append("id",code);
        data.append("total",total);
        axios.post('http://alternative.com.np/atcurrency/atapp.php?action=checkcoupon&id='+code+'&total='+total)
        .then(response =>{
            console.log(response)
            resolve(response.data);
        })
        .catch(error=>{
        reject(error);
        })
    })
};
const CouponForm = styled(Col)`
    margin:auto;
`
const CouponInfo = styled.div`
text-align: center;
font-size: 16px;
padding: 10px;
`

const Coupon = () => {
    const checkoutContext = useContext(WholeContext);
    
    let cart = checkoutContext.state.cart;
    let cartDispatch = checkoutContext.dispatch;

    const [state, dispatch] = useReducer(formReducer, couponForm);
    const handleCoupon =(e)=>{
        let val = e.target.value;
        console.log('value is '+ val);
        dispatch({
            type:'set_code',
            payload: val
        });
    }
    const handleName =(e)=>{
        let val = e.target.value;
        console.log('name is '+ val);
        dispatch({
            type:'set_name',
            payload: val
        });
    }
    const handleEmail =(e)=>{
        let val = e.target.value;
        console.log('value is '+ val);
        dispatch({
            type:'set_email',
            payload: val
        });
    }

    const handleEmailPaste=(e)=>{
        console.log('paste')
        e.preventDefault();
        return false;
    }
    const handleReTypedEmail =(e)=>{
        let target = e.target;
        
        let val = target.value;
        console.log('ReTypedEmail is '+ val);
        dispatch({
            type:'set_retypedEmail',
            payload: val
        });
        let err = state.email === val ? '': errorMsgs[0];
        dispatch({
            type:'set_errorMsg',
            payload: err
        });

    }
    const verifyForm=() =>{
        if(state.errorMsg!==''){
            return false;
        }
        else{
            return true
        }
    }
    const submitForm=(e)=>{
        e.preventDefault();
        console.log('form submitted');
        const formVerified = verifyForm();
        console.log('form verified ', formVerified);
        if(formVerified)
        {
            console.log(state.code, cart.length);
            checkCoupon(state.code, cart.length).then((data)=>{
                console.log(data);

            })
        }
    }
    return (
        <Col lg={{ span: 8, offset: 2 }} md={{ span: 8, offset: 2 }} sm={{ span: 8, offset: 1 }} xm={12}>
            <CategoryTitle marginBottom='2em'>
                    <span>Checkout using coupon</span>  
            </CategoryTitle>
            <CouponForm sm={{span:6}}>
            <Form onSubmit={submitForm}>
                <Form.Group>
                <Input type={'text'}
                    title= {'Your Coupon Code'} 
                    name= {'code'}
                    value={state.code} 
                    placeholder = {'Your Coupon Code'}
                    handleChange = {handleCoupon}
                    required
                    /> 
                <Input type={'text'}
                    title= {'Full Name'} 
                    name= {'name'}
                    value={state.name} 
                    placeholder = {'Your Name'}
                    handleChange = {handleName}
                    required
                    />
                <Input type={'email'}
                    title= {'email'} 
                    name= {'email'}
                    value={state.email} 
                    placeholder = {'Email Address where designs wil be sent'}
                    handleChange = {handleEmail}
                    required
                    />

                <Input type={'email'}
                    title= {'email'} 
                    name= {'email'}
                    value={state.retypedEmail} 
                    placeholder = {'Re-type Email Address'}
                    handleChange = {handleReTypedEmail}
                    onpaste={handleEmailPaste} 
                    required
                    />
                </Form.Group>
            
            <div className='couponErrorMsg'>
                {
                   state.errorMsg!==''?
                    <CouponMsg>
                    {state.errorMsg}
                    </CouponMsg>  
                    :null  
                }
            </div>
            <div style={{textAlign:"center"}}>
                <CheckoutButton 
                    inlineBlock 
                    type="submit"
                    >
                <strong><span>Use Coupon</span></strong>

                    <br/>
                    {
                        state.couponTotalAmt>0?
                        <span>$ {state.couponTotalAmt}.00 TOTAL</span>
                        : <br/>
                    }
                    
                </CheckoutButton>

                {/* <CheckoutButton 
                    inlineBlock 
                    onClick={gotoPayment('paypal')}>
                <strong><span>Use Paypal</span></strong>
                    <br/>
                    <span>$ {state.couponTotalAmt}.00 TOTAL</span>
                </CheckoutButton> */}
                <BtnLink to={{pathname: '/checkout'}}>
                    <CheckoutButton inlineBlock
                        bgColor='#ccc' 
                        bgColorHover='#ccc' 
                        bgHoverText="#323232"
                        >
                        <strong>
                        <span>
                            BACK TO
                            <br/>
                            CART
                        </span>
                        </strong>
                        
                    </CheckoutButton>
                </BtnLink>
                
            </div>
            <GeneralInfo/>
            </Form>
            </CouponForm>
       </Col>
    );
};

export default Coupon;