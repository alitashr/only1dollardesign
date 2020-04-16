import React, {useContext} from 'react';
import {Col, Row} from 'react-bootstrap';
import { Link } from "react-router-dom";

import BusySignal from './BusySignal';
import {PopupWrapper, 
    PopupArea,
    LargeImg,
    DesignDisplay,
    NavBtn,
    ClosePopup,
    ColorPatchCol,
    Colorpatch,
    DesignNameArea,
    DesignInfo,
    DesignInfoName,
    CartBtnWrap,
    CartBtn,
    CartOptions
    } from './StyledComponents';
    
import prevImg from '../images/prev.png';
import nextImg from '../images/next.png';
import closeBtn from '../images/closePopUp.png';

import {DesignContext} from '../App';
import {WholeContext} from '../App';

import UtilitiesFn from '../functions/UtilitiesFn';
//let UtilitiesFn = UtilitiesFn;//new UtilitiesFn();


const FullDesign = (props) => {
   // let {handleClose, handleCart, handleDesignChange, goToCheckout} = props;
    
    const designContextFn = useContext(DesignContext);
    // const selectedDesign = designContext.selectedDesign;
    // const designDetails = designContext.designDetails;
    // const inCart = designContext.inCart;
    // let cart = designContext.cart;
    
    // const selectedThumb = designContext.selectedThumb;
    // const firstDesign = designContext.firstDesign;
    // const dispatch = designContext.designDispatch;
    // let loading=  designContext.loading;

    const handleDesignChange = designContextFn.handleDesignChange;
    
    const designContext = useContext(WholeContext);
    const selectedDesign = designContext.state.selectedDesign;
    const designDetails = designContext.state.designDetails;
    const designCanvas = designContext.state.designCanvas;

    const inCart = designContext.state.inCart;
    let cart = designContext.state.cart;
    const selectedThumb = designContext.state.selectedThumb;
    const firstDesign = designContext.state.firstDesign;
    // const handleDesignChange = designContext.state.handleDesignChange;
    
    const dispatch = designContext.dispatch;
    let loading=  designContext.state.designLoading;

    console.log(designDetails);

    // let imgsrc= designDetails!==''? "https://explorug.com/v2/" + designDetails.RenderingProperties.RenderedImagePath: '';
    let imgsrc= designCanvas.toDataURL();
    

    const Intensity = (rgb)=> {
        if (rgb[0] === "#") {
            rgb = rgb.slice(1);
            rgb = parseInt(rgb, 16);
        }
        var r = (rgb >> 16) & 0xFF;
        var g = (rgb >> 8) & 0xFF;
        var b = rgb & 0xFF;
        return (r + g + b) / 3;
    }
    const getTextColor = (color)=>{
        var textColor = Intensity(color) > 128 ? "#000":"#fff";
        return textColor;
    }
    const getDesignName =(designPath)=>{
        var dotpos = designPath.lastIndexOf('.');
        var slashpos = designPath.lastIndexOf('/') +1;
        var roomName = designPath.substr(slashpos, dotpos-slashpos);
        return roomName;
    }
    let designName = getDesignName(selectedDesign);
    
    const closePopup = () => {
        dispatch({
            type: 'set_selectedDesign',
            payload: ''
        });
    }
    const handleAddToCart =(selectedDesign)=>{
        return new Promise((resolve, reject)=>{
            let alreadyInCart = UtilitiesFn.alreadyInCart(selectedDesign, cart) ? true:false;
            if(!alreadyInCart){
                addDesignToCart(selectedDesign).then(()=>{
                    console.log('to buy design now');
                    resolve(true);
                });
            }
            else{
                resolve(true);
            }
        })
    }
   
    const addDesignToCart = (selectedDesign)=>{
        return new Promise((resolve, reject) => {
            let designToAdd = selectedDesign;
            let designCart = cart;
           // let selectedThumb = selectedThumb;
    
            designCart.push({design:designToAdd, thumb: selectedThumb});
    
            cart = designCart;
            console.log('addDesignToCart')
            console.log(cart);
            resolve();
           
        });
    }
    
    const handleCart = (selectedDesign) =>{
        console.log('selectedThumb '+ selectedThumb)
            handleAddToCart(selectedDesign).then((added)=>{
                console.log('state of cart');
                console.log(cart);
                window.sessionStorage.setItem('cart', JSON.stringify(cart));
                dispatch({
                    type: 'set_cart',
                    payload: cart
                });
                dispatch({
                    type: 'set_inCart',
                    payload: added
                });
            }) 
            
    }
    
    const handleImageLoaded = ()=>{
        dispatch({type: 'set_designLoading', payload: false})
        //loading = false;
    }
    const showNextDesign = ()=>{
      handleDesignChange('next');
    }
    const showPrevDesign = (e)=>{
        console.log(e.target.attributes)
        if(!firstDesign) handleDesignChange('prev');
    }
    
    return (
        <div>
            {designDetails===''?
            null:
            <PopupWrapper id="popupWrapper">
            <Row >
                <Col lg={{ span: 8, offset: 2 }} md={{ span: 10, offset: 1 }} sm={{ span: 10, offset: 1 }} xm={10}>
                    <PopupArea id="popupArea">
                        <BusySignal className="BusySignal" show={loading}></BusySignal>
                        <ClosePopup onClick={closePopup}>
                            <img alt="close button icon" src={closeBtn} width="20"/>
                        </ClosePopup>
                        <NavBtn prev onClick={showPrevDesign} disabled = {firstDesign ? 'disabled':null} >
                            <img alt="previous icon" src={prevImg} width="30" />
                        </NavBtn>
                        <NavBtn onClick={showNextDesign}>
                            <img alt="next icon" src={nextImg} width="30" />
                        </NavBtn>
                        <DesignDisplay xs={11}>
                            <Col lg={4} md={4} sm={3} xs={4} className="nopadding" >
                                <div>
                                    <LargeImg
                                        src={imgsrc}
                                        data-name={selectedDesign}  
                                        onLoad={handleImageLoaded}
                                    />
                                
                                </div>
                            </Col>
                            <ColorPatchCol>
                                {
                                    designDetails.DesignColors.length>0?
                                    designDetails.DesignColors.map((color, index)=>
                                        <div  key={index}>
                                            <Colorpatch backgroundColor={color.Color} textColor = {getTextColor(color.Color)}>
                                                <div>{color.ColorName}</div>
                                            </Colorpatch>
                                        </div>
                                    )
                                    :null
                                }
                            </ColorPatchCol>
                            <DesignNameArea>
                                <DesignInfo>
                                    <DesignInfoName>
                                        {designName}
                                    </DesignInfoName>
                                </DesignInfo>
                                <CartOptions>
                                    <CartBtnWrap background = "#B398CE" onClick={()=> handleCart(selectedDesign)}>
                                    
                                    <Link to={{
                                        pathname: '/checkout'
                                       
                                        }}>
                                        <CartBtn incart={inCart.toString()}>
                                            <span>
                                                BUY
                                            </span>
                                            <span>DESIGN</span>
                                            <br/><div style={{fontSize:'18px'}}>$ 1</div>
                                        </CartBtn>
                                    </Link>
                                    {/* <CartBtn incart={inCart.toString()} onClick={goToCheckout} href="/checkout">
                                            <span>
                                                BUY
                                            </span>
                                            <span>DESIGN</span>
                                            <br/><div style={{fontSize:'18px'}}>$ 1</div>
                                    </CartBtn> */}
                                        
                                    </CartBtnWrap>
                                    <CartBtnWrap background = "#DB97DB" onClick={()=> handleCart(selectedDesign)}>
                                        <CartBtn incart ={inCart.toString()}>
                                            <div style={{fontSize:'18px'}} > +</div>
                                            <div>CART</div>
                                        </CartBtn>
                                    </CartBtnWrap>
                                </CartOptions>
                            </DesignNameArea>

                        </DesignDisplay>
                    </PopupArea>
                </Col>
            </Row>
        </PopupWrapper>
            }
        </div>
        
    );
};

export default FullDesign;
