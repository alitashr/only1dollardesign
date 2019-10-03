import React from 'react';
import { Col } from 'react-bootstrap';

import {CategoryTitle, FAQBlock, FooterLinks} from './StyledComponents';


const FAQ = () => {
    return (
        <Col lg={{ span: 8, offset: 2 }} md={{ span: 8, offset: 2 }} sm={{ span: 8, offset: 1 }} xm={12}>
                <CategoryTitle 
                text="FREQUENTLY ASKED QUESTIONS (FAQ)"
                marginBottom='2em'
                />
                
                <FAQBlock>
                    <h4>What is Only1dollardesign.com all about?</h4>
                    <p>Only1dollardesign.com is a source of unique designs for your inspiration. It features royalty-free designs, ready to be used in a variety of applications. You will find patterns for flooring, rug designs, wall to wall carpet designs, wallpaper designs, fabric designs, textile patterns, patterns for interior design and patterns for customizing personal accessories, along with illustrations of the patterns in use. The designs are color-separated, and can be easily customized to fit your personal taste and industry that you intend to apply the designs to.</p>
                </FAQBlock>

                <FAQBlock>
                    <h4>What will I get for 1dollar?</h4>
                    <p>You will get one color separated image (.PNG) and one texturized image (.JPG).</p>
                </FAQBlock>
                <FAQBlock>
                    <h4>Will the site store my personal information like email address, name etc?</h4>
                    <p>No. We do not require you to register with us or fill out any forms in order to buy designs from our site Only1dollardesign.com</p>
                </FAQBlock>
                <FAQBlock>
                    <h4>Can I use the designs I bought from Only1dollardesign.com for commercial use?</h4>
                    <p>Yes. You can use the designs anywhere and anyhow you would like to.</p>
                </FAQBlock>
                <FAQBlock>
                    <h4>Is it really just for 1dollar?</h4>
                    <p>Yes. All designs on our site Only1dollardesign.com are of 1 dollar each. But please be informed that you will have to pay additional PayPal charges while making the payment via PayPal. The additional charge would be 3% of total amount plus 30 cents.</p>
                </FAQBlock>
                <FAQBlock>
                    <h4>How do I pay?</h4>
                    <p>You don't need to register with us or fill out any forms. You can easily make the payment via PayPal. </p>
                </FAQBlock>
                <FAQBlock>
                    <h4>How will I get the designs I bought from Only1dollar?</h4>
                    <p>After you make payment via PayPal, you will receive an email with the designs download links. Please note that, this email address will be the one you have provided in your PayPal account.</p>
                </FAQBlock>
                <FAQBlock endBlock>
                    <h4>Where do I contact for more information?</h4>
                    <p>Our contact address is:</p>
                    <p>
                        Alternative Technology
                        Tafuaswan Marg, Khusibun, 
                        Nayabazar, Kathmandu, Nepal
                    </p><p>Phone: +977-1-4387977/4389747
                    </p><p>Email: contact@only1dollardesign.com, info@galaincha.com.np</p>
                    <p> <i>For more information read our 
                        <FooterLinks>
                            End User License Agreement
                        </FooterLinks></i></p>
                </FAQBlock>
                    
        </Col>
    );
};

export default FAQ;