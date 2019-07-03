import React, { Component } from 'react';
import {Col, Row} from 'react-bootstrap';
import BusySignal from './BusySignal';
import closeBtn from '../images/closePopUp.png';
import prevImg from '../images/prev.png';
import nextImg from '../images/next.png';
import selectedDesign from '../images/Solidem.jpg';


class FullDesign extends Component {
    constructor(props) {
        super(props);
        this.closePopup = this.closePopup.bind(this);
        this.showNextDesign = this.showNextDesign.bind(this);
        this.showPrevDesign = this.showPrevDesign.bind(this);
    }

    Intensity(rgb) {
        if (rgb[0] === "#") {
            rgb = rgb.slice(1);
            rgb = parseInt(rgb, 16);
        }
        var r = (rgb >> 16) & 0xFF;
        var g = (rgb >> 8) & 0xFF;
        var b = rgb & 0xFF;
        return (r + g + b) / 3;
    }
    getTextColorClass(color){
        var textClass = this.Intensity(color) > 128 ? "goBlack":"";
        return textClass;
    }
    closePopup(){
        console.log('handle close')
        this.props.handleClose();
    }
    getDesignName=(designPath)=>{
        var dotpos = designPath.lastIndexOf('.');
        var slashpos = designPath.lastIndexOf('/') +1;
        var roomName = designPath.substr(slashpos, dotpos-slashpos);
        return roomName;
    }
    showNextDesign(){
        this.props.handleDesignChange('next');
    }
    showPrevDesign(){
        this.props.handleDesignChange('prev');
    }
    handleImageLoaded =()=>{
            this.props.handleBusySignal(false);     
    }
    handleBuyThis=()=>{
        this.props.handleBuyThis();
    }
    handleAddToCart=()=>{
        this.props.handleAddToCart();
    }
    getBtnClass(){
        var btnClass = "btn btn-sm btn-primary cartbtn";
        btnClass = this.props.InCart ?  btnClass + ' itemincart ': btnClass;
        return btnClass;
    }
    render() {
        let selectedDesign = this.props.selectedDesign;
        let designName = this.getDesignName(selectedDesign);
        let designDetails = this.props.designDetails;
        console.log(designDetails)
        let domain = "https://explorug.com/v2/";
        let imgsrc= domain+ designDetails.RenderingProperties.RenderedImagePath;
        console.log(imgsrc);
        return (
            <div className="container-fluid popupareawrapper">
                <Row>
                    <Col lg={{ span: 8, offset: 2 }} md={{ span: 8, offset: 2 }} sm={{ span: 10, offset: 1 }} xm={10}>
                        <Row className="myrow" id="popuparea">
                            <BusySignal show={this.props.busy}></BusySignal>
                            <div id="closePopUp" onClick={this.closePopup}><img alt="close button icon" src= {closeBtn} width="20" /></div>
                            <div id="navPrev" title="PREVIOUS" onClick={this.showPrevDesign}>
                                <img alt="previous icon" src={prevImg} width="30" />
                            </div>
                            <div id="navNext" title="NEXT" onClick={this.showNextDesign}>
                                <img src={nextImg} width="30" alt="Next icon"/>
                            </div>
                            <Col xs={10} className="designdisplay">
                                <Col lg={4} md={4} sm={3} xs={4} className="largeimg nopadding">
                                    <div>
                                        {
                                            designDetails ? 
                                            <img alt="Macrophys" id="largeImg" 
                                                data-name={selectedDesign} 
                                                src={imgsrc}
                                                onLoad={this.handleImageLoaded.bind(this)}
                         
                                            />
                                            : null
                                        }
                                    </div>
                                </Col>
                                <Col lg={3} md={3} sm={3} xs={2} className="colorPatchCol">
                                {
                                    designDetails.DesignColors.length>0?
                                    designDetails.DesignColors.map((color, index)=>
                                        <div  key={index}>
                                            <div className={" colorPatch " + this.getTextColorClass(color.Color)} style={{backgroundColor:color.Color}}>
                                                <div>{color.ColorName}</div>
                                            </div>
                                        </div>
                                    )
                                    :null
                                }
                                </Col>
                                <Col lg={4} md={4} sm={5} xs={5} className="textureimgarea nopadding">
                                    <div id="designInfo" className="shareSpace">                
                                        <div className="designInfoName"> {designName} </div>
                                        
                                    </div>
                                    <div id="cartOptions">
                                        <Col id="buythis" lg={7} md={7} sm={6} xs={10} onClick={this.handleBuyThis}>
                                        <div className={this.getBtnClass()}>
                                            <span>
                                                BUY
                                            </span>
                                            <span>DESIGN</span>
                                            <br/><div style={{fontSize:'18px'}}>$ 1</div>
                                        </div>
                                        </Col>
                                        <Col id="addtocart" lg={5} md={5} sm={6} xs={10} onClick={this.handleAddToCart}>
                                            <div className={this.getBtnClass()}>
                                                <div style={{fontSize:'18px'}} > +</div>
                                                <div>CART</div>
                                            </div>
                                        </Col>
                                    </div>
                                </Col>
                            </Col>
                            
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default FullDesign;