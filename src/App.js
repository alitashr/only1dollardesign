import React, {useEffect, useReducer} from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import './App.css';

import FAQ from './components/FAQ';

import Checkout from './components/Checkout';
import FooterBar from './components/FooterBar';
import DesignsPage from './components/DesignsPage';
import SocialMediaShare from './components/SocialMediaShare';
import ThankyouPage from './components/ThankyouPage';

import { Copyright, FooterLinks } from './components/StyledComponents';


import AppProvider from './functions/AppProvider';
import UtilitiesFn from './functions/UtilitiesFn';
import {Context, reducer, initialState } from "./store";
import Coupon from './components/Coupon';


let app = new AppProvider();
let utilityFn = new UtilitiesFn();

let callCount =0;
let designsPerPage = 10;
let APIdomain= "https://explorug.com/v2/";

export const CurrentPageContext = React.createContext();
export const DesignContext =  React.createContext();

export const WholeContext = Context;

const login=()=>{
  return new Promise((resolve, reject)=>{
      app.GetKey("o1dd", "oodd").then((data)=>{
          if(data===''&& callCount<2){
              callCount++;
              login();
          }
          else if(data!==''){
              resolve (data);
          }
          else{
              reject('error while getting key');
          }
      })
  
  })
}

const LoadCurrentPageDesigns = (currentPage, filteredList)=> {
  return new Promise((resolve, reject)=>{
      let currentPageDesigns = utilityFn.GetCurrentPageDesigns(currentPage, filteredList, designsPerPage);
      
      app.GetDesignThumbs(initialState.key, currentPageDesigns).then((thumbList) => {
             initialState.currentPage = currentPage;
             initialState.designThumbs= thumbList;
             resolve(initialState.designThumbs);
      });
  });
};
const indexVariables=(direction)=>{
  const currentDesign = initialState.selectedDesign;
  let designthumbArray = initialState.designThumbs;
  let index = utilityFn.getDesignIndex(designthumbArray,currentDesign);
  let totalPages = initialState.totalPages;
  let currentPage = initialState.currentPage;
  let loadNewPage = false;
  if(direction === 'next'){
      if(index === designthumbArray.length-1)
      {
          index=0;
          currentPage = initialState.currentPage ===  totalPages ? 0: initialState.currentPage + 1;
          loadNewPage = true;
      }
      else{
          index++;
      }
  }else{
      if(index===0){
          index = designsPerPage - 1;
          currentPage = initialState.currentPage === 0 ? totalPages: initialState.currentPage - 1;
          loadNewPage = true;
      }
      else{
          index--;
      }
  }
 return {
  index:index,
  currentPage: currentPage,
  loadNewPage: loadNewPage
 }
}
const LoadCurrentPage = (currentPage, loadNewBool) =>{
  return new Promise((resolve, reject)=>{
      initialState.currentPage = currentPage;
      let filteredList = initialState.filteredDesignList;
      
      if(loadNewBool){
          filteredList = utilityFn.FilterDesignList(initialState.designList,initialState.selectedFilters);
          initialState.totalPages = Math.floor(filteredList.length/designsPerPage);
          initialState.filteredDesignList= filteredList; 
      }
      LoadCurrentPageDesigns(currentPage, filteredList).then((thumbList)=>{
          resolve(thumbList);
      });   
  });
}

const openTOU = ()=>{
    window.open("pdf/termsofuse.html", "_blank")
}
const App = ()=> {
  const [state, dispatch] = useReducer(reducer, initialState)
   
  useEffect(()=>{
      login().then((key)=>{
          app.GetDesignList(key).then((data)=>{  
              let designs = utilityFn.GetDesigns(data);
              let folders = utilityFn.GetFolders(data);
              initialState.designList = designs;
              initialState.designCategories = folders;
              initialState.key = key;
              console.log('initial key '+initialState.key)
              dispatch({
                  type: 'set_designCategories',
                  payload: folders
              });
             
              LoadPage(0, true);
             
           });
      });
  },[]);
  useEffect(()=>{
    let localCart = window.localStorage.getItem('cart') || "[]";
    
    dispatch({
      type: 'set_cart',
      payload: JSON.parse(localCart)
     });  

  }, []);
const LoadPage = (currentPage, loadNewBool) =>{
    return new Promise((resolve, reject)=>{
        loadNewBool = loadNewBool ? loadNewBool: false;
        LoadCurrentPage(currentPage, loadNewBool).then((thumbList)=>{
            
            dispatch({
                type: 'set_currentpage',
                payload: initialState.currentPage
            });  
            
            dispatch({
                type: 'set_designThumbs',
                payload: thumbList
            });  
            resolve(thumbList);
        });
    });
}

const handlePageChange = (direction)=>{
    console.log(direction);
    let currentPage = utilityFn.GetNewPageNumber(direction, initialState.currentPage, initialState.totalPages);
    LoadPage(currentPage);
}
const selectCategory = (filterList)=>{
    initialState.selectedFilters = filterList;
    dispatch({
        type: 'set_selectedFilters',
        payload: filterList
    });
    LoadPage(0, true);
}
const selectDesign=(selectedDesign, selectedThumb)=>{
    dispatch({
        type: 'set_designLoading',
        payload: true
    });
    
    app.GetDesignDetails(initialState.key, selectedDesign).then((designdetails)=>{
        console.log(designdetails)
        let inCart = utilityFn.alreadyInCart(selectedDesign, initialState.cart) ? true:false;
        
        initialState.selectedDesign = selectedDesign;
        initialState.designDetails = designdetails;
        initialState.inCart = inCart;
        initialState.selectedThumb= selectedThumb;

        dispatch({type: 'set_selectedThumb', payload: selectedThumb });
       
        dispatch({
            type: 'set_designDetails',
            payload: designdetails
        });
        dispatch({
            type: 'set_selectedDesign',
            payload: selectedDesign
        });
        dispatch({
            type: 'set_inCart',
            payload: inCart
        });
        
        //check if first
        let designthumbArray = initialState.designThumbs;
        let index = utilityFn.getDesignIndex(designthumbArray,selectedDesign);
        const firstDesign = (index===0 && initialState.currentPage===0)
        dispatch({
            type: 'set_firstDesign',
            payload: firstDesign
        });
        
    })
}
const handleDesignChange = (direction)=>{
    let designthumbArray = initialState.designThumbs;
    let {index, currentPage, loadNewPage } = indexVariables(direction);
    if(loadNewPage){
        LoadPage(currentPage, false).then((thumbList)=>{
            console.log(thumbList)
            initialState.selectedDesign  = thumbList[index].Name;
            initialState.selectedThumb = APIdomain + thumbList[index].Value;
            selectDesign(initialState.selectedDesign, initialState.selectedThumb);        
        });
    }
    else{
        initialState.selectedDesign = designthumbArray[index].Name;
        initialState.selectedThumb = APIdomain + designthumbArray[index].Value;
        selectDesign(initialState.selectedDesign, initialState.selectedThumb);          
    }
}
  return (
    <div className="App">
       <WholeContext.Provider value={{ state, dispatch }}>

            <DesignContext.Provider value={{            
                selectCategory: selectCategory,     
                selectDesign: selectDesign,           
                handleDesignChange :handleDesignChange
            }}>
            <CurrentPageContext.Provider value={{
                handlePageChange: handlePageChange
            }}>
                
            <Router>
                <Switch>
                <Route exact path='/' component={DesignsPage} />
                <Route exact path='/faq' component={FAQ}/>  
                <Route exact path='/checkout'  component = {Checkout}
                />
                <Route exact path = '/thank' component={ThankyouPage}/>
                <Route exact path='/coupon' component={Coupon}/>  
                
                {/* render={ (props) => <Checkout data= {state.cart} {...props} removeItemFromCart ={removeItemFromCart} />}/> */}
                </Switch>

                <SocialMediaShare/>
                <Copyright id="copyright" textCenter>
                      © Alternative Technology 2019 - All rights reserved
                      <div>     
                            <FooterLinks onClick={openTOU}>
                            Terms of Use
                            </FooterLinks>
                      </div>
                </Copyright>
                <FooterBar openTou={openTOU}/>
            </Router> 
            
            </CurrentPageContext.Provider>

            </DesignContext.Provider>
            
        </WholeContext.Provider>
       
     
    </div>
  );
}

export default App;
