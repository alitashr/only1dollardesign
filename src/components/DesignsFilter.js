import React, { Component } from 'react';
import {Badge} from 'react-bootstrap';

class DesignsFilter extends Component {
    render() {
        const filters = this.props.filters;
        return (
            <div>
                {
                    filters.length ?
                        filters.map((filter)=>
                            <Badge variant="secondary" 
                                key={filter}
                                className="selectedFilter"
                            >
                                {filter.replace('Designs/','')}
                            </Badge>
                        ):null
                }
            </div>
        );
    }
}

export default DesignsFilter;