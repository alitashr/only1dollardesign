import React, { useContext, useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import BusySignal from "../BusySignal";
import {
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
  CartOptions,
} from "../StyledComponents";

import prevImg from "../../images/prev.png";
import nextImg from "../../images/next.png";
import closeBtn from "../../images/closePopUp.png";

import { DesignContext } from "../../App";
import { WholeContext } from "../../App";

import UtilitiesFn from "../../functions/UtilitiesFn";
import { getDesignName } from "../../utils/utils";

const FullDesign = (props) => {
  const imageRef = useRef(null);
  // let {handleClose, handleCart, handleDesignChange, goToCheckout} = props;

  const designContextFn = useContext(DesignContext);
  const handleDesignChange = designContextFn.handleDesignChange;

  const designContext = useContext(WholeContext);
  const selectedDesign = designContext.state.selectedDesign;
  console.log(selectedDesign);
  const designDetails = designContext.state.designDetails;
  const designCanvas = designContext.state.designCanvas;

  const inCart = designContext.state.inCart;
  let cart = designContext.state.cart;
  const selectedThumb = designContext.state.selectedThumb;
  const firstDesign = designContext.state.firstDesign;
  // const handleDesignChange = designContext.state.handleDesignChange;

  const dispatch = designContext.dispatch;
  let loading = designContext.state.designLoading;

  console.log("loading", loading, designDetails);

  // let imgsrc= designDetails!==''? "https://explorug.com/v2/" + designDetails.RenderingProperties.RenderedImagePath: '';
  //let imgsrc= designCanvas.toDataURL();

  useEffect(() => {
    if (!designCanvas) return;
    if (!imageRef.current) {
      return;
    }

    imageRef.current.src = designCanvas.toDataURL();

    // imageRef.current.style.width = `${designCanvas.width}px`;
    // imageRef.current.style.height = `${designCanvas.height}px`;
  }, [designCanvas]);

  const Intensity = (rgb) => {
    if (rgb[0] === "#") {
      rgb = rgb.slice(1);
      rgb = parseInt(rgb, 16);
    }
    var r = (rgb >> 16) & 0xff;
    var g = (rgb >> 8) & 0xff;
    var b = rgb & 0xff;
    return (r + g + b) / 3;
  };
  const getTextColor = (color) => {
    var textColor = Intensity(color) > 128 ? "#000" : "#fff";
    return textColor;
  };
  // const getDesignName =(designPath)=>{
  //     var dotpos = designPath.lastIndexOf('.');
  //     var slashpos = designPath.lastIndexOf('/') +1;
  //     var roomName = designPath.substr(slashpos, dotpos-slashpos);
  //     return roomName;
  // }
  let designName = getDesignName(selectedDesign);

  const closePopup = () => {
    dispatch({
      type: "set_selectedDesign",
      payload: "",
    });
  };
  const handleAddToCart = (selectedDesign) => {
    return new Promise((resolve, reject) => {
      let alreadyInCart = UtilitiesFn.alreadyInCart(selectedDesign, cart) ? true : false;
      if (!alreadyInCart) {
        addDesignToCart(selectedDesign).then(() => {
          console.log("to buy design now");
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  };

  const addDesignToCart = (selectedDesign) => {
    return new Promise((resolve, reject) => {
      let designToAdd = selectedDesign;
      let designCart = cart;
      // let selectedThumb = selectedThumb;

      designCart.push({ design: designToAdd, thumb: selectedThumb });

      cart = designCart;
      console.log("addDesignToCart");
      console.log(cart);
      resolve();
    });
  };

  const handleCart = (selectedDesign) => {
    console.log("selectedThumb " + selectedThumb);
    handleAddToCart(selectedDesign).then((added) => {
      console.log("state of cart");
      console.log(cart);
      window.sessionStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "set_cart",
        payload: cart,
      });
      dispatch({
        type: "set_inCart",
        payload: added,
      });
    });
  };

  const handleImageLoaded = () => {
    dispatch({ type: "set_designLoading", payload: false });
    //loading = false;
  };
  const showNextDesign = () => {
    handleDesignChange("next");
  };
  const showPrevDesign = (e) => {
    console.log(e.target.attributes);
    if (!firstDesign) handleDesignChange("prev");
  };

  return (
    <div className="fulldesign-container">
      {designDetails === "" ? null : (
        <div className="PopupWrapper" id="popupWrapper">
          <Col lg={{ span: 8, offset: 2 }} md={{ span: 10, offset: 1 }} sm={{ span: 10, offset: 1 }} xm={10}
          style={{height: "100%"}}>
            <div className="PopupArea" id="popupArea">
              <BusySignal className="BusySignal" show={loading}></BusySignal>
              <ClosePopup className="ClosePopup" onClick={closePopup}>
                <img alt="close button icon" src={closeBtn} width="20" />
              </ClosePopup>
              <NavBtn prev onClick={showPrevDesign} disabled={firstDesign ? "disabled" : null}>
                <img alt="previous icon" src={prevImg} width="30" />
              </NavBtn>
              <NavBtn onClick={showNextDesign}>
                <img alt="next icon" src={nextImg} width="30" />
              </NavBtn>
              <div className="DesignDisplay" xs={11}>
                <Col className="nopadding">
                  <div>
                    <img
                      alt="full design"
                      ref={imageRef}
                      className="FullDesign"
                      data-name={selectedDesign}
                      onLoad={handleImageLoaded}
                    />
                  </div>
                </Col>
                <Col className="ColorPatchCol">
                  {designDetails.DesignColors.length > 0
                    ? designDetails.DesignColors.map((color, index) => (
                        <div key={index}>
                          <div
                            className="Colorpatch"
                            style={{
                              backgroundColor: color.Color || "#ccc",
                              color: getTextColor(color.Color) || "#fff",
                            }}
                          >
                            <div>{color.ColorName}</div>
                          </div>
                        </div>
                      ))
                    : null}
                </Col>
                <Col className="DesignNameArea">
                  <div className="DesignInfo">
                    <div className="DesignInfoName">{designName}</div>
                  </div>
                  <CartOptions>
                    <CartBtnWrap background="#B398CE" onClick={() => handleCart(selectedDesign)}>
                      <Link
                        to={{
                          pathname: "/checkout",
                        }}
                      >
                        <CartBtn incart={inCart.toString()}>
                          <span>BUY</span>
                          <span>DESIGN</span>
                          <br />
                          <div style={{ fontSize: "18px" }}>$ 1</div>
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
                    <CartBtnWrap background="#DB97DB" onClick={() => handleCart(selectedDesign)}>
                      <CartBtn incart={inCart.toString()}>
                        <div style={{ fontSize: "18px" }}> +</div>
                        <div>CART</div>
                      </CartBtn>
                    </CartBtnWrap>
                  </CartOptions>
                </Col>
              </div>
            </div>
          </Col>
        </div>
      )}
    </div>
  );
};

export default FullDesign;
