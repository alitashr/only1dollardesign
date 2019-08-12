import React, {useReducer, useContext,useEffect} from 'react';
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
    errorMsg: '',
    couponSuccess: false
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
        case 'set_couponSuccess':
            return{
                ...state,
                couponSuccess: action.payload
            }
        case 'set_couponTotalAmt':
            return{
                ...state,
                couponTotalAmt: action.payload
            }
        case 'set_formData':
            return{
                ...state,
                code: action.payload.code,
                name: action.payload.name,
                email:action.payload.email,
                retypedEmail: action.payload.retypedEmail,
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

`
const CouponSuccess = styled(CouponForm)`
    text-align: center;
    font-size: 1em;
    padding: 10px;
    line-height:2;
    &>div{
        font-size: 1.2em;
        margin: 15px;
    }
    &>div>span{
        font-size: 0.9em;
    }
    & .thanku {
        font-size: 2em;
    }
`

const Coupon = () => {
    const checkoutContext = useContext(WholeContext);
    
    let cart = checkoutContext.state.cart;
    let cartDispatch = checkoutContext.dispatch;

    const [state, dispatch] = useReducer(formReducer, couponForm);

    useEffect(()=>{
        if(state.code!==''){
            checkCoupon(state.code, 0).then((response)=>{
                if(response.state){ //coupon valid
                    dispatch({
                        type:'set_couponTotalAmt',
                        payload: response.value
                    });
                }
            });
        }
    }, [state.code]);
    useEffect(()=>{
        var formData = window.sessionStorage.getItem('couponFormdata')||'';
        
        if(formData!==''){
            console.log(formData)
            var jsonData= JSON.parse(formData);
            dispatch({
                type: 'set_formData',
               payload: jsonData 
            });
        }
        
    },[])
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
                let response = data;
                dispatch({
                    type:'set_couponSuccess',
                    payload: response.state
                });
                if(response.state){ //payment successful
                    emptyCart();
                    storeFormInSession();
                    dispatch({
                        type:'set_couponTotalAmt',
                        payload: response.value
                    });
                }
                else{ ////payment unsuccessful
                    const errVal = response.state? errorMsgs[2]:errorMsgs[1]
                    dispatch({
                        type:'set_errorMsg',
                        payload: errVal
                    });
                }
            })
        }
    }
    const emptyCart =()=>{
        var newCart=[];
        window.sessionStorage.setItem('cart', JSON.stringify(newCart));
        cartDispatch({
            type:'set_cart',
            payload: newCart
        });         
    }
    const storeFormInSession=()=>{
        var store= {
            code:state.code,
            name:state.name,
            email:state.email,
            retypedEmail:state.retypedEmail
        }
        window.sessionStorage.setItem('couponFormdata', JSON.stringify(store));
    }

    return (
        <Col lg={{ span: 8, offset: 2 }} md={{ span: 8, offset: 2 }} sm={{ span: 8, offset: 1 }} xm={12}>
            <CategoryTitle  
                text={"Checkout using coupon"}
                marginBottom='2em'
            />
             
            {
                state.couponSuccess?
                <CouponSuccess>
                    <div>
                        <span>
                        PURCHASE COMPLETE
                        <br/>
                        TOTAL PAYMENT:
                        </span>
                        ${cart.length}.00
                    </div>
                    <div className="thanku">THANK YOU!</div>
                    <CouponMsg style={{fontSize:16}}>
                            You will shortly recieve an email with the download link.<br/>
                            Do not forget to check spam/junk as well
                    </CouponMsg>
                
                <div>
                    <span>COUPON BALANCE AFTER CHECKOUT</span><br/>
                    ${state.couponTotalAmt}.00
                
                </div>
                </CouponSuccess>
                :

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
            }
            
       </Col>
    );
};

export default Coupon;