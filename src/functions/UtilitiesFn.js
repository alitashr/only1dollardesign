const GetFullPathList = (flatDesignList) => {
  var designList = [];
  for (var i = 0; i < flatDesignList.length; i++) {
    designList[i] = flatDesignList[i].FullPath;
  }
  return designList;
};
const GetCurrentPageDesigns = (currentPage, designArray, designsPerPage) => {
  let designsFullPathlist = [];
  if (designArray === undefined) console.log("designArray is blank");
  if (designArray.length > 0) {
    designsFullPathlist = GetFullPathList(
      designArray.slice(currentPage * designsPerPage, (currentPage + 1) * designsPerPage)
    );
  }
  return designsFullPathlist;
};
const Shuffle = (array) => {
  array.sort(() => Math.random() - 0.5);
  return array;
};
const GetDesigns = (data) => {
  let designList = data.filter(function (item) {
    return item.Type === "file";
  });
  for (var i = 0; i < designList.length; i++) {
    designList[i].Extensions = designList[i].FullPath.substr(
      designList[i].FullPath.lastIndexOf(".") + 1,
      designList[i].FullPath.length
    );
    designList[i].Path = designList[i].FullPath.split("/").slice(0, -1).join("/");
    designList[i].OrigIndex = i;
  }
  return designList;
};
const GetFolders = (data) => {
  let folderList = data.filter(function (item, index) {
    return item.Type === "folder" && data.indexOf(item) === index && item.Name !== "Designs";
  });
  return folderList;
};
const FilterDesignList = (designList, filters) => {
  let filteredList = filters.length ? [] : designList;
  if (filters.length > 0) {
    filters.map((filter) => {
      designList.map((design) => {
        if (design.Path === filter) filteredList.push(design);
      });
    });
  }
  filteredList = Shuffle(filteredList);
  return filteredList;
};
const GetNewPageNumber = (direction, thisPageNum, totalPages) => {
  let currentPage = direction === "next" ? thisPageNum + 1 : thisPageNum - 1;
  currentPage = currentPage < 0 ? 0 : currentPage > totalPages ? totalPages : currentPage;
  return currentPage;
};
const alreadyInCart = (selectedDesign, cart) => {
  let currentDesign = selectedDesign;
  let designCart = cart;
  let design1 = designCart.filter((design) => {
    return design.design === currentDesign;
  });
  if (design1.length > 0) return true;
  else return false;
};
const getDesignIndex = (designthumbArray, currentDesign) => {
  var index;
  var obj = designthumbArray.find(function (item, i) {
    if (item.Name === currentDesign) {
      index = i;
      return item;
    }
  });
  return index;
};

const getDesignsListStr = (cart) => {
  let designArrStr = "";
  cart.forEach((element) => {
    let design = element.design.replace("Designs/", "").replace(".ctf", "");
    designArrStr += design + "|";
  });
  const lastBarPos = designArrStr.lastIndexOf("|");
  designArrStr = designArrStr.substr(0, lastBarPos);
  designArrStr = designArrStr.replace(/ /g, "-");
  return designArrStr;
};

const UtilitiesFn = {
  GetFullPathList,
  GetCurrentPageDesigns,
  Shuffle,
  GetDesigns,
  GetFolders,
  FilterDesignList,
  GetNewPageNumber,
  alreadyInCart,
  getDesignIndex,
  getDesignsListStr,
};

export default UtilitiesFn;
