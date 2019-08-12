
let totalCartPrice = '0.00';

const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
};

const tokenizationSpecification = {
    "type": "DIRECT",
    "parameters": {
        "protocolVersion": "ECv2",
        "publicKey": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAER4j/qfxvY//ykUacscplwZSKLZzoEnaoquwixldynXZC5iSnTUcZpaMx2wYVhCI21Vm1W5HQcNd3gfExtC7AvA=="
    }
}
const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];

const allowedCardAuthMethods = ["PAN_ONLY"];
const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks
    }
};

const cardPaymentMethod = Object.assign({
        tokenizationSpecification: tokenizationSpecification
    },
    baseCardPaymentMethod
);

let paymentsClient = null;

let payBtn;

function getGoogleIsReadyToPayRequest() {
    return Object.assign({},
        baseRequest, {
            allowedPaymentMethods: [baseCardPaymentMethod]
        }
    );
}

function getGooglePaymentsClient() {
    if (paymentsClient === null) {
        paymentsClient = new google.payments.api.PaymentsClient({
            environment: 'TEST',
            paymentDataCallbacks: {
                onPaymentAuthorized: onPaymentAuthorized
            }
        });
    }
    return paymentsClient;
}

function onGooglePayLoaded(){
    const paymentsClient = getGooglePaymentsClient();
    paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
    .then(function(response) {
    console.log(response);
      if (response.result) {
        console.log('now add button')
        //addGooglePayButton();
        // @todo prefetch payment data to improve performance after confirming site functionality
        // prefetchGooglePaymentData();
      }
    })
    .catch(function(err) {
      // show error in developer console for debugging
      console.error(err);
    });
    
}
function addGooglePayButton() {
    const paymentsClient = getGooglePaymentsClient();
    const button =
        paymentsClient.createButton(
          {
            onClick: onGooglePaymentButtonClicked,
            buttonColor:'white',
            buttonType:'short'
          });
    payBtn = button;
     window.payBtn =  payBtn;
    document.getElementById('googlePayContainer').appendChild(button);
}

function getGoogleTransactionInfo() {
  
    return {
      currencyCode: 'USD',
      totalPriceStatus: 'FINAL',
      // set to cart total
      totalPrice: totalCartPrice
    };
  }
function prefetchGooglePaymentData() {
  const paymentDataRequest = getGooglePaymentDataRequest();
  // transactionInfo must be set but does not affect cache
  paymentDataRequest.transactionInfo = {
    totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
    currencyCode: 'USD'
  };
  const paymentsClient = getGooglePaymentsClient();
  paymentsClient.prefetchPaymentData(paymentDataRequest);
}

function onGooglePaymentButtonClicked() {
  let localCart = window.sessionStorage.getItem('cart') || "[]";

  let totalItemsInCart = JSON.parse(localCart);
  console.log('items in cart: '+ totalItemsInCart.length);
  if(totalItemsInCart.length>0){
    totalCartPrice = totalItemsInCart.length+'.00';
    const paymentDataRequest = getGooglePaymentDataRequest();
  paymentDataRequest.transactionInfo = getGoogleTransactionInfo();

  const paymentsClient = getGooglePaymentsClient();
  paymentsClient.loadPaymentData(paymentDataRequest)
    //   .then(function(paymentData) {
    //     // handle the response
    //     processPayment(paymentData);
    //   })
    //   .catch(function(err) {
    //     // show error in developer console for debugging
    //     console.error(err);
    //   });
  }

}
function processPayment(paymentData) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
                // @todo pass payment token to your gateway to process payment
                paymentToken = paymentData.paymentMethodData.tokenizationData.token;

            resolve({});
        }, 3000);
    });

  }

function getGooglePaymentDataRequest() {
  const paymentDataRequest = Object.assign({}, baseRequest);
  paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
  paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
  paymentDataRequest.merchantInfo = {
    // @todo a merchant ID is available for a production environment after approval by Google
    // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
    // merchantId: '01234567890123456789',
    merchantName: 'Example Merchant'
  };
  paymentDataRequest.callbackIntents = ["PAYMENT_AUTHORIZATION"];

  return paymentDataRequest;
}

function onPaymentAuthorized(paymentData) {
    return new Promise(function(resolve, reject){
// handle the response
processPayment(paymentData)
.then(function() {
  resolve({transactionState: 'SUCCESS'});
})
.catch(function() {
  resolve({
    transactionState: 'ERROR',
    error: {
      intent: 'PAYMENT_AUTHORIZATION',
      message: 'Insufficient funds',
      reason: 'PAYMENT_DATA_INVALID'
    }
  });
    });
});
}
