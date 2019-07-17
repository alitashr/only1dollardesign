import styled from "styled-components"
import cross from '../images/delete.png';
import diamond from '../images/diamond.png';
//now below style a parent div as a variable and name it 
//Note: always use Pascal Case for Naming Styled Components
//we use styled.variableType to create a variable 

const CheckoutButton = styled.button `
 padding: 20px 0;
 border: none;
 border-radius: 0;
 width: 11em;
 max-width: 310px;
 background-color: ${props=> props.disabled===true ? '#797979': '#B398CE'};
 color: #323232;
 font-size: 16px;
 text-transform: uppercase;
 cursor: pointer;
 display: block;
 margin-top: ${props => props.marginTop || "0"};
 &:hover {
    background: ${props=> props.disabled===true ? '#797979': '#3D1930'};
    color:  ${props=> props.disabled===true ? '#323232': '#fff'};
    cursor: ${props=> props.disabled===true ? 'default': 'pointer'};
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
const Link = styled.img`
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
const CategoryTitle = styled.div`
  text-align: center;
  color: #ABBDC9;
  text-transform: uppercase;
  font-size: 20px;
  background: url(${diamond}) repeat-x center;
  margin-top: 100px;
    * {
    padding: 0 30px;
    margin-top: -10px;
    background: #f5f5f5;
    letter-spacing: 1px;
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
const CartIsNowEmpty = styled.div`
font-size: 18px;
text-transform: uppercase;
padding-top: 100px;
text-align:center;
`
// don't export default anything from styled components file

export {
    CheckoutButton,
    CartItemWrapper,
    CartIndex,
    Link,
    CartInfo,
    RemoveDesign,
    CategoryTitle,
    Colorpatch,
    CartIsNowEmpty
}