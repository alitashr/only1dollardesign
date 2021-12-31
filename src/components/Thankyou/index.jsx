import React from 'react';
import PropTypes from 'prop-types';
import {Col} from 'react-bootstrap';
import styled from 'styled-components';

import './index.css';
import axios from 'axios';
const CouponForm = styled(Col)`
  margin: auto;
`;
const MessageContainer = styled(CouponForm)`
  text-align: center;
  font-size: 1em;
  padding: 10px;
  line-height: 2;
  & > div {
    font-size: 1.2em;
    margin: 15px;
  }
  & > div > span {
    font-size: 0.9em;
  }
  & .thanku {
    font-size: 2em;
  }
`;

const ThankMsg  = styled.div`
    color: rgb(255,126,28);
    text-align: center;
    text-transform: none;
    font-size:1em;
    &>.designDownloadLink{
        color: #337ab7;
        text-decoration: none;
    }
`
const Thankyou = props => {
    // const {method, designsCount, couponTotalAmt, downloadLink=''} = props
    // console.log(props)
    const designsCount = sessionStorage.getItem('designsCount') || 0;
    const couponTotalAmt = sessionStorage.getItem('couponTotalAmt') || 0;
    const downloadLink = sessionStorage.getItem('downloadLink') || ''; //call for download link
    const method = sessionStorage.getItem('method') || '';
    const designArrStr = sessionStorage.getItem('designArrStr') || '';
    return (
        <MessageContainer>
            <div>
            <span>
              PURCHASE COMPLETE
              <br />
              TOTAL PAYMENT:
            </span> &nbsp;
            ${designsCount}.00
          </div>
          {/* <div className="thanku">THANK YOU!</div> */}
          <ThankMsg style={{fontSize: 16}}>
            {
              downloadLink!=='' &&
                <>
                    You can download the designs from
                
                    <a href={downloadLink} target="_blank"> this link. </a>
                        
                
                <br/>
                </>
            }
                   
            You will also receive an email with the download link.
            <br />
            Do not forget to check spam/junk as well.
          </ThankMsg>
            {
                method === 'coupon' &&
                <div>
                    <span>COUPON BALANCE AFTER CHECKOUT</span>
                    <br />${couponTotalAmt}.00
                </div>
            }
            <br/>
            <br/>
            <div>
                <span>If you still have problems downloading the purchased designs, you can contact us at:</span>
                    <br/>
                    <a href="mailto:contact@only1dollardesign.com" target="_new">contact@only1dollardesigns.com</a>
            </div>
          
        </MessageContainer>
    );
};

Thankyou.propTypes = {
    
};

export default Thankyou;