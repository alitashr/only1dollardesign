import React, { Component } from 'react';
import {Dropdown} from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/DropdownItem';

class DesignCategory extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            filters :this.props.filters,
            selectedFilters:[],
            selectAll:true
        }
    }
    
    handleClick(e){
        e.preventDefault();
        var selectAll = true;
        const categorySelected = e.target.getAttribute('value');
        var filterList = this.state.selectedFilters;
        
        if(categorySelected.toLowerCase() === "all"){
            if(filterList.length)
                filterList =[];
            else
                return;
        }
        else if(filterList.indexOf(categorySelected)>=0 )
        {
            e.target.classList.toggle('filteroptionsactive');
            filterList = filterList.filter(function(item) {
                return item.toLowerCase() !== categorySelected.toLowerCase()
              });
            selectAll = filterList.length ? false: true;
        }
        else{
            filterList.push(categorySelected);
            selectAll = false;
        }
        this.setState({
            selectedFilters:filterList,
            selectAll: selectAll
        });
        this.props.handleClick(filterList);
    }
    render() {
        const filters = this.props.filters;
        return (
            <div id="filterarea">
            <Dropdown>
                <Dropdown.Toggle  id="dropdown-basic" className="filteroptions">
                    Category
                </Dropdown.Toggle>
                <Dropdown.Menu>
                {
                    filters.length>0 ? 
                        filters.map((filter, index)=> 
                            <DropdownItem 
                                key={index}
                                value={filter.FullPath} 
                                onClick={this.handleClick} 
                                className={this.state.selectedFilters.indexOf(filter.FullPath)>=0 ? "filteroptionsactive":null}
                                >
                                {filter.Name}
                            </DropdownItem>
                        )
                        : null
                }
                <DropdownItem 
                    key="All"
                    value="All" 
                    onClick={this.handleClick} 
                    className= {this.state.selectAll? "filteroptionsactive":null}
                    >
                    All
                </DropdownItem>   
                </Dropdown.Menu>
            </Dropdown>
            
            </div>
        );
    }
}

export default DesignCategory;