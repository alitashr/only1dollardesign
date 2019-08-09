import React from 'react';
import { Col, Row } from 'react-bootstrap';

import {CategoryTitle, CouponMsg} from './StyledComponents';

const ThankyouPage = () => {
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

                </CouponMsg>
        </Col>
    );
};

export default ThankyouPage;