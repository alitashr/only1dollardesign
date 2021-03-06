import React, { useEffect, useReducer, useState } from "react";
import { HashRouter as Router, Route, Routes, useParams } from "react-router-dom";

import "./App.css";
import "./index.scss";

import FAQ from "./components/FAQ";

import Checkout from "./components/Checkout";
import FooterBar from "./components/FooterBar";
import DesignsPage from "./components/DesignsPage";
import SocialMediaShare from "./components/SocialMediaShare";
import ThankyouPage from "./components/ThankyouPage";

import { Copyright, FooterLinks } from "./components/StyledComponents";

import UtilitiesFn from "./functions/UtilitiesFn";
import { Context, reducer, initialState } from "./store";
import Coupon from "./components/Coupon";

import AppNewProvider from "./api/appProvider";
import CheckoutVisaCard from "./components/CheckoutVisaCard";
import PaymentFailPage from "./components/PaymentFailPage";
import CheckoutPaypal from "./components/CheckoutPaypal";

let designsPerPage = 10;
let APIdomain = AppNewProvider.domain;

export const CurrentPageContext = React.createContext();
export const DesignContext = React.createContext();

export const WholeContext = Context;

const login = () => {
  return new Promise((resolve, reject) => {
    const username = "o1dd";
    const password = "oodd";

    AppNewProvider.fetchApiKey({ username, password })
      .then((key) => resolve(key))
      .catch((err) => reject(err));
  });
};

const LoadCurrentPageDesigns = (currentPage, filteredList) => {
  return new Promise((resolve, reject) => {
    let currentPageDesigns = UtilitiesFn.GetCurrentPageDesigns(currentPage, filteredList, designsPerPage);

    AppNewProvider.fetchDesignThumbNails({ designsFullPathlist: currentPageDesigns }).then((thumbList) => {
      initialState.currentPage = currentPage;
      initialState.designThumbs = thumbList;
      resolve(initialState.designThumbs);
    });
    //   app.GetDesignThumbs(initialState.key, currentPageDesigns).then((thumbList) => {
    //          initialState.currentPage = currentPage;
    //          initialState.designThumbs= thumbList;
    //          resolve(initialState.designThumbs);
    //   });
  });
};
const indexVariables = (direction) => {
  const currentDesign = initialState.selectedDesign;
  let designthumbArray = initialState.designThumbs;
  let index = UtilitiesFn.getDesignIndex(designthumbArray, currentDesign);
  let totalPages = initialState.totalPages;
  let currentPage = initialState.currentPage;
  let loadNewPage = false;
  if (direction === "next") {
    if (index === designthumbArray.length - 1) {
      index = 0;
      currentPage = initialState.currentPage === totalPages ? 0 : initialState.currentPage + 1;
      loadNewPage = true;
    } else {
      index++;
    }
  } else {
    if (index === 0) {
      index = designsPerPage - 1;
      currentPage = initialState.currentPage === 0 ? totalPages : initialState.currentPage - 1;
      loadNewPage = true;
    } else {
      index--;
    }
  }
  return {
    index: index,
    currentPage: currentPage,
    loadNewPage: loadNewPage,
  };
};
const LoadCurrentPage = (currentPage, loadNewBool) => {
  return new Promise((resolve, reject) => {
    initialState.currentPage = currentPage;
    let filteredList = initialState.filteredDesignList;

    if (loadNewBool) {
      filteredList = UtilitiesFn.FilterDesignList(initialState.designList, initialState.selectedFilters);
      initialState.totalPages = Math.floor(filteredList.length / designsPerPage);
      initialState.filteredDesignList = filteredList;
    }
    LoadCurrentPageDesigns(currentPage, filteredList).then((thumbList) => {
      resolve(thumbList);
    });
  });
};

const openTOU = () => {
  window.open("pdf/termsofuse.html", "_blank");
};
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  //console.log("App -> state", state)
  const [year, setYear] = useState("");

  useEffect(() => {
    const d = new Date();
    let year = d.getFullYear();
    setYear(year);
    login().then((key) => {
      AppNewProvider.fetchDesignList().then((data) => {
        let designs = UtilitiesFn.GetDesigns(data);
        // console.log("AppNewProvider.fetchDesignList -> designs", designs);

        let folders = UtilitiesFn.GetFolders(data);
        initialState.designList = designs;
        initialState.designCategories = folders;
        initialState.key = key;
        dispatch({
          type: "set_designCategories",
          payload: folders,
        });
        dispatch({
          type: "set_designList",
          payload: designs,
        });
        LoadPage(0, true);
      });
    });
  }, []);
  useEffect(() => {
    let localCart = window.sessionStorage.getItem("cart") || "[]";

    dispatch({
      type: "set_cart",
      payload: JSON.parse(localCart),
    });
  }, []);
  const LoadPage = (currentPage, loadNewBool) => {
    return new Promise((resolve, reject) => {
      loadNewBool = loadNewBool ? loadNewBool : false;
      LoadCurrentPage(currentPage, loadNewBool).then((thumbList) => {
        dispatch({
          type: "set_currentpage",
          payload: initialState.currentPage,
        });

        dispatch({
          type: "set_designThumbs",
          payload: thumbList,
        });
        resolve(thumbList);
      });
    });
  };

  const handlePageChange = (direction) => {
    let currentPage = UtilitiesFn.GetNewPageNumber(direction, initialState.currentPage, initialState.totalPages);
    LoadPage(currentPage);
  };
  const selectCategory = (filterList) => {
    initialState.selectedFilters = filterList;
    dispatch({
      type: "set_selectedFilters",
      payload: filterList,
    });
    LoadPage(0, true);
  };
  function search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].Name === nameKey) {
        return myArray[i];
      }
    }
  }

  const selectDesign = (selectedDesign, selectedThumb, props) => {
    dispatch({
      type: "set_designLoading",
      payload: true,
    });
    //dispatch({ type: "set_BusySignal", payload: true });
    var designdetails = props;
    if (!props) {
      var designElem = search(selectedDesign, initialState.designThumbs);
      designdetails = designElem.Props;
    }
    AppNewProvider.getFullRenderedDesign({ designDetails: designdetails, fullpath: selectedDesign }).then((canvas) => {
      dispatch({
        type: "set_designCanvas",
        payload: canvas,
      });
      let inCart = UtilitiesFn.alreadyInCart(selectedDesign, initialState.cart) ? true : false;
      initialState.selectedDesign = selectedDesign;
      initialState.designDetails = designdetails;
      initialState.inCart = inCart;
      initialState.selectedThumb = selectedThumb;

      dispatch({ type: "set_selectedThumb", payload: selectedThumb });

      dispatch({
        type: "set_designDetails",
        payload: designdetails,
      });
      dispatch({
        type: "set_selectedDesign",
        payload: selectedDesign,
      });
      dispatch({
        type: "set_inCart",
        payload: inCart,
      });
      dispatch({ type: "set_BusySignal", payload: false });

      //check if first
      let designthumbArray = initialState.designThumbs;
      let index = UtilitiesFn.getDesignIndex(designthumbArray, selectedDesign);
      const firstDesign = index === 0 && initialState.currentPage === 0;
      dispatch({
        type: "set_firstDesign",
        payload: firstDesign,
      });
    });
  };
  const handleDesignChange = (direction) => {
    let designthumbArray = initialState.designThumbs;
    let { index, currentPage, loadNewPage } = indexVariables(direction);
    if(!index) index = 0;
    if (loadNewPage) {
      LoadPage(currentPage, false).then((thumbList) => {
        initialState.selectedDesign = thumbList[index].Name;
        initialState.selectedThumb = APIdomain + thumbList[index].Thumb;
        selectDesign(initialState.selectedDesign, initialState.selectedThumb);
      });
    } else {
      initialState.selectedDesign = designthumbArray[index].Name;
      initialState.selectedThumb = APIdomain + designthumbArray[index].Thumb;
      selectDesign(initialState.selectedDesign, initialState.selectedThumb);
    }
  };

  return (
    <div className="App" style={{ padding: "0 1em" }}>
      <WholeContext.Provider value={{ state, dispatch }}>
        <DesignContext.Provider
          value={{
            selectCategory: selectCategory,
            selectDesign: selectDesign,
            handleDesignChange: handleDesignChange,
          }}
        >
          <CurrentPageContext.Provider
            value={{
              handlePageChange: handlePageChange,
            }}
          >
            <Router>
              {/* <Switch> */}
              <Routes>
                <Route path="/" element={<DesignsPage />} />
                <Route path="/:designname" element={<DesignsPage />} />
                <Route path="/#home" element={<DesignsPage />} />
                <Route path="faq" element={<FAQ />} />
                <Route exact path="/checkout" element={<Checkout />} />
                <Route exact path="/thank" element={<ThankyouPage />} />
                <Route exact path="/payment_fail" element={<PaymentFailPage />} />
                <Route exact path="/coupon" element={<Coupon />} />
                <Route exact path="/visacard" element={<CheckoutVisaCard />} />
                <Route exact path="/paypal" element={<CheckoutPaypal />} />
              </Routes>
              {/* render={ (props) => <Checkout data= {state.cart} {...props} removeItemFromCart ={removeItemFromCart} />}/> */}
              {/* </Switch> */}

              <SocialMediaShare />
              <Copyright id="copyright" textCenter>
                ?? Alternative Technology {year} - All rights reserved
                <div>
                  <FooterLinks onClick={openTOU}>Terms of Use</FooterLinks>
                </div>
              </Copyright>
              <FooterBar openTou={openTOU} />
            </Router>
          </CurrentPageContext.Provider>
        </DesignContext.Provider>
      </WholeContext.Provider>
    </div>
  );
};

export default App;
