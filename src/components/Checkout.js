import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
// import CheckoutButton from './Button';

import {CheckoutButton, CartItemWrapper, CartIndex, Link, CartInfo, RemoveDesign, CategoryTitle, CartIsNowEmpty} from './StyledForm';

class Checkout extends Component {
    getDesignName=(designPath)=>{
        var dotpos = designPath.lastIndexOf('.');
        var slashpos = designPath.lastIndexOf('/') +1;
        var roomName = designPath.substr(slashpos, dotpos-slashpos);
        return roomName;
    }
    removeItemFromCart = (item)=>{
        let index = this.props.cart.indexOf(item);
        this.props.removeItemFromCart(index)
    }
    
    render() {
        let cart =this.props.cart;
        return (
            <div>
                <CategoryTitle>
                    <span>Your Cart</span>  
                </CategoryTitle>
                {/* <div className="categoryTitle mtop">
                   <span>Your Cart</span>
                </div> */}
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
                                            <Link src={item.thumb} width="100px" pullLeft>
                                            </Link>
                                            <CartInfo pullLeft>
                                                <div className="cartItemName">{this.getDesignName(item.design)}</div>
                                                <div className="cartItemPrice">$1.00</div>
                                            </CartInfo>
                                            
                                            <br clear="both"/>
                                            <RemoveDesign onClick={()=>this.removeItemFromCart(item)}></RemoveDesign>
                                        
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
                                <CheckoutButton disabled={cart.length>0 ? false:true}>
                                <strong>Checkout<br/>PayPal</strong>
                                    <br/>
                                    ${cart.length}.00 Total buy
                                </CheckoutButton>

                                <CheckoutButton marginTop="10px" disabled={cart.length>0 ? false:true}>
                                <strong>Checkout<br/>Prepaid Coupon</strong>
                                </CheckoutButton>
                
                                <div style={{marginTop:"10px"}}>Having trouble checking out?<br/>Please contact us at <br/>
                                <a href="mailto:contact@only1dollardesign.com">contact@only1dollardesign.com</a></div>
                            </center>
                        </Col>
                    </Row>
                </Col>
                </Row>
               
            </div>
        );
    }
}

export default Checkout;