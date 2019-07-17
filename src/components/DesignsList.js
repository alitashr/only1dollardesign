import React, {Component} from 'react';
import {Col, Row} from 'react-bootstrap';
import BusySignal from './BusySignal';

class DesignsList extends Component {
    
    nextPage = ()=>{
        this.props.handleBusySignal(true);
        this.props.pageChange('next');
    }
    prevPage = ()=>{
        this.props.handleBusySignal(true);
        this.props.pageChange('prev');
    }
    selectDesign=(event)=>{
        let selectedDesign = event.target.getAttribute('data-name');
        let selectedThumb = event.target.getAttribute('src');
        this.props.selectDesign(selectedDesign, selectedThumb);
    }
    handleImageLoaded =()=>{
        if(this.props.busy)
            this.props.handleBusySignal(false);     
    }
   
    render() {
        var thumbs= this.props.designThumbs || [];
        let showBusySignal = this.props.busy;
        return ( 
        <React.Fragment>
        <div className = "container-fluid" >
            <Row id="designsArea">
            <BusySignal show={showBusySignal}></BusySignal>
                {
                    thumbs.length>0 ? 
                    thumbs.map((thumb, index)=>
                    <Col  key={index} lg = {4} md = {4} sm = {4} xs = {10} className = "thumbs">
                    <div>
                        <img data-name={thumb.Name} 
                            onClick={(e)=>this.selectDesign(e)} 
                            onLoad={this.handleImageLoaded.bind(this)}
                            src={"https://explorug.com/v2/"+thumb.Value}/></div>
                    </Col>)
                    :null
                }
            </Row>
            <div className="pager">
                <div className={this.props.currentPage>0 ? null:"disabled"}>
                    <span onClick={this.prevPage}>‹</span>
                </div>
                <div>
                    <span onClick={this.nextPage}>›</span>
                </div>
            </div>            
            </div>
           
        </React.Fragment>
        
        );
    }
}

export default DesignsList;