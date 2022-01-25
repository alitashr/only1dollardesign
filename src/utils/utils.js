import axios from "axios";
export function convertArrIntoRad(arrDeg) {
  return arrDeg.map(angle => (angle * Math.PI) / 180);
}
export const convertArrintoDeg = arrRad => {
  return arrRad.map(angle => (angle * 180) / Math.PI);
};

export const createUriSafe = (uriString) => {
  const enc = uriString.split("/").map(encodeURIComponent);
  return enc.join("/");
};
export function fitImageToContainer(image, container) {
  let { width: containerwidth, height: containerheight } = container
  let { width: imagewidth, height: imageheight } = image
  let width = imagewidth,
    height = imageheight;
  if (imagewidth > imageheight) {
    if (width > containerwidth) {
      height = (imageheight * containerwidth) / imagewidth;
      width = containerwidth;
    }
    if (height > containerheight) {
      width = (imagewidth * containerheight) / imageheight;
      height = containerheight;
    }
  } else {
    if (height > containerheight) {
      width = (imagewidth * containerheight) / imageheight;
      height = containerheight;
    }
    if (width > containerwidth) {
      height = (imageheight * containerwidth) / imageheight;
      width = containerwidth;
    }
  }
  return { width, height };
}

export const downloadAsJSON = (object, name) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(object));
  const dlAnchorElem = document.createElement("a");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `${name}.json`);
  dlAnchorElem.click();
};
export const readImage = (url, i) => {
  let imageUrl = url;
  if (url instanceof Blob) {
    imageUrl = URL.createObjectURL(url);
  }
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = imageUrl;
    image.onload = () => {
      if (i)
        resolve({ image, ...i });
      else
        resolve(image);
    };
    image.onerror = reject;
  });
};

export const readJSON = url => {
  return axios.get(url).then(response => response.data);
};

export function fitIntoContainer(image, container) {
  let { offsetWidth: containerwidth, offsetHeight: containerheight } = container;
  let imagewidth = image.width,
    imageheight = image.height;
  if (!image.width || !image.height) return { width: containerwidth, height: containerheight };
  let width = imagewidth,
    height = imageheight;
  const wdif = width - containerwidth;
  const hdif = height - containerheight;
  if (imagewidth > imageheight) {
    if (wdif > hdif) {
      height = containerheight;
      width = (imagewidth * containerheight) / imageheight;
    } else {
      width = containerwidth;
      height = (imageheight * containerwidth) / imagewidth;
    }
    // if (width > containerwidth) {
    //   }
  } else {
    // if (height > containerheight) {
    //   width = (imagewidth * containerheight) / imageheight;
    //   height = containerheight;
    // }
    // if (width > containerwidth) {
    //   height = (imageheight * containerwidth) / imageheight;
    //   width = containerwidth;
    // }
  }
  return { width, height };
}

export function resizeKeepingAspect(image, container, fitType = "fit_inside", resolution = 1) {
  let { width: containerwidth, height: containerheight } = container;
  let { width: imagewidth, height: imageheight } = image;
  if (!imagewidth || !imageheight) return { width: containerwidth, height: containerheight };
  if (containerheight === 0 || containerwidth === 0) return { width: imagewidth, height: imageheight };
  let width = imagewidth,
    height = imageheight;
  //console.log("container: ", containerwidth, containerheight);
  //console.log("image", imagewidth, imageheight);

  switch (fitType) {
    case "fit_inside":
      if (imagewidth > imageheight) {
        if (width > containerwidth) {
          height = (imageheight * containerwidth) / imagewidth;
          width = containerwidth;
        }
        if (height > containerheight) {
          width = (imagewidth * containerheight) / imageheight;
          height = containerheight;
        }
      } else {
        if (height > containerheight) {
          width = (imagewidth * containerheight) / imageheight;
          height = containerheight;
        }
        if (width > containerwidth) {
          height = (imageheight * containerwidth) / imageheight;
          width = containerwidth;
        }
      }
      break;
    case "crop":
      const wdif = width - containerwidth;
      const hdif = height - containerheight;
      if (wdif > hdif) {
        height = containerheight;
        width = (imagewidth * containerheight) / imageheight;
      } else {
        width = containerwidth;
        height = (imageheight * containerwidth) / imagewidth;
      }
      break;

    default:
      break;
  }
  width = width * resolution;
  height = height * resolution;
  return { width, height };
}

// export const safeInvoke = (func)=>{
// if(func) func
// }
export const getExtension = path => {
  const fp = path.split(".");
  return fp[fp.length - 1];
};
export function isiPhone() {
  return (
    //Detect iPhone
    (navigator.platform.indexOf("iPhone") !== -1) ||
    //Detect iPad
    (navigator.platform.indexOf("iPad") !== -1) ||
    //Detect iPod
    (navigator.platform.indexOf("iPod") !== -1)
  );
}
export function scrollIntoViewIfNeeded(target) {
  var rect = target.getBoundingClientRect();
  if (rect.bottom > window.innerHeight) {
    target.scrollIntoView(false);
  }
  if (rect.top < 0) {
    target.scrollIntoView();
  }
}

export const isIE = () => window.navigator.userAgent.indexOf("MSIE ") > 0 ||
  // eslint-disable-next-line no-useless-escape
  !!navigator.userAgent.match(/Trident.*rv\:11\./)

export function convertNumberToFeetInch(f, unit) {
  if (unit !== "ft") return f;
  var ft = Math.floor(f);
  var inch = Math.round(12 * (f - ft));
  if (inch === 12) {
    ft++;
    inch = 0;
  }
  return ft + "′" + (inch > 0 ? inch + "″" : "");
}
export function convertFeetInchToNumber(f, unit) {
  if (unit !== "ft") return f;
  var rex = /[-+]?[0-9]*\.?[0-9]+/g;
  var match = f.match(rex);
  var feet, inch;
  if (match) {
    feet = parseFloat(match[0]);
    inch = match.length > 1 ? parseFloat(match[1]) : 0;
    if (feet > 0 && inch >= 0 && inch < 12) {
      return feet + inch / 12;
    }
  }
  return null;
}
export function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
export const leftFillNum = (num, targetLength) =>
  num.toString().padStart(targetLength, 0);
export const convertTilePointToName = (i, j) => `${leftFillNum(i, 2)}_${leftFillNum(j, 2)}`
export const convertNameToTilePoint = name => {
  const x = parseInt(name.trim().substring(0, 2))
  const y = parseInt(name.trim().substring(3, 5))
  return { x, y }
}

export const getPathFromString = string => {
  const x = string.split("/");
  x.pop();
  return x.join("/")
}
export const createAsyncQueue = (tasks, maxNumOfWorkers = 5) => {
  var numOfWorkers = 0;
  var taskIndex = 0;

  return new Promise(done => {
    const handleResult = index => result => {
      tasks[index] = result;
      numOfWorkers--;
      getNextTask();
    };
    const getNextTask = () => {
      if (numOfWorkers < maxNumOfWorkers && taskIndex < tasks.length) {
        tasks[taskIndex].then(handleResult(taskIndex)).catch(handleResult(taskIndex));
        taskIndex++;
        numOfWorkers++;
        getNextTask();
      } else if (numOfWorkers === 0 && taskIndex === tasks.length) {
        done(tasks);
      }
    };
    getNextTask();
  });
}
export const mergeArraysWithoutDuplicate = (...arrays) => {
  let jointArray = []

  arrays.forEach(array => {
    jointArray = [...jointArray, ...array]
  })
  const uniqueArray = jointArray.filter((item, index) => jointArray.indexOf(item) === index)
  return uniqueArray
}
export const areaOfellipse = (x, y) => Math.PI * x * y


export const createVector = (p, camera, width, height) => {
  var vector = p.project(camera);

  vector.x = ((vector.x + 1) / 2) * width;
  vector.y = (-(vector.y - 1) / 2) * height;

  return vector;
};

export const getDesignPathInTitle = designPath => {
  if (!designPath) return "";
  const dotPos = designPath.lastIndexOf(".");
  designPath = designPath.substring(0, dotPos);

  let title = designPath.replace(/\/\./g, '/')
    .split("/")
    .slice(1)
    .join("/");
  return title;
};

export const getDesignName = (designPath) => {
  var dotpos = designPath.lastIndexOf(".");
  var slashpos = designPath.lastIndexOf("/") + 1;
  var roomName = designPath.substr(slashpos, dotpos - slashpos);
  return roomName;
};

export const validateEmail = email => {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
};
export const getCacheId = (designPath) => {
  //to change
  //designPath: "https://v3.explorug.com/dev/Static/AF802D76625EA3B4066EC8241EB98997/Designs/Abstract/Beeth Anten.thumb.jpg"
  const startPos = designPath.lastIndexOf('Assets/') + 7;
  const endPos = designPath.lastIndexOf('/Designs');
  const cacheId = designPath.substr(startPos, endPos - startPos);
  return cacheId;
};

export const getDesignsListStr = (cart) => {
  let designArrStr = '';
  cart.forEach((element) => {
    let design = element.design.replace('Designs/', '').replace('.ctf', '');
    designArrStr += design + '|';
  });
  const lastBarPos = designArrStr.lastIndexOf('|');
  designArrStr = designArrStr.substr(0, lastBarPos);
  //designArrStr = designArrStr.replace(/ /g, '-');
  return designArrStr;
};

export const getZipFilename = (buyerName) => {
  let randomNum = Math.round(Math.random() * 10000000000);
  let buyerStr = buyerName.replace(/ /g, '');
  let filename = buyerStr + randomNum; //"shrestha230292";
  return filename;
};
