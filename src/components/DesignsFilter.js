import React, {useContext} from 'react';
import {FilterBadge} from './StyledComponents';
import {WholeContext} from '../App';

function DesignsFilter(){
    const filterContext = useContext(WholeContext);
    let filters = filterContext.state.selectedFilters;

    return (
         <div>
                {
                    filters.length ?
                        filters.map((filter)=>
                            <FilterBadge key={filter}>
                            {filter.replace('Designs/','')}
                            </FilterBadge>
                        ):null
                }
            </div>
    )
}
export default DesignsFilter;