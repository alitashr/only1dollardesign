import React, { useContext } from 'react';
import { Col } from 'react-bootstrap';

import {CategoryTitle} from './StyledComponents';
import Thankyou from './Thankyou';

const ThankyouPage = () => {

    return (
        <Col lg={{ span: 8, offset: 2 }} md={{ span: 8, offset: 2 }} sm={{ span: 8, offset: 1 }} xm={12}>
                <CategoryTitle 
                marginbottom='2em'
                text={"Thank you"}/>
             
                <Thankyou>

                </Thankyou>
        </Col>
    );
};

export default ThankyouPage;