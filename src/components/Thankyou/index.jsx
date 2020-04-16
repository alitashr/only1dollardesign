import React from 'react';
import PropTypes from 'prop-types';
import {Col} from 'react-bootstrap';
import styled from 'styled-components';

import './index.css';
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
    
    return (
        <MessageContainer>
            <div>
            <span>
              PURCHASE COMPLETE
              <br />
              TOTAL PAYMENT:
            </span>
            ${designsCount}.00
          </div>
          <div className="thanku">THANK YOU!</div>
          <ThankMsg style={{fontSize: 16}}>
            {
              downloadLink!=='' &&
                <>
                    This link to download the designs will be active shortly.
                <div>
                    <a href={downloadLink} target="_blank">{downloadLink}</a>
                </div>
                <br/>
                </>
            }
                   
            You will also shortly recieve an email with the download link.
            <br />
            Do not forget to check spam/junk as well
          </ThankMsg>
            {
                method === 'coupon' &&
                <div>
                    <span>COUPON BALANCE AFTER CHECKOUT</span>
                    <br />${couponTotalAmt}.00
                </div>
            }
            <div>
                <span>Else you can contact us at:</span>
                    <br/>
                    <a href="mailto:contact@only1dollardesign.com" target="_new">contact@only1dollardesigns.com</a>
            </div>
          
        </MessageContainer>
    );
};

Thankyou.propTypes = {
    
};

export default Thankyou;