import HttpClient from './httpClient';
import { createCanvas } from "../utils/canvasutils";
import { readJSON, convertTilePointToName } from "../utils/utils";

//export const domain = 'https://explorug.com/v2';
export const domain = "https://v3.explorug.com/dev";



//let provider = 'appprovider.aspx';
let provider = 'appproviderv3.aspx';
const API_KEY = 'apikey';

const postHttpClient = (data, config) => HttpClient.post(`${domain}/${provider}`, data, config).then((response) => response.data);

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

const getApiKey = () => sessionStorage.getItem(API_KEY);

const fetchApiKey = ({username, password}) => {
  let data = new FormData();
  data.append('action', 'login');
  data.append('username', username);
  data.append('password', password);
  return new Promise((resolve, reject) => {
    postWithRetry(data)
      .then((res) => {
        console.log(res)
        const key = res.Key;
        if (!key || key === '') reject('INVALID CREDENTIALS');
        else {
          sessionStorage.setItem(API_KEY, key);
          sessionStorage.setItem('relogin', false);
          sessionStorage.setItem('page', username);
          resolve(key);
        }
      })
      .catch(reject);
  });
};

const fetchDesignList = (params) => {
  let data = new FormData();
  data.append('action', 'designlist');
  data.append('key', getApiKey());
  console.log(getApiKey());
  return new Promise((resolve, reject) => {
    postWithRetry(data)
      .then((res) => {
        const data = res;
        if (data === '') reject('designlist is blank');
        else {
          resolve(data);
        }
      })
      .catch(reject);
  });
};
const fetchDesignThumbNails = ({designsFullPathlist, backColor = '#ffffff'}) => {
  console.log(designsFullPathlist)
  let data = new FormData();
  data.append('action', 'designthumbs');
  data.append('key', getApiKey());
  data.append('files', JSON.stringify(designsFullPathlist));
  data.append('backcolor', backColor);

  return new Promise((resolve, reject) => {
    postWithRetry(data)
      .then((res) => {
        console.log('response from fetch designthumbs')
        console.log(res)
        const data = res;
        if (data === '') reject('designthumbs is blank');
        else {
          resolve(data);
        }
      })
      .catch(reject);
  });
};

const fetchDesignDetails = ({selectedDesign, backColor = "#ffffff"}) => {
  let data = new FormData();
  data.append('action', 'designdetails');
  data.append('key', getApiKey());
  data.append('file', selectedDesign);
  data.append('backcolor', backColor);

  return new Promise((resolve, reject) => {
    postWithRetry(data)
      .then((res) => {
        let designdetails = res;
        if (designdetails === '') reject('designthumbs is blank');
        else {
          resolve(designdetails);
        }
      })
      .catch(reject);
  });
};

const fetchVisualizationTiles = ({ file, zoom, tiles, props }) => {
  let data = new FormData();
  data.append("action", "visualizationtiles");
  data.append("key", getApiKey());
  data.append("file", file);
  data.append("zoom", zoom);
  data.append("tiles", JSON.stringify(tiles))
  if (props)
    data.append("props", JSON.stringify(props))
  return postHttpClient(data).then(path => {
    // const s = path.split("\\")
    // s.splice(3).join("/")
    return `${AppNewProvider.domain}${path}`
  })
}

const getRenderedDesign = async ({ designDetails, fullpath, hash, zoom = 2 }) => {
  const tileSize = 256
  return new Promise((resolve, reject) => {
    const { Width, Height } = designDetails;
    const ratio = Width / Height;
    const canvasWidth = Width * zoom - 2;
    const canvasHeight = canvasWidth / ratio - 2;
    const canvas = createCanvas(canvasWidth, canvasHeight)

    let xTotal = Math.floor((canvasWidth - 1) / 256) + 1;
    let yTotal = Math.floor((canvasHeight - 1) / 256) + 1;
    let tilepoints2X = []
    for (let x = 0; x < xTotal; x++) {
      for (let y = 0; y < yTotal; y++) {
        tilepoints2X.push({ x, y, z: zoom, name: convertTilePointToName(x, y) })
      }
    }
    const context = canvas.getContext("2d")
    AppNewProvider.fetchVisualizationTiles({ file: fullpath, zoom, props: designDetails, tiles: tilepoints2X.map(item => item.name) }).then(basePath => {
      tilepoints2X.forEach((tilePoint, index) => {
        const img = document.createElement("img")
        img.setAttribute("crossOrigin", "Anonymous")
        const { name } = tilePoint
        let filename = `${basePath}/${name}.rendered.jpg`
        if (hash && hash !== "") {
          filename = `${filename}?t=${hash}`
        }
        img.src = filename
        tilePoint.image = img
        img.onload = () => {
          if (index + 1 === tilepoints2X.length) {
            drawInCanvas()
          }
        }
      })
    })
    let index = 0;
    const drawInCanvas = () => {
      if (index < tilepoints2X.length) {
        const tilepoint = tilepoints2X[index]
        context.drawImage(tilepoint.image, tilepoint.x * tileSize, tilepoint.y * tileSize)
        requestAnimationFrame(drawInCanvas)
      }
      if (index === tilepoints2X.length) {
        //design has been drawn in canvas
        // callback(canvas.toDataURL())
        resolve(canvas);
      }
      index++
    }
  })
}

const AppNewProvider = {
  domain,
  fetchApiKey,
  fetchDesignList,
  fetchDesignThumbNails,
  fetchDesignDetails,
  fetchVisualizationTiles,
  getRenderedDesign
};
export default AppNewProvider;
