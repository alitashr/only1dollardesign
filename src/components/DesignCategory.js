import React, { useContext } from "react";
import { DesignContext } from "../App";
import { WholeContext } from "../App";
import { Dropdown } from "react-bootstrap";
import { FilterToggle, FilterMenu, FilterItem } from "./StyledComponents";

const DesignCategory = () => {
  const filterContext = useContext(DesignContext);
  const selectCategory = filterContext.selectCategory;

  const wholeContext = useContext(WholeContext);
  const filters = wholeContext.state.designCategories;
  const selectedFilters = wholeContext.state.selectedFilters;
  const handleClick = (e) => {
    const categorySelected = e.target.getAttribute("value");
    let filterList = selectedFilters;
    if (categorySelected.toLowerCase() === "all") {
      filterList = [];
    } else if (e.target.classList.contains("filteroptionsactive")) {
      e.target.classList.toggle("filteroptionsactive");
      filterList = filterList.filter(function (item) {
        return item.toLowerCase() !== categorySelected.toLowerCase();
      });
    } else {
      filterList.push(categorySelected);
    }
    selectCategory(filterList);
  };
  return (
    <div>
      <Dropdown style={{ textAlign: "right" }}>
        <FilterToggle>Category</FilterToggle>
        <FilterMenu>
          {filters.length > 0
            ? filters.map((filter, index) => (
                <FilterItem
                  key={index}
                  value={filter.FullPath}
                  onClick={handleClick}
                  className={selectedFilters.indexOf(filter.FullPath) >= 0 ? "filteroptionsactive" : null}
                >
                  {filter.Name}
                </FilterItem>
              ))
            : null}
          <FilterItem
            key="All"
            value="All"
            onClick={handleClick}
            className={selectedFilters.length ? null : "filteroptionsactive"}
          >
            All
          </FilterItem>
        </FilterMenu>
      </Dropdown>
    </div>
  );
};

export default DesignCategory;
