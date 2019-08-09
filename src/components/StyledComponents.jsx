import React from 'react';
import styled from 'styled-components';
import {Badge, Col, Dropdown, Row, Button, Navbar, Nav} from 'react-bootstrap';

import DropdownItem from 'react-bootstrap/DropdownItem';

import { Link } from "react-router-dom";


import dwnarw from '../images/dwnarw.png';
import cb_false from '../images/cb_false.png';
import cb_true from '../images/cb_true.png';
import loadingGif from '../images/loading.gif';
import prev from'../images/prev.png';
import next from '../images/next.png';
import cross from '../images/delete.png';
import diamond from '../images/diamond.png';
import cartBg from '../images/cart.png';

const FilterBadge = styled(Badge)`
    float: left;
    background: #e9e9e9;
    color: #323232;
    margin: 1px;
    line-height: 200%;
    padding: 0 10px;
    font-size: 1em;
    font-weight: normal;
    text-transform: uppercase;
`
const FilterToggle = styled(Dropdown.Toggle)`
    color: #323232;
    padding: 20px 15px 20px 15px;
    border-radius: 0;
    font-weight: 600;
    border: none;
    background-color: transparent;
    text-transform: uppercase;
    background: url(${dwnarw}) bottom center no-repeat;
    background-size: 10px;
    :hover {
        background: #DB97DB;
        color: #1B1B1B;
    }
    ::after{
        display: none;
    }
    .show &.btn-primary.dropdown-toggle{
        background-color: #DB97DB;
        color: #1B1B1B !important;
    }
`
const FilterMenu = styled(Dropdown.Menu)`
    border-radius: 0;
    padding: 5px 10px;
    background: #D9D9D9;
    margin-top: -2px;
    min-width: 200px;
`

const FilterItem = styled(DropdownItem)`
    background: url(${cb_false}) no-repeat right;
    padding: 7px 2px;
    cursor: pointer;
    color: #1B1B1B;
    background-size: 15px;
    :hover{
        color: crimson;
        background-color: inherit;
    }
    &.filteroptionsactive{
        background-image: url(${cb_true}) !important;
    }
`
const DesignsArea = styled(Row)`
    position: relative;
    min-height: 500px;
`
const DesignThumb = styled(Col)`
padding: 4px;
    cursor: pointer;
    flex: 0 0 50%;
    @media (min-width: 576px){
        flex: 0 0 25%;
        max-width: 25%;    
    }
    @media (min-width: 768px)
    {
        flex: 0 0 20%;
        max-width: 25%;
    }
    @media (min-width: 992px)
    {
        flex: 0 0 20%;
        max-width: 25%;
    }
    @media (min-width: 1200px)
    {
        flex: 0 0 20%;
        max-width: 25%;
    }
    &>div {
        height: 100%;
    }
    img {
        width: 100%;
        height: 100%;
    }

}
`
const ContentLoadingSignal= styled.div`
    background: url(${loadingGif}) no-repeat center center;
    width: 100%;
    position: absolute;
    bottom: 0;
    top: 0px;
    z-index: 1;
    display: none;
    min-height: 300px;
    background-color: rgba(245,245,245,0.5);
    z-index: 100;
}
`
const Pager = styled.div`
    margin-top: 10px;
  padding-left: 0;
  margin: 20px 0;
  list-style: none;
  text-align: center;

 div{
  display: inline;
}
 div > span {
  background-repeat: no-repeat;
  background-size: 25px;
  color: transparent;
  font-size: inherit;
  background-position: center center;
  margin: 0 10px;
  border:none;
}
 div > span {
  display: inline-block;
  padding: 5px 14px;
  background-color: transparent;
  border: none;
}
 .disabled > span {
  opacity: 0.5;
  color: transparent;
}
 .disabled > span,  .disabled > span:hover,  .disabled > span:focus,  .disabled > span {
  background-color: transparent;
  cursor: not-allowed;

}
 div > span:hover {
  background-color: #fff;
  border-radius: 0;
  cursor:pointer
}
 div:nth-child(1) > span{
  background-image: url(${prev});
}
 div:nth-child(2) > span {
  background-image: url(${next});
}
`

const PopupWrapper = styled.div `
    position: fixed;
    z-index: 3;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0px;
    background: rgba(255,255,255,0.9);
    padding-top: 40px;
`
const PopupArea = styled.div`
    text-align: center;
    margin-top: 30px;
    position: relative;
    width: 100%;
`
const ClosePopup =  styled.div`
    color: #fff;
    cursor: pointer;
    position: absolute;
    right: -32px;
    padding: 5px;
`
const NavBtn = styled.div`
    color: #fff;
    cursor: pointer;
    position: absolute;
    right:  ${props => props.prev ? 'inherit': '-32px' };
    left:  ${props => props.prev ? '-24px': 'inherit' };
    padding: 5px;
    top: 50%;
    opacity: ${props => props.disabled === 'disabled'? 0.5:1};
    color: ${props => props.disabled === 'disabled'? 'tranparent':'#fff'};
    cursor:  ${props => props.disabled === 'disabled'? 'not-allowed':'pointer'};
`

const DesignDisplay = styled(Col)`
    margin: auto;
    &>div {
        float: none;
        display: table-cell;
        vertical-align: top;
    }

    .nopadding {
        padding: 0;
    }
`
const LargeImg = styled.img`
    width: 100%;
    min-width: 15em;
`
const ColorPatchCol = styled(Col)`
    padding: 25px;
    padding-top: 0;
    @media (max-width: 1200px)
    {
        &{
            padding: 10px;
        }
    }
`
const Colorpatch = styled.div`
    height: 1.8em;
    background: #ccc;
    margin-bottom: 5px;
    font-size: 0.8em;
    color: ${props => props.textColor || '#fff'};
    line-height: 1.8em;
    padding: 0 0.4em;
    width: 100%;
    text-align: center;
    min-width: 10em;
    background-color: ${props => props.backgroundColor || '#ccc'} 
`

const DesignNameArea = styled(Col)`
    vertical-align: middle !important;
    padding: ${props=> props.noPadding ? 0: "inherit"}

`
const DesignInfo = styled.div`
    color: #323232;
    text-transform: uppercase;
    @media (min-width: 1200px)
    {
    &{
        min-width: 20vw;
    }
    }

`
const DesignInfoName = styled.div`
    font-size: 20px;
    font-weight: 600;
`
const CartOptions = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    max-width: 18em;
    left: 0;
    right: 0;
    margin: auto;
    &>div {
        padding: 0;
        width:50%;
        float:left;
    }
    @media (max-width: 1200px)
    {
        &> div {
            min-width: 8em;
        }
    }
    @media (max-width: 800px)
    {
        &{
            position: unset
        }
    }
`
const CartBtnWrap  = styled(Col)`
    background: ${props=> props.background || '#B398CE;'}
`
const CartBtn = styled(Button)`
    margin: 0;
    padding: 20px 0;
    border: none;
    float: left;
    width: 100%;
    background-color: transparent;
    color: #1B1B1B;
    font-weight: 600;
    font-size: 15px;
    line-height: 1.25;
    :hover {
        background: #3D1930;
        color: #fff;
    }
    // &:after {
    //     content: 'IN CART'; 
    //     white-space: pre; 
    //     color: azure;
    // }

   
    ${({ incart }) => incart === 'true' && `
    &:after {content: 'IN CART'; white-space: pre; color: azure;}
  `}
    
`
const ShareOption = styled.div`
    position: fixed;
    right: 2em;
    bottom: 7em;
`
const ShareIcon = styled.a`
    margin: 0.1rem;
    &>img{
        width: 30px;
    }
`
const Copyright = styled.div`
    margin: 50px 0 100px 0;
    color: #959595;
    font-size: 14px;
    font-weight: 600;
    text-align: ${props=> props.textCenter? 'center': 'unset'}
`
const FooterLinks =  styled.span`
    cursor: pointer;
    padding: 3px 3px;
`
const NavBar = styled(Navbar)`
    padding-top: 0;
    padding-bottom: 0;
    background: ${props=> props.background ? props.background: 'inherit'}
`
const NavbarBrand = styled(Navbar.Brand)`
    width: 25%;
    text-align: center;
    color: #1B1B1B;
    font-size: 30px;
    cursor: pointer;
    float: ${props=> props.pullleft ? 'left':'none' }
    @media (max-width: 1100px){
        width: 15%;
        &>img{width:100%;}
    }
    @media (max-width: 768px){
        width: 25%;
        &>img{width:auto;}
    }

`

const BasicNavbarNav = styled(Navbar.Collapse)`
      
    &>div{
        width:100%
    }
    
`
const NavLink = styled(Nav.Link)`
    width: 100%;
  text-align: center;
  cursor: ${props=> props.disabled ? 'text':'pointer'};
  text-transform: uppercase;
  font-weight: 600;
    color: #444;
    position: relative;
    background: ${props=> props.background ? props.background: 'none'}
    &:hover{
        background:  ${props=> props.background ? props.background: '#DB97DB'};
        color: #1B1B1B;
    }
    line-height:4;

`
const BtnLink = styled(Link)`
    text-decoration: none;
    &:hover {
        color: initial;
        text-decoration: none;
    }
`
const NavLinkP = styled(BtnLink)`
    width: 100%;
  text-align: center;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 600;
    color: #444;
    position: relative;
    background: ${props=> props.background ? props.background: 'none'}
    &:hover{
        background:  ${props=> props.background ? props.background: '#DB97DB'};
        color: #1B1B1B;
    }

`
//Checkout page


const CheckoutButton = styled.button `
 padding: 20px 0;
 border: none;
 border-radius: 0;
 width: 11em;
 max-width: 310px;
 
 background-color: ${props=> props.bgColor ? props.bgColor: '#B398CE'};
 color: #323232;
 font-size: 16px;
 text-transform: uppercase;
 cursor: pointer;
 display: ${props=> props.inlineBlock? 'inline-block':'block'} ;
 margin-top: ${props => props.marginTop || "0"};
 text-decoration:none;
 &:hover {
    background-color: ${props=> props.bgColorHover ? props.bgColorHover: '#3D1930'};
    color: ${props=> props.bgHoverText ? props.bgHoverText: '#fff'};
   
    cursor: ${props=> props.disabled===true ? 'default': 'pointer'};
    text-decoration:none;
}
&.disabled{
    background:black
}
 `;
const CartItemWrapper = styled.div `
 background: #fff;
 margin: 2px;
 position: relative; 

 .cartItem {
    padding: 10px;
  } 

`
const CartIndex = styled.div`
    width: 30px;
    text-align: center;
    color: #333;
    padding: 50px 0;
    background: #fff;
    float: left !important;

`
const CartDesignThumb = styled.img`
    cursor: pointer;
    text-decoration: none;
    float: ${props => props.pullLeft? 'left' : 'none'}
    
    :hover {
        text-decoration: none;
    }
`
const CartInfo = styled.div`
    padding: 5px;
    color: #C2C2C2;
    float: ${props => props.pullLeft? 'left' : 'none'}
    .cartItemName {
        color: #333;
        font-size: 13px;
    }
    .cartItemPrice {
        font-size: 15px;
    }

`
const RemoveDesign = styled.div`
    background: url(${cross}) center center no-repeat;
    
    background-size: 13px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    right: 10px;
    bottom: 10px;
`

const Title = (props)=>(
    <div {...props}>
        <span>{props.text}</span>
    </div>
)

const CategoryTitle = styled(Title)`
  text-align: center;
  color: #ABBDC9;
  text-transform: uppercase;
  font-size: 20px;
  background: url(${diamond}) repeat-x center;
  margin-top: 100px;
  margin-bottom: ${props=>props.marginBottom ? props.marginBottom: '0'}
    * {
    padding: 0 30px;
    margin-top: -10px;
    background: #f5f5f5;
    letter-spacing: 1px;
    }
`
const CartIsNowEmpty = styled.div`
font-size: 18px;
text-transform: uppercase;
padding-top: 100px;
text-align:center;
`

const NavCart =styled.div`
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    cursor: pointer;
    background: url(${cartBg}) no-repeat;
    background-size: 30px;
    background-position: 1.5rem;
    line-height:1;
    color: #000
    &>div{
        margin-top: 1.5rem;
    }
    @media (max-width: 768px){
        &{
            position: relative;
            height: 3em;
        }
    }
   
}
`
const FAQBlock =  styled.div`
    margin-bottom: 2em;
    padding-bottom: ${props=> props.endBlock ? '40px':'0'};
    &>h4 {
        color: #333;
        text-transform: uppercase;
        font-size: 16px;
        font-weight: 600;
    }
    &>p {
        margin: 0 0 10px;
    }

`
// ThankyouPage
const CouponMsg  = styled.div`
    color: rgb(255,126,28);
    text-align: center;
    text-transform: none;
    font-size:1em;
    &>.designDownloadLink{
        color: #337ab7;
        text-decoration: none;
    }
`

export {
    FilterBadge,
    FilterToggle,
    FilterMenu,
    FilterItem,
    DesignsArea,
    DesignThumb,
    ContentLoadingSignal,
    Pager,
    PopupWrapper,
    PopupArea,
    ClosePopup,
    NavBtn,
    DesignDisplay,
    LargeImg,
    ColorPatchCol,
    Colorpatch,
    DesignNameArea,
    DesignInfo,
    DesignInfoName,
    CartOptions,
    CartBtnWrap,
    CartBtn,
    ShareOption,
    ShareIcon,
    Copyright,
    FooterLinks,
    NavbarBrand,
    BasicNavbarNav,
    NavLink,
    BtnLink,
    NavLinkP,
    NavBar,
    CheckoutButton,
    CartItemWrapper,
    CartIndex,
    CartDesignThumb,
    CartInfo,
    RemoveDesign,
    CategoryTitle,
    CartIsNowEmpty,
    NavCart,
    FAQBlock,
    CouponMsg
}