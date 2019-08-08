import React, {useContext} from 'react';

import {WholeContext} from '../App';

import DesignsPage from './DesignsPage';
const Homepage = () => {
    const context = useContext(WholeContext);
    let designThumbs = context.state.designThumbs;
    console.log('designThumbs length '+ designThumbs.length);

    return (
        <div>
            {
                designThumbs.length?
                <DesignsPage/>
                :null
            }
        </div>             
    );
};

export default Homepage;