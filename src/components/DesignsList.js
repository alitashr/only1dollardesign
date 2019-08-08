import React, {useContext} from 'react';
import {DesignsArea, DesignThumb} from './StyledComponents';
import BusySignal from './BusySignal';

import {DesignContext} from '../App';
import {WholeContext} from '../App';

const DesignsList = () => {
    
    const designContext = useContext(DesignContext);
    let selectDesign = designContext.selectDesign;
   
    const wholeContext = useContext(WholeContext);   
    let thumbs = wholeContext.state.designThumbs;
    let showContentLoadingSignal = wholeContext.state.showContentLoadingSignal;

    const handleClick =e =>{
        let selectedDesign = e.target.getAttribute('data-name');
        let selectedThumb = e.target.getAttribute('src');
        console.log(selectedDesign, selectedThumb);
        
        selectDesign(selectedDesign, selectedThumb);
        
    }
    console.log(showContentLoadingSignal)
    return (
        <DesignsArea>
            {showContentLoadingSignal? <BusySignal show={true}></BusySignal>: null}
            {
                    thumbs.length>0 ? 
                    thumbs.map((thumb, index)=>
                    <DesignThumb  key={index} lg = {4} md = {4} sm = {4} xs = {10} className = "thumbs">
                    <div>
                        <img data-name={thumb.Name} 
                            onClick={handleClick}
                            src={"https://explorug.com/v2/"+thumb.Value}/></div>
                    </DesignThumb>)
                    :null
                }
        </DesignsArea>
    );
};

export default DesignsList;