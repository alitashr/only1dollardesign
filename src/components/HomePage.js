import React, { Component } from 'react';
import DesignsList from './DesignsList';
import DesignsFilter from './DesignsFilter';
import DesignCategory from './DesignCategory';
import FooterBar from './FooterBar';
import SocialMediaShare from './SocialMediaShare';
import {Container, Row, Col} from 'react-bootstrap';
import FullDesign from './FullDesign';

import axios from 'axios';
import Checkout from './Checkout';
import FAQ from './FAQ';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.domain = "https://explorug.com/v2";
        var details={
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
        let navTabs = ["designs", "faq","checkout"];
        
        this.state={
            key:'',
            designList:[],
            designCategories : ["Abstract","Border","Repeat", "Designers Collection"],
            selectedFilters:[],
            filteredDesignList:[],
            designThumbs:[],
            currentPage:0,
            totalPages:0,
            busy:true,
            fullDesignLoading: true,
            selectedThumb:'',
            selectedDesign:'',
            InCart: false,
            designDetails: details,
            cart:[],
            checkout:false
        }
        this.callCount=0;
        this.designsPerPage =10;
        this.selectCategory = this.selectCategory.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePopUpClose = this.handlePopUpClose.bind(this);
        this.handleDesignChange = this.handleDesignChange.bind(this);
        this.handleBuyThis = this.handleBuyThis.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
        this.removeItemFromCart = this.removeItemFromCart.bind(this);
        
    }
    
    componentDidMount(){
        this.getKey();
    }
    
    selectCategory(filterList){
        this.setState({
            selectedFilters: filterList
        },()=>{
            this.LoadFilteredDesigns(0)
        });

    }
    handlePageChange(direction){
        let currentPage = this.getNewPageNumber(direction);
        
        let currentPageDesigns = this.getCurrentPageDesigns(currentPage,this.state.filteredDesignList);
        this.getDesignThumbs(currentPageDesigns).then((thumbList)=>{
            this.setState({
                currentPage:currentPage,
                designThumbs: thumbList,
                busy: false
            });
        });
    }
    getNewPageNumber(direction) {
        let currentPage = direction === 'next' ? this.state.currentPage + 1 : this.state.currentPage - 1;
        currentPage = currentPage < 0 ? 0 : currentPage > this.state.totalPages ? this.state.totalPages : currentPage;
        return currentPage;
    }

    handlePopUpClose(){
        this.setState({
            selectedDesign:''
        });
    }
    handleBusySignal= (busyStateBool)=>{
        this.setState({
            busy: busyStateBool
        })
    }
    handleFullDesignLoading= (busyStateBool)=>{
        this.setState({
            fullDesignLoading:busyStateBool
        })
    }
    handleDesignChange= (direction)=>{
        //this.handleFullDesignLoading(true);
        const currentDesign = this.state.selectedDesign;
        var designthumbArray = [...this.state.designThumbs];
        var index
        var obj = designthumbArray.find(function(item, i){
            if(item.Name === currentDesign){
                index=i;
                return item;
            }
        });
        var totalPages = this.state.totalPages;
        if(direction === 'next'){
            if(index === designthumbArray.length-1)
            {
                index=0;
                let currentPage = this.state.currentPage ===  totalPages ? 0: this.state.currentPage + 1;
                let currentPageDesigns = this.getCurrentPageDesigns(currentPage,this.state.filteredDesignList);
                this.getDesignThumbs(currentPageDesigns).then((thumbList)=>{
                    this.setState({
                        currentPage:currentPage,
                        designThumbs: thumbList
                    });
                    let selectedDesign = thumbList[0].Name;
                    let selectedThumb = "https://explorug.com/v2/" + thumbList[0].Value;
                    this.selectDesign(selectedDesign, selectedThumb);
                    //this.getDesignDetails(selectedDesign);
                });
            }
            else{
                index++;
                let selectedDesign = designthumbArray[index].Name;
                let selectedThumb = "https://explorug.com/v2/" + designthumbArray[index].Value;
                this.selectDesign(selectedDesign, selectedThumb);
                    
                //this.getDesignDetails(selectedDesign);
            }   
        }
        else{
            if(index === 0)
            {
                let currentPage = this.state.currentPage === 0 ? totalPages: this.state.currentPage - 1;
                let currentPageDesigns = this.getCurrentPageDesigns(currentPage,this.state.filteredDesignList);
                this.getDesignThumbs(currentPageDesigns).then((thumbList)=>{
                    this.setState({
                        currentPage:currentPage,
                        designThumbs: thumbList
                    });
                    let selectedDesign = thumbList[thumbList.length-1].Name;
                    let selectedThumb = "https://explorug.com/v2/" + thumbList[thumbList.length-1].Value;
                    this.selectDesign(selectedDesign, selectedThumb);
                    
                    //this.getDesignDetails(selectedDesign);
                });
            }
            else{
                index--;
                let selectedDesign = designthumbArray[index].Name;
                let selectedThumb = "https://explorug.com/v2/" + designthumbArray[index].Value;
                this.selectDesign(selectedDesign, selectedThumb);
                    
                //this.getDesignDetails(selectedDesign);
            }
        }
    }
    handleAddToCart(imgSrc, selectedDesign){
        if(!this.alreadyInCart(selectedDesign))
            this.addDesignToCart(imgSrc, selectedDesign).then(()=>{
                console.log('to buy design now')
            });
        
    
    }
    
    handleBuyThis(imgSrc, selectedDesign){
        let fulldesignSrc =imgSrc;
        if(!this.alreadyInCart(selectedDesign))
            this.addDesignToCart(fulldesignSrc, selectedDesign).then(()=>{
                console.log('to buy design now')
            });
        //BUY design
        this.setState({
            checkout: true //checkout
        })

    }
    alreadyInCart(selectedDesign){
        let currentDesign = selectedDesign;
        let designCart = [...this.state.cart];
        let design1 = designCart.filter((design)=>{
            return design.design === currentDesign
        });
        if(design1.length>0) return true;
        else return false;
    }
    addDesignToCart(fulldesignSrc, selectedDesign){
        return new Promise((resolve, reject) => {
            let designToAdd = selectedDesign;
            let designCart = [...this.state.cart];
            let selectedThumb =  this.state.selectedThumb;
    
            designCart.push({design:designToAdd, thumb: selectedThumb, fullDesign: fulldesignSrc});
    
            this.setState({
                InCart: true,
                cart: designCart
            }, ()=>{
                resolve();
            })
            console.log(designCart)
        });

    }
    removeItemFromCart(index){
        let designcart = [...this.state.cart];
        designcart.splice(index, 1);
        console.log(designcart)
        this.setState({
            cart: designcart
        })
    }
    getKey(){
        this.callCount++;
        let data = new FormData();
        data.append("action", "login");
        data.append("username","o1dd");
        data.append("password","oodd");
        axios.post(this.domain + '/appprovider.aspx', data)
        .then(response =>{
            if(response.data===''&& this.callCount<2){
                setTimeout(() => {
                    this.getKey();
                }, 3000); 
            }
            else if(response.data!==''){
                this.getDesignList(response.data);
            }
        })
        .catch(error=>{
            console.log(error);
        })
    }
    getDesignList(key){
        let data = new FormData();
        data.append("action", "designlist");
        data.append("key",key);
        axios.post(this.domain+ "/appprovider.aspx", data)
             .then(response=>{
                 let data = response.data;
                 let designList = data.filter(function(item) {
                    return item.Type === 'file'
                  });
                  for (var i = 0; i < designList.length; i++) {
                    designList[i].Extensions = designList[i].FullPath.substr(designList[i].FullPath.lastIndexOf('.') + 1, designList[i].FullPath.length);
                    designList[i].Path = designList[i].FullPath.split('/').slice(0, -1).join('/');
                    designList[i].OrigIndex = i;
                  }
                  let folderList = data.filter(function(item, index) {
                    return item.Type === 'folder' && data.indexOf(item) === index && item.Name!=="Designs"
                  });
                  
                 this.setState({
                    key:key,
                    designCategories:folderList,
                    designList:designList
                }, () => {
                    let currentPage = 0;
                    this.LoadFilteredDesigns(currentPage);
                });
            });
    }
    LoadFilteredDesigns(currentPage) {
        let filteredList = this.filterDesignList();
        let currentPageDesigns = this.getCurrentPageDesigns(currentPage, filteredList);
        let totalPages = Math.floor(filteredList.length/this.designsPerPage);
        this.getDesignThumbs(currentPageDesigns).then((thumbList) => {
            this.setState({
                currentPage: currentPage,
                designThumbs: thumbList,
                filteredDesignList: filteredList,
                totalPages: totalPages
            });
        });
    }

    filterDesignList(){
        let designList = [...this.state.designList];
        let filters = this.state.selectedFilters;
        let filteredList = filters.length ? []: designList;
        if(filters.length>0){
            filters.map(filter=>{
                designList.map(design=>{
                    if(design.Path === filter)
                    filteredList.push(design);
                })
            });
        }
        filteredList =  this.shuffle(filteredList);
        return filteredList;
        
    }
    shuffle(array) {
        array.sort(() => Math.random() - 0.5);
        return array;
    }
    
    getCurrentPageDesigns(currentPage, designArray){
        let designsFullPathlist =[];
        if(designArray ===undefined ) console.log('designArray is blank');
        if(designArray.length>0){
            designsFullPathlist = this.getFullPathList(designArray.slice(currentPage*this.designsPerPage,(currentPage+1)*this.designsPerPage));
        }
        return designsFullPathlist;
    }
   
    getFullPathList = function (flatDesignList) {
        var designList = [];
        for (var i = 0; i < flatDesignList.length; i++) {
            designList[i] = flatDesignList[i].FullPath; 
        }
        return designList;
    }
    
    selectDesign=(selectedDesign, selectedThumb)=>{
        this.handleFullDesignLoading(true);
        this.setState({
            selectedThumb: selectedThumb
            
        });
        this.getDesignDetails(selectedDesign);
    }
    getDesignDetails = (selectedDesign)=>{
        let data =  new FormData();
        data.append('action', "designdetails");
        data.append('key', this.state.key);
        data.append('file', selectedDesign);
        data.append('backcolor', "#ffffff");

        axios.post("https://explorug.com/v2/appprovider.aspx", data)
        .then(response=>{
            let designdetails = response.data;
            //console.log(designdetails)
            let inCart = this.alreadyInCart(selectedDesign) ? true: false;
        
            this.setState({
                selectedDesign:selectedDesign,
                designDetails: designdetails,
                InCart: inCart
            });
          
        });
    }
    getDesignThumbs(designsFullPathlist) {
        console.log(designsFullPathlist);
        return new Promise((resolve, reject) => {
            let data = new FormData();
            data.append("action", "designthumbs");
            data.append("key",this.state.key);
            data.append("files", JSON.stringify(designsFullPathlist));
            data.append("backcolor", "#ffffff");
            axios.post(this.domain+ "/appprovider.aspx", data)
            .then(response=>{
                let thumbList = response.data;
                resolve(thumbList);
            })
            .catch(error => { // your error handling goes here}
                reject(error)
            });
        });
        
    }
//page=designs,faq,checkout
    render() {
        window.state= this.state;
        return (
            <div>
               
                {!this.state.checkout ?
                <Container style={{marginTop: '40px'}}>
                    <Row>
                        <Col xs={8}> 
                            <DesignsFilter 
                                filters={this.state.selectedFilters}
                            />
                        </Col>
                        <Col> 
                            <DesignCategory 
                                filters={this.state.designCategories}
                                handleClick={this.selectCategory}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <DesignsList 
                                designList ={this.state.designList}
                                keyValue={this.state.key}
                                selectedFilters= {this.state.selectedFilters}
                                designThumbs={this.state.designThumbs}
                                currentPage ={this.state.currentPage}
                                pageChange={this.handlePageChange}
                                busy={this.state.busy}
                                selectDesign= {this.selectDesign}
                                handleBusySignal= {this.handleBusySignal}
                            />
                            
                        {
                            this.state.selectedDesign!==''? 
                            <FullDesign 
                                busy = {this.state.fullDesignLoading}
                                InCart= {this.state.InCart}
                                selectedDesign = {this.state.selectedDesign} 
                                designDetails= {this.state.designDetails} 
                                handleClose= {this.handlePopUpClose}
                                handleDesignChange = {this.handleDesignChange}
                                handleFullDesignLoading = {this.handleFullDesignLoading}
                                handleBuyThis = {this.handleBuyThis}
                                handleAddToCart = {this.handleAddToCart}
                            ></FullDesign>
                            :null
                        }
                        
                    </Row>        
                </Container>
                :
                <Checkout
                    cart = {this.state.cart}
                    removeItemFromCart = {this.removeItemFromCart}
                >
                </Checkout>
                }
                <SocialMediaShare/>
                <div id="copyright" className="text-center">
                    © Alternative Technology 2019 - All rights reserved
                    <div>       
                        <span className="footerLinks">Terms of Use</span>
                    </div>
                </div>
                <FooterBar/>
            </div>
        );
    }
}

export default HomePage;