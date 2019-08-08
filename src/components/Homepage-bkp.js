import React, {useEffect, useReducer} from 'react';
import {Container, Row, Col} from 'react-bootstrap';


import { setGlobal } from 'reactn';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import '../App.css';

import FAQ from './FAQ';

import FooterBar from './FooterBar';

import AppProvider from '../functions/AppProvider';
import UtilitiesFn from '../functions/UtilitiesFn';
import DesignsPage from './DesignsPage';

import DesignsFilter from './DesignsFilter';
import DesignCategory from './DesignCategory';
import DesignsList from './DesignsList';
import Pagenav from './Pagenav';
import FullDesign from './FullDesign';
import SocialMediaShare from './SocialMediaShare';
import Checkout from './Checkout';
import { Copyright, FooterLinks } from './StyledComponents';


let app = new AppProvider();
let utilityFn = new UtilitiesFn();

let callCount =0;
let designsPerPage = 10;

export const FilterContext = React.createContext();
export const DesignThumbsContext = React.createContext();
export const CurrentPageContext = React.createContext();
export const DesignContext =  React.createContext();
export const CheckoutContext =  React.createContext();


const details={
    Carving: 0,
    DesignColors: [],
    DesignInfo: null,
    Height: 1000,
    IsIrregular: false,
    KLRatio: 1,
    NumColors: 0,
    OrderProperties: null,
    PhysicalHeight: 250,
    PhysicalWidth: 200,
    RenderingProperties: {RenderedImagePath: ""},
    Unit: "cm",
    Width: 800
}

const initialState ={
    key:'',
    selectedFilters:["Designs/Abstract"],
    designCategories:[],
    designThumbs:[],
    showContentLoadingSignal:true,
    designLoading:false,
    selectedDesign: '',
    selectedThumb: '',
    inCart: false,
    designDetails: '',
    firstDesign: false,
    cart:[],
    checkout:false
    
}
export const WholeContext =  React.createContext(initialState);

const reducer = (state, action)=>{
    console.log(action);
    switch (action.type){
        case 'set_designCategories':
            return{
                ...state,
                designCategories:action.payload
            }
        case 'set_selectedFilters':
            return{
                ...state,
                selectedFilters:action.payload
            }
        case 'set_designThumbs':
            return{
                ...state,
                designThumbs:action.payload,
                showContentLoadingSignal:false
            }
        case 'set_currentpage':
            return{
                ...state,
                currentPage:action.payload
            }
        case 'set_BusySignal':
            return {
                ...state,
                showContentLoadingSignal:action.payload
            }
        case 'set_selectedThumb':
            return{
                ...state,
                selectedThumb:action.payload
            }
        case 'set_selectedDesign':
            return{
                ...state,
                selectedDesign: action.payload
            }
        case 'set_designDetails':
            return{
                ...state,
                designDetails: action.payload
            }
        case 'set_inCart':
            return{
                ...state,
                inCart:action.payload
            }
        case 'set_designLoading':
            return{
                ...state,
                designLoading: action.payload
            }
        case 'set_firstDesign':
            return{
                ...state,
                firstDesign: action.payload
            }
        case 'set_cart':
            return{
                ...state,
                cart: action.payload
            }
        case 'set_checkout':
            return{
                ...state,
                checkout:action.payload
            }
        default:
            return state
    }
}
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
const handleAddToCart =(imgSrc, selectedDesign)=>{
    return new Promise((resolve, reject)=>{
        console.log('in cart? '+ alreadyInCart(selectedDesign))
        if(!alreadyInCart(selectedDesign)){
            addDesignToCart(imgSrc, selectedDesign).then(()=>{
                console.log('to buy design now');
                resolve(true);
            });
        }
        else{
            resolve(true);
        }
    })
}
const handleBuyThis = (imgSrc, selectedDesign) =>{
    return new Promise((resolve, reject)=>{
        let fulldesignSrc =imgSrc;
        if(!alreadyInCart(selectedDesign))
            addDesignToCart(fulldesignSrc, selectedDesign).then(()=>{
                console.log('to buy design now')
                resolve(true);
            });
        else{
            resolve(true);
        }
    })
}
const alreadyInCart = (currentDesign)=>{
    //let currentDesign = selectedDesign;
    let designCart = initialState.cart;
    let design1 = designCart.filter((design)=>{
        return design.design === currentDesign
    });
    if(design1.length>0) return true;
    else return false;
}
const addDesignToCart = (fulldesignSrc, selectedDesign)=>{
    return new Promise((resolve, reject) => {
        let designToAdd = selectedDesign;
        let designCart = initialState.cart;
        let selectedThumb =  initialState.selectedThumb;

        designCart.push({design:designToAdd, thumb: selectedThumb, fullDesign: fulldesignSrc});

        initialState.cart  = designCart;
        console.log('addDesignToCart')
        console.log(initialState.cart);
        resolve();
       
    });
}
const removeItemFromCart =(index) =>{
    let designcart = initialState.cart;
    designcart.splice(index, 1);
    console.log(designcart)
    initialState.cart = designcart;
}

const LoadCurrentPageDesigns = (currentPage, filteredList)=> {
    return new Promise((resolve, reject)=>{
        let currentPageDesigns = utilityFn.GetCurrentPageDesigns(currentPage, filteredList, designsPerPage);
        console.log(currentPageDesigns);
        app.GetDesignThumbs(initialState.key, currentPageDesigns).then((thumbList) => {
               initialState.currentPage = currentPage;
               initialState.designThumbs= thumbList;
               resolve(initialState.designThumbs);
        });
    });
};
const getDesignIndex =(designthumbArray,currentDesign)=>{
    var index;
    var obj = designthumbArray.find(function(item, i){
        if(item.Name === currentDesign){
            index=i;
            return item;
        }
    });
    return index;
}
const indexVariables=(direction)=>{
    const currentDesign = initialState.selectedDesign;
    let designthumbArray = initialState.designThumbs;
    let index = getDesignIndex(designthumbArray,currentDesign);
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
        console.log(currentPage, loadNewBool);
        if(loadNewBool){
            filteredList = utilityFn.FilterDesignList(initialState.designList,initialState.selectedFilters);
            initialState.totalPages = Math.floor(filteredList.length/designsPerPage);
            initialState.filteredDesignList= filteredList; 
        }
        LoadCurrentPageDesigns(currentPage, filteredList).then((thumbList)=>{
            console.log('current page loaded')
            console.log(thumbList)
            resolve(thumbList);
        });   
    });
}
const Homepage = () => {
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
                dispatch({
                    type: 'set_currentpage',
                    payload: 0
                });  
                LoadPage(0, true);
               
             });
        });
    },[]);
    useEffect(()=>{
        window.addEventListener('popstate', (event) => {
            console.log(event);
            if (event.state) {
              //do your code here
            }
           }, false);
    },[])
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
            let index = getDesignIndex(designthumbArray,selectedDesign);
            const firstDesign = (index===0 && initialState.currentPage===0)
            dispatch({
                type: 'set_firstDesign',
                payload: firstDesign
            });
            
        })
    }
    const handleClose = ()=>{
        dispatch({
            type: 'set_selectedDesign',
            payload: ''
        });
    }
    const handleCart = (imgSrc, selectedDesign, action) =>{
        if(action === 'add'){
            handleAddToCart(imgSrc, selectedDesign).then((added)=>{
                console.log('state of cart');
                console.log(initialState.cart);
                dispatch({
                    type: 'set_cart',
                    payload: initialState.cart
                });
                dispatch({
                    type: 'set_inCart',
                    payload: added
                });
            }) 
        }
        else{
            handleBuyThis(imgSrc, selectedDesign).then((added)=>{
                console.log('state of cart');
                console.log(initialState.cart);
                dispatch({
                    type: 'set_cart',
                    payload: initialState.cart
                });
                dispatch({
                    type: 'set_inCart',
                    payload: added
                });
            })
        }
            
    }
    const handleDesignChange = (direction)=>{
        let designthumbArray = initialState.designThumbs;
        let {index, currentPage, loadNewPage } = indexVariables(direction);
        if(loadNewPage){
            LoadPage(currentPage, false).then((thumbList)=>{
                console.log(thumbList)
                initialState.selectedDesign  = thumbList[index].Name;
                initialState.selectedThumb = "https://explorug.com/v2/" + thumbList[index].Value;
                selectDesign(initialState.selectedDesign, initialState.selectedThumb);        
            });
        }
        else{
            initialState.selectedDesign = designthumbArray[index].Name;
            initialState.selectedThumb = "https://explorug.com/v2/" + designthumbArray[index].Value;
            selectDesign(initialState.selectedDesign, initialState.selectedThumb);          
        }
    }
    const goToCheckout = ()=>{
        dispatch({
            type: 'set_checkout',
            payload: true
        });
      
        
    }
    return (
             <CheckoutContext.Provider value={{
                cart: state.cart,
                dispatch: dispatch,
                checkout:state.checkout
            }}>
            {/* <Router>
                <Route path='/' component={DesignsPage} />
                <Route exact path='/faq' component={FAQ}/>  
                <Route path='/checkout' component={DesignsPage}/>
                  
                
            </Router>  */}
           
            <div>
                {
                    state.checkout ?
                    <Checkout></Checkout>
                    :
                    <div>
                        <Container>
                            <FilterContext.Provider value={{
                                selectedFilters: state.selectedFilters,
                                designCategories: state.designCategories,
                                filterDispatch: dispatch,
                                selectCategory: selectCategory
                            }}>
                            <Row>
                                <Col xs={8}> 
                                    <DesignsFilter/>
                                </Col>
                                <Col> 
                                    <DesignCategory/>
                                </Col>
                            </Row>
                            </FilterContext.Provider>
                            <DesignThumbsContext.Provider value={{
                                designThumbs: state.designThumbs,
                                showContentLoadingSignal:state.showContentLoadingSignal,
                                selectDesign: selectDesign
                            }}>
                                <DesignsList />
                            </DesignThumbsContext.Provider>

                        <CurrentPageContext.Provider value={{
                            currentPage: state.currentPage,
                            pageDispatch: dispatch,
                            handlePageChange: handlePageChange
                        }}>
                         <Pagenav />
                        </CurrentPageContext.Provider>

                        <DesignContext.Provider value={{
                            loading: state.designLoading,
                            selectedDesign: state.selectedDesign,
                            designDetails: state.designDetails,
                            inCart: state.inCart,
                            firstDesign: state.firstDesign,
                            designDispatch: dispatch,
                            handleClose: handleClose,
                            handleCart:handleCart,
                            handleDesignChange :handleDesignChange,
                            goToCheckout: goToCheckout
                        }}>
                    
                        <FullDesign/>
                        </DesignContext.Provider>
            
                        </Container>
                        <SocialMediaShare/>
                        <Copyright textCenter>
                            © Alternative Technology 2019 - All rights reserved
                            <div>     
                                <FooterLinks>
                                Terms of Use
                                </FooterLinks>
                            </div>
                        </Copyright>
                    
                    </div>
                }
            </div>
                <FooterBar/>
            
            </CheckoutContext.Provider>
       
    );
};

export default Homepage;