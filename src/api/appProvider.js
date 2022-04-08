import HttpClient from "./httpClient";
import { createCanvas, getLogoCanvas } from "../utils/canvasutils";
export const domain = "https://v3.explorug.com";
let provider = "appproviderv3.aspx";
const API_KEY = "apikey";

export const paymentProvider = "https://explorug.com/archanastools/niblpayment/O1DDPayNPR.aspx"; //"http://192.168.1.136/nibl/O1DDPayNPR.aspx"; //"http://192.168.1.135/nibl/O1DDPayNPR.aspx";//
export const couponProvider = "https://alternative.com.np/atcurrency/at-Coupon.php";
export const checkCouponBalance = "https://alternative.com.np/atcurrency/atapp.php";
export const paypalProvider = "https://only1dollardesign.com/sendemail1dol.php";

export const downloadLinkPrefix = "https://v3.explorug.com/Only1DollarDesign/";
const postHttpClient = (data, config) =>
  HttpClient.post(`${domain}/${provider}`, data, config).then((response) => response.data);

const postPaymentClient = (data) => HttpClient.post(`${paymentProvider}`, data).then((response) => response.data);

const postWithRetry = (data) => {
  return new Promise((resolve, reject) => {
    let numtries = 0;
    const fetchData = () => {
      postHttpClient(data)
        .then(resolve)
        .catch((err) => {
          numtries++;
          if (numtries <= 5) fetchData();
          else reject(err);
        });
    };
    fetchData();
  });
};

export const getApiKey = () => sessionStorage.getItem(API_KEY);

const fetchApiKey = ({ username, password }) => {
  let data = new FormData();
  data.append("action", "login");
  data.append("username", username);
  data.append("password", password);
  return new Promise((resolve, reject) => {
    postWithRetry(data)
      .then((res) => {
        const key = res.Key;
        if (!key || key === "") reject("INVALID CREDENTIALS");
        else {
          sessionStorage.setItem(API_KEY, key);
          sessionStorage.setItem("relogin", false);
          sessionStorage.setItem("page", username);
          resolve(key);
        }
      })
      .catch(reject);
  });
};

const fetchDesignList = (params) => {
  let data = new FormData();
  data.append("action", "designlist");
  data.append("key", getApiKey());
  return new Promise((resolve, reject) => {
    postWithRetry(data)
      .then((res) => {
        const data = res;
        if (data === "") reject("designlist is blank");
        else {
          resolve(data);
        }
      })
      .catch(reject);
  });
};
const fetchDesignThumbNails = ({ designsFullPathlist, backColor = "#ffffff" }) => {
  let data = new FormData();
  data.append("action", "designthumbs");
  data.append("key", getApiKey());
  data.append("files", JSON.stringify(designsFullPathlist));
  data.append("backcolor", backColor);

  return new Promise((resolve, reject) => {
    postWithRetry(data)
      .then((res) => {
        const data = res;
        if (data === "") reject("designthumbs is blank");
        else {
          resolve(data);
        }
      })
      .catch(reject);
  });
};

const fetchDesignDetails = ({ selectedDesign, backColor = "#ffffff" }) => {
  let data = new FormData();
  data.append("action", "designdetails");
  data.append("key", getApiKey());
  data.append("file", selectedDesign);
  data.append("backcolor", backColor);

  return new Promise((resolve, reject) => {
    postWithRetry(data)
      .then((res) => {
        let designdetails = res;
        if (designdetails === "") reject("designthumbs is blank");
        else {
          resolve(designdetails);
        }
      })
      .catch(reject);
  });
};

const fetchVisualizationTiles = ({ file, zoom, tiles, props, felt = 0 }) => {
  felt = felt ? 1 : 0;
  let data = new FormData();
  data.append("action", "visualizationtiles");
  data.append("key", getApiKey());
  data.append("file", file);
  data.append("zoom", zoom);
  data.append("felt", felt);
  data.append("tiles", JSON.stringify(tiles));
  if (props) data.append("props", JSON.stringify(props));
  return postHttpClient(data).then((path) => {
    return `${AppNewProvider.domain}${path}`;
  });
};

export const fetch1xFullDesign = (fileFullPath) => {
  //const { struct } = params;
  let data = new FormData();
  data.append("action", "rendereddesign");
  data.append("key", getApiKey());
  data.append("file", fileFullPath);
  return new Promise((resolve, reject) => {
    postHttpClient(data)
      .then(resolve)
      .catch((err) => {
        reject(err);
      });
  });
};
const getFullRenderedDesign = async ({
  designDetails,
  fullpath,
  hash,
  zoom = 1,
  felt = 0,
  watermarkOptions = {},
  applyKLRatio = true,
}) => {
  return new Promise((resolve, reject) => {
   
    AppNewProvider.fetch1xFullDesign(fullpath).then((data) => {
      const img = document.createElement("img");
      img.setAttribute("crossOrigin", "Anonymous");
      img.src = `${domain}${data}`;
      img.onload = () => {
        const canvasWidth = img.width;
        const canvasHeight = img.height;
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const context = canvas.getContext("2d");
       context.drawImage(img, 0, 0, img.width, img.height);
        drawWaterMarkIfNeeded(canvas, context)
        //resolve(canvas);
      };
    });

    
    function drawWaterMarkIfNeeded(canvas, context) {
      const hasWatermark = true,
        logoUrl = `../images/logo.png`,
        watWid = 100,
        opacity = 0.5,
        position = [0.5, 0.5];

      // if (!hasWatermark || !logoUrl) {
      //   resolve(canvas);
      //   return;
      // }

      getLogoCanvas(logoUrl).then((logoCanvas) => {
        if (logoCanvas) {
          const width = watWid * 3 * zoom;
          const height = (logoCanvas.height * width) / logoCanvas.width;

          let padding = 15;
          const padx = position[1] === 0.0 ? -padding : position[1] === 1.0 ? padding : 0;
          const pady = position[0] === 0.0 ? -padding : position[0] === 1.0 ? padding : 0;
          const startx = position[1] * (canvas.width - width) - padx;
          const starty = position[0] * (canvas.height - height) - pady;

          if (context.globalAlpha) context.globalAlpha = opacity;
          context.drawImage(logoCanvas, startx, starty, width, height);
          resolve(canvas);
        }
      });
    }
  });
};

// const getRenderedDesign = async ({
//   designDetails,
//   fullpath,
//   hash,
//   zoom = 1,
//   felt = 0,
//   watermarkOptions = {},
//   applyKLRatio = true,
// }) => {
//   const tileSize = 256;
//   return new Promise((resolve, reject) => {
//     let { Width, Height, KLRatio } = designDetails;
//     const ratio = Width / Height;
//     const canvasWidth = Width * zoom;
//     // const canvasHeight = canvasWidth / ratio ;
//     const canvasHeight = Height * zoom;

//     if (!applyKLRatio) KLRatio = 1;
//     const canvas = createCanvas(canvasWidth, canvasHeight * KLRatio);
//     let xTotal = Math.floor((canvasWidth - 1) / 256) + 1;
//     let yTotal = Math.floor((canvasHeight - 1) / 256) + 1;
//     let tilepoints2X = [];
//     for (let x = 0; x < xTotal; x++) {
//       for (let y = 0; y < yTotal; y++) {
//         tilepoints2X.push({ x, y, z: zoom, name: convertTilePointToName(x, y) });
//       }
//     }
//     const context = canvas.getContext("2d");
//     AppNewProvider.fetchVisualizationTiles({
//       file: fullpath,
//       zoom,
//       felt,
//       props: designDetails,
//       tiles: tilepoints2X.map((item) => item.name),
//     }).then((basePath) => {
//       tilepoints2X.forEach((tilePoint, index) => {
//         const img = document.createElement("img");
//         img.setAttribute("crossOrigin", "Anonymous");
//         const { name } = tilePoint;
//         let filename = `${basePath}/${name}.rendered.jpg`;
//         if (hash && hash !== "") {
//           filename = `${filename}?t=${hash}`;
//         }
//         img.src = filename;
//         tilePoint.image = img;
//         img.onload = () => {
//           if (index + 1 === tilepoints2X.length) {
//             drawInCanvas();
//           }
//         };
//       });
//     });
//     let index = 0;
//     const drawInCanvas = () => {
//       if (index < tilepoints2X.length) {
//         const tilepoint = tilepoints2X[index];
//         context.drawImage(tilepoint.image, tilepoint.x * tileSize, tilepoint.y * tileSize);
//         requestAnimationFrame(drawInCanvas);
//       }
//       if (index === tilepoints2X.length) {
//         //design has been drawn in canvas
//         // callback(canvas.toDataURL())
//         resolve(canvas);
//       }
//       index++;
//     };
//   });
// };

const payNPR = async ({ itemlist, returnUrl, cancelUrl, name, email, cacheId, zipFilename }) => {
  let data = new FormData();
  data.append("itemlist", itemlist);
  data.append("return", returnUrl);
  data.append("cancel_return", cancelUrl);
  data.append("name", name);
  data.append("email", email);
  data.append("cacheId", cacheId);
  data.append("filename", zipFilename);

  //if (props) data.append("props", JSON.stringify(props));
  return postPaymentClient(data).then((path) => {
    return data;
  });
};
const postListForEmail = async ({ designpathlist, itemlist, name, email, cacheId, zipFilename }) => {
  let data = new FormData();
  data.append("designpathlist", designpathlist);
  data.append("key", getApiKey());
  data.append("itemlist", itemlist);
  data.append("name", name);
  data.append("email", email);
  data.append("cacheId", cacheId);
  data.append("filename", zipFilename);
  return postPaymentClient(data).then((path) => {
    return data;
  });
};

const AppNewProvider = {
  domain,
  fetchApiKey,
  fetchDesignList,
  fetchDesignThumbNails,
  fetchDesignDetails,
  fetchVisualizationTiles,
  fetch1xFullDesign,
  getFullRenderedDesign,
  payNPR,
  postListForEmail,
};
export default AppNewProvider;
