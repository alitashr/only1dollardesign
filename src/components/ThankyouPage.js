import React, { useContext } from 'react';
import { Col, Row } from 'react-bootstrap';

import {CategoryTitle, CouponMsg} from './StyledComponents';
import {WholeContext} from '../App';

const ThankyouPage = () => {
    const checkoutContext = useContext(WholeContext);
    
    let state = checkoutContext.state;
    let dispatch = checkoutContext.dispatch;

    return (
        <Col lg={{ span: 8, offset: 2 }} md={{ span: 8, offset: 2 }} sm={{ span: 8, offset: 1 }} xm={12}>
                <CategoryTitle 
                marginBottom='2em'
                text={"Thank you"}/>
             
                <CouponMsg>
                    This link to download the designs will be active shortly.
                        <div>
                            <a href="https://only1dollardesign.com/temp/7c41660ec3393813333d4ee9d8e00ddf.zip" className="downloadLink" target="_new">https://only1dollardesign.com/temp/7c41660ec3393813333d4ee9d8e00ddf.zip</a> 
                        </div>
                       <br/>
                    You will also shortly recieve an email with the download link.
                    <br/>
                    Do not forget to check spam/junk as well

                    <div>
                        <span>Else you can contact us at:</span>
                            <br/>
                            <a href="mailto:contact@only1dollardesign.com" target="_new">contact@only1dollardesigns.com</a>
                    </div>
                </CouponMsg>
        </Col>
    );
};

export default ThankyouPage;