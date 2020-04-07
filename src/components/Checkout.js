import React, {useContext, useEffect} from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
// import {addGooglePayBtn, onGooglePayLoaded} from './GooglePay';

import {CheckoutButton, CartItemWrapper, CartIndex, CartDesignThumb, CartInfo, RemoveDesign, CategoryTitle, CartIsNowEmpty, BtnLink} from './StyledComponents';

import {WholeContext} from '../App';
import GeneralInfo from './GeneralInfo';
import axios from 'axios';

const Checkout = () => {
    console.log('----in checkout---')
    const checkoutContext = useContext(WholeContext);
    
    let cart = checkoutContext.state.cart;
    let dispatch = checkoutContext.dispatch;

    cart = cart ? cart:[];

    useEffect(()=>{
        console.log('----in checkout--- useeffect');
        //addGooglePayBtn();
        window.addGooglePayButton();
        //document.getElementById('googlePayContainer').appendChild(window.payBtn);
    }, []);
    
    const getDesignName = (designPath)=>{
        var dotpos = designPath.lastIndexOf('.');
        var slashpos = designPath.lastIndexOf('/') +1;
        var roomName = designPath.substr(slashpos, dotpos-slashpos);
        return roomName;
    }
    const removeItemFromCart = (item)=>{
        let index = cart.indexOf(item);
        console.log('item to remove '+ index)
        let designcart = cart;
        designcart.splice(index, 1);
        console.log(designcart)
        cart = designcart;
        window.sessionStorage.setItem('cart', JSON.stringify(cart));
        dispatch({
            type: 'set_cart',
            payload: cart
        });  
    
    }
    const checkOutAction = ()=>{
        var itemList = '';
        cart.forEach((element, index) => {
            let i = index+1;
            itemList += '&item_name_'+i+'='+getDesignName(element.design)+'&amount_'+i+'=1'
            
        });
        
        //for now
        itemList = itemList!==''? 
            itemList: 
            "&item_name_1=Lunazoph&amount_1=1"+
            "&item_name_2=Mechanic&amount_2=1"+
            "&item_name_3=Wiros Egolox&amount_3=1";

        console.log(itemList);
        var link = "https://www.paypal.com/cgi-bin/webscr?currency_code=USD&cmd=_cart&upload=1&business=onlyhundred@explorug.net&lc=US&notify_url=http%3a%2f%2fwww%2eonly1dollardesign%2ecom%2fipn%2ephp"+
        itemList +
        //"&custom=543a385a-cbe8-4aae-bd17-a06e31cc8e93"+
        "&button_subtype=services&no_note=1&no_shipping=1&rm=1"+
        "&return=http%3a%2f%2fwww%2eonly1dollardesign%2ecom%2fthank"+
        "&cancel_return=http%3a%2f%2fwww%2eonly1dollardesign%2ecom%2fhelp&bn=PP%2dBuyNowBF%3abtn_buynow_LG%2egif%3aNonHosted";
        //var link = 'http://192.168.0.176/AT/NIBL/niblpay.aspx?itemlist='+ itemList;
        console.log(link)
        window.location = link;
    }
    
    const NIBLcheckOutAction =()=>{
        var itemList = '';
        cart.forEach((element, index) => {
            let i = index+1;
            itemList += 'item_name_'+i+'='+getDesignName(element.design)+'|amount_'+i+'=1|'
        });

        //for now
        itemList = itemList!==''? 
            itemList: 
            "&item_name_1=Lunazoph&amount_1=1"+
            "&item_name_2=Mechanic&amount_2=1"+
            "&item_name_3=Wiros Egolox&amount_3=1";

        console.log(itemList);
        var link='http://explorug.com/archanastools/niblpayment/O1DDPay.aspx?itemlist='+itemList+"&return=http%3a%2f%2fwww%2eonly1dollardesigns%2ecom%2fthank"+
        "&cancel_return=http%3a%2f%2fwww%2eonly1dollardesign%2ecom%2fhelp&bn=PP%2dBuyNowBF%3abtn_buynow_LG%2egif%3aNonHosted";
        window.location=link;
        // postToNIBL(itemList).then((status)=>{
        //     console.log(status);

        // })
        // var link = 'http://explorug.com/archanastools/niblpayment/O1DDPay.aspx?itemlist='+ itemList;
        // console.log(link)
        // window.location = link;
    }
    const postToNIBL = (itemList)=>{
        return new Promise((resolve, reject)=>{
            let data = new FormData();
            data.append("itemlist", itemList);
            //axios.post("http://explorug.com/archanastools/niblpayment/O1DDPay.aspx", data)
            axios.post('http://explorug.com/archanastools/niblpayment/O1DDPay.aspx?itemlist='+itemList+"&return=http%3a%2f%2fwww%2eonly1dollardesign%2ecom%2fthank"+
            "&cancel_return=http%3a%2f%2fwww%2eonly1dollardesign%2ecom%2fhelp&bn=PP%2dBuyNowBF%3abtn_buynow_LG%2egif%3aNonHosted"
            )
                 .then(response=>{
                     resolve(data);
                })
                .catch(error=>{
                    reject(error);
                });
        });
    }
    return (
            <Col lg={{ span: 8, offset: 2 }} md={{ span: 8, offset: 2 }} sm={{ span: 8, offset: 1 }} xm={12}>
                
                <CategoryTitle  text={"Your Cart"}/>
                
                <Row>
                <Col lg={3} md={3} sm={12} xs={12} style={{paddingBottom:"30px"}}>
                        The designs hosted on this site are royalty-free and ready to be used in a variety of applications.                
                        <br/><br/>
                        Once you buy designs from us, you can use these on any of your physical products without any restrictions.
                        <br/>
                        The only thing you cannot do is to sell or distribute the designs that you have purchased.
                        <br/>
                        <br/>
                        Please refer to the Terms of Use for details.
                </Col>
                <Col lg={9} md={9} sm={12} xs={12}>
                    <Row>
                    {
                            cart.length>0 ?
                            <Col lg={7} md={7} sm={6} xs={12} id="cartList">
                            {
                                cart.map((item, index)=>    
                                <CartItemWrapper key={index}>
                                    <CartIndex>
                                        {index+1}.
                                    </CartIndex>
                                    
                                        <div className="cartItem pull-left">
                                            <CartDesignThumb src={item.thumb} width="100px" pullLeft>
                                            </CartDesignThumb>
                                            <CartInfo pullLeft>
                                                <div className="cartItemName">{getDesignName(item.design)}</div>
                                                <div className="cartItemPrice">$1.00</div>
                                            </CartInfo>
                                            
                                            <br clear="both"/>
                                            <RemoveDesign onClick={()=>removeItemFromCart(item)}></RemoveDesign>
                                        
                                        </div>
                                    <br clear="both"/>
                                </CartItemWrapper>   
                                )
                            }
                            </Col>
                        :
                        
                        <Col lg={7} md={7} sm={6} xs={12} id="cartIsNowEmpty">
                            <CartIsNowEmpty>    
                                Your cart is empty
                            </CartIsNowEmpty>
                        </Col>        
                    }
                        <Col lg={5} md={5} sm={6} xs={12}>
                            <center>
                            <div id="googlePayContainer" style={{marginBottom:'1em'}}>
                                    {/* <div dangerouslySetInnerHTML={{ __html: window.payBtn.innerHTML }} />; */}
                                    </div>  

                                {cart.length>0 ? 
                                    <div>
                                        <CheckoutButton onClick={checkOutAction}>
                                            <strong>Checkout<br/>PayPal</strong>
                                            <br/>
                                            ${cart.length}.00 Total buy
                                        </CheckoutButton>
                                        
                                        <CheckoutButton onClick={NIBLcheckOutAction} marginTop="10px">
                                            <strong>Checkout<br/>NIBL</strong>
                                            <br/>
                                            ${cart.length}.00 Total buy
                                        </CheckoutButton>
                                        <BtnLink to={{pathname: '/coupon'}}>
                                            <CheckoutButton marginTop="10px">
                                                <strong>Checkout<br/>Prepaid Coupon</strong>
                                            </CheckoutButton>    
                                        </BtnLink>
                                    </div>
                                    :
                                    <div>
                                        <CheckoutButton disabled bgColor = '#797979' bgColorHover= '#797979' bgHoverText =  '#323232'>
                                            <strong>Checkout<br/>PayPal</strong>
                                            <br/>
                                            ${cart.length}.00 Total buy
                                        </CheckoutButton>
                                        <CheckoutButton disabled marginTop="10px" bgColor = '#797979' bgColorHover= '#797979' bgHoverText =  '#323232'>
                                            <strong>Checkout<br/>Prepaid Coupon</strong>
                                        </CheckoutButton>    
                                    </div>
                                    }
                                     
                                <GeneralInfo/>
                            </center>
                            
                        </Col>
                    </Row>
                </Col>
                </Row>
               
            </Col>
        
    );
};

export default Checkout;