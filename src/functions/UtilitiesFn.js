import React, { Component } from 'react';

class UtilitiesFn extends Component {
    
    GetFullPathList = (flatDesignList)=> {
        var designList = [];
        for (var i = 0; i < flatDesignList.length; i++) {
            designList[i] = flatDesignList[i].FullPath; 
        }
        return designList;
    }
    GetCurrentPageDesigns = (currentPage, designArray, designsPerPage)=>{
        let designsFullPathlist =[];
        if(designArray ===undefined ) console.log('designArray is blank');
        if(designArray.length>0){
            designsFullPathlist = this.GetFullPathList(designArray.slice(currentPage*designsPerPage,(currentPage+1)*designsPerPage));
        }
        return designsFullPathlist;
    }
    Shuffle = (array) => {
        array.sort(() => Math.random() - 0.5);
        return array;
    }
    GetDesigns = (data)=>{
        let designList = data.filter(function(item) {
            return item.Type === 'file'
          });
          for (var i = 0; i < designList.length; i++) {
            designList[i].Extensions = designList[i].FullPath.substr(designList[i].FullPath.lastIndexOf('.') + 1, designList[i].FullPath.length);
            designList[i].Path = designList[i].FullPath.split('/').slice(0, -1).join('/');
            designList[i].OrigIndex = i;
          }
        return designList;
    }
    GetFolders = (data)=>{
        let folderList = data.filter(function(item, index) {
            return item.Type === 'folder' && data.indexOf(item) === index && item.Name!=="Designs"
          });
        return folderList;
    }
    FilterDesignList=(designList, filters)=>{
        let filteredList = filters.length ? []: designList;
        if(filters.length>0){
            filters.map(filter=>{
                designList.map(design=>{
                    if(design.Path === filter)
                    filteredList.push(design);
                })
            });
        }
        filteredList = this.Shuffle(filteredList);
        return filteredList;
    }
    GetNewPageNumber=(direction, thisPageNum, totalPages) =>{
        let currentPage = direction === 'next' ? thisPageNum + 1 : thisPageNum - 1;
        currentPage = currentPage < 0 ? 0 : currentPage > totalPages ? totalPages : currentPage;
        return currentPage;
    }
    alreadyInCart = (selectedDesign, cart)=>{
        let currentDesign = selectedDesign;
        let designCart = cart;
        let design1 = designCart.filter((design)=>{
            return design.design === currentDesign
        });
        if(design1.length>0) return true;
        else return false;
    }
    getDesignIndex = (designthumbArray,currentDesign)=>{
        var index;
        var obj = designthumbArray.find(function(item, i){
            if(item.Name === currentDesign){
                index=i;
                return item;
            }
        });
        return index;
    }
    
}

export default UtilitiesFn;