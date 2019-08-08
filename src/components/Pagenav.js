import React, {useContext} from 'react';
import {Pager} from './StyledComponents';

import {CurrentPageContext} from '../App';
import {WholeContext} from '../App';

const Pagenav = (props) => {
    
    const currentPageContext = useContext(CurrentPageContext);
    const handlePageChange = currentPageContext.handlePageChange;
    
    const wholeContext = useContext(WholeContext);
    let currentPage = wholeContext.state.currentPage;
    let disPatch = wholeContext.dispatch;

    const handleClick = (direction)=>{
        disPatch({type: 'set_BusySignal', payload: true})
        handlePageChange(direction);
    }
    return (
        <Pager>
                <div className={currentPage>0 ? null:"disabled"}>
                    <span onClick={()=>handleClick('prev')}>‹</span>
                </div>
                <div>
                    <span onClick={()=>handleClick('next')}>›</span>
                </div>
        </Pager>            
    );
};

export default Pagenav;