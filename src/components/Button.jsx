import React from 'react';
import styled from "styled-components"

 const BuyThisButton = styled.button`
 padding: 20px 0;
 border: none;
 border-radius: 0;
 width: 11em;
 max-width: 310px;
 background-color: #B398CE;
 color: #323232;
 font-size: 16px;
 text-transform: uppercase;
 cursor: pointer;
 display: block;
 `;
 

const CheckoutButton = (props)=>{
    const {text} = props
    console.log(text)
    return(
        <BuyThisButton>
            {text}
        </BuyThisButton>
    )
}
export default CheckoutButton