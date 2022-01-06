import React from "react";

export const initialState ={
    key:'',
    selectedFilters:[],
    designCategories:[],
    designThumbs:[],
    showContentLoadingSignal:true,
    designLoading:false,
    selectedDesign: '',
    selectedThumb: '',
    inCart: false,
    designDetails: '',
    designCanvas:'',
    firstDesign: false,
    cart:[],
    checkout:false
    
  }
  export const Context =  React.createContext(initialState);
  
  export const reducer = (state, action)=>{
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
        case 'set_designCanvas':
            return{
                ...state,
                designCanvas: action.payload
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
        default:
            return state
    }
  }
  