import React, { Component } from 'react';
import DesignsList from './DesignsList';
import DesignsFilter from './DesignsFilter';
import DesignCategory from './DesignCategory';
import SocialMediaShare from './SocialMediaShare';
import {Container, Row, Col} from 'react-bootstrap';
import FullDesign from './FullDesign';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.domain = "https://explorug.com/v2";
        
        this.callCount=0;
        this.designsPerPage =10;
        // this.selectCategory = this.selectCategory.bind(this);
        // this.handlePageChange = this.handlePageChange.bind(this);
        // this.handlePopUpClose = this.handlePopUpClose.bind(this);
        // this.handleDesignChange = this.handleDesignChange.bind(this);
        // this.handleBuyThis = this.handleBuyThis.bind(this);
        // this.handleAddToCart = this.handleAddToCart.bind(this);
    }
    
    componentDidMount(){
        //this.getKey();
    }
    

    render() {
        window.state= this.props.state;
        let state = this.props.state;
        return (
            <div>
                <Container style={{marginTop: '40px'}}>
                    <Row>
                        <Col xs={8}> 
                            <DesignsFilter 
                                filters={state.selectedFilters}
                            />
                        </Col>
                        <Col> 
                            <DesignCategory 
                                filters={state.designCategories}
                                handleClick={this.props.selectCategory}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <DesignsList 
                                designList ={state.designList}
                                keyValue={state.key}
                                selectedFilters= {state.selectedFilters}
                                designThumbs={state.designThumbs}
                                currentPage ={state.currentPage}
                                pageChange={this.props.handlePageChange}
                                busy={state.busy}
                                selectDesign= {this.props.selectDesign}
                                handleBusySignal= {this.props.handleBusySignal}
                            />
                            
                        {
                            state.selectedDesign!==''? 
                            <FullDesign 
                                busy = {state.fullDesignLoading}
                                InCart= {state.InCart}
                                selectedDesign = {state.selectedDesign} 
                                designDetails= {state.designDetails} 
                                handleClose= {this.props.handlePopUpClose}
                                handleDesignChange = {this.props.handleDesignChange}
                                handleFullDesignLoading = {this.props.handleFullDesignLoading}
                                handleBuyThis = {this.props.handleBuyThis}
                                handleAddToCart = {this.props.handleAddToCart}
                            ></FullDesign>
                            :null
                        }
                        
                    </Row>        
                </Container>
                
            </div>
        );
    }
}

export default Home;