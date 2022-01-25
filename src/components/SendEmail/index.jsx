import React, { useContext, useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { WholeContext } from "../../App";
import axios from "axios";

import { getCacheId, getDesignName, getDesignsListStr, getZipFilename, validateEmail } from "../../utils/utils";

import { CategoryTitle } from "../StyledComponents";
import Thankyou from "../Thankyou";

const SendEmail = () => {
  const checkoutContext = useContext(WholeContext);
  let cart = checkoutContext.state.cart;
  cart = cart ? cart : [];

  const [sendEmailSuccess, setSendEmailSuccess] = useState(false);

  const sendEmail = (userInfo) => {
    return new Promise((resolve, reject) => {
      const buyer = userInfo.name.replace(/ /g, "-");
      const buyeremail = userInfo.email;

      const filename = getZipFilename(userInfo.name);

      const cartStr = window.sessionStorage.getItem("cart") || "";
      
      const cart = cartStr ? JSON.parse(cartStr) : [];
      console.log("sendEmail -> userInfo", userInfo, cart);
   
      if (!cart.length) resolve("no item in the cart");
      const designArrStr = getDesignsListStr(cart);

      const cacheId = getCacheId(cart[0].thumb);

      const url =
        "https://alternative.com.np/atcurrency/sendemail1dol.php?buyer=" +
        buyer +
        "&buyeremail=" +
        buyeremail +
        "&filename=" +
        filename +
        "&cache=" +
        cacheId +
        "&designs=" +
        designArrStr;
      console.log("returnnewPromise -> url", url);

    //  https://only1dollardesigns.com/sendemail.php?buyer=alita-shrestha&buyeremail=alita@explorug.net&filename=shrestha230292&cache=AF802D76625EA3B4066EC8241EB98997&designs=Abstract/Nimrite%7CDesigners-Collection/Ageicent%7CAbstract/Heliolood%7CAbstract/Axiomio
      axios
        .post(url)
        .then((response) => {
          console.log('data after sendemail', response.data);
          const downloadLink = `https://v3.explorug.com/Only1DollarDesign/${filename}.zip`;
          sessionStorage.setItem("downloadLink", downloadLink);
          setSendEmailSuccess(true);
          resolve(response.data);
        })
        .catch((error) => {
          setSendEmailSuccess(false)
          reject(error);
        });
    });
  };

  useEffect(() => {
    const userInfoStr = sessionStorage.getItem("userInfo") || "";
    if (userInfoStr && userInfoStr !== "") {
      const userInfo = JSON.parse(userInfoStr);
      sendEmail(userInfo).then(() => {});
    }
  }, []);

  return (
    <Col lg={{ span: 8, offset: 2 }} md={{ span: 8, offset: 2 }} sm={{ span: 8, offset: 1 }} xm={12}>
      <CategoryTitle marginbottom="2em" text={"Thank you"} />
      {sendEmailSuccess ? (
        <Thankyou></Thankyou>
      ) : (
        <div className="sendemail-message">
          <span>
            Generating download link...
            <br />
            TOTAL PAYMENT:
          </span>{" "}
          &nbsp; ${cart.length}.00
        </div>
      )}
    </Col>
  );
};

export default SendEmail;
