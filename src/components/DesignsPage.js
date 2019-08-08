import React, {useContext} from 'react';
import {Container, Row, Col} from 'react-bootstrap';

import DesignsFilter from './DesignsFilter';
import DesignCategory from './DesignCategory';
import DesignsList from './DesignsList';
import Pagenav from './Pagenav';
import FullDesign from './FullDesign';

import {WholeContext} from '../App';


const DesignsPage = (props) => {

    const checkoutContext = useContext(WholeContext);
    let selectedDesign = checkoutContext.state.selectedDesign;

    console.log('selectedDesign '+selectedDesign);

    return (
            <div>
            <Container style={{marginTop:40}}>
            
                <Row>
                    <Col xs={8}> 
                        <DesignsFilter/>
                    </Col>
                    <Col> 
                        <DesignCategory/>
                    </Col>
                </Row>
                <DesignsList />
                <Pagenav />
                {
                    selectedDesign !==''?
                    <FullDesign/>:null
                }
                
                    
            </Container>     
           
            
        </div>
    );
};

export default DesignsPage;