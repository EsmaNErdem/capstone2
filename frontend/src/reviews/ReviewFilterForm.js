import React, { useState, useEffect, useRef } from "react";
import Prompt from "../utilities/Prompt";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import "./ReviewFilterForm.css"

/**
 *  Displays reusable search review filter component for filtering reviews
 * 
 * - title, author, category, username values filter through review table
 * - detail search with terms: { title, author, category, username } 
 * - handleSubmit triggers API call in related extension
 * 
 * - BookCard ==> BookSearchForm
 */
const ReviewFilterForm = ({applyFilters, prompts}) => {
    console.debug("ReviewFilterForm");

    const [filterData, setFilterData] = useState({ sortBy: "date" });  
    const timerId = useRef();
  
    const handleChange = (prompt, value) => {
      setFilterData((prevData) => ({ ...prevData, [prompt]: value.trim() }));        
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      applyFilters(filterData);
    };
    
    // Clear the timeout when the component unmounts or when input changes
    useEffect(() => {
      if (timerId.current) {
        clearTimeout(timerId);
      }
  
      timerId.current = setTimeout(() => {
        applyFilters(filterData);
      }, 750);
  
      return () => {
        if (timerId.current) {
          clearTimeout(timerId.current);
          timerId.current = null
        }
      };
    }, [filterData]);
  
    return (
      <div className="FilterBox">
        <form className="FilterForm" onSubmit={handleSubmit}> 
            <>
              {prompts.map((prompt, i) => (
                <Prompt key={i}
                    prompt={prompt}
                    value={filterData[prompt]}
                    handleChange={handleChange}
                />
              ))}
            </>            
            <select
              name="sortBy"
              value={filterData.sortBy}
              onChange={(e)=>handleChange("sortBy", e.target.value )}
              >
              <option value="date">Sort by Date</option>
              <option value="user">Sort by User</option>
              <option value="popular">Sort by Popularity</option>
            </select>
          <button type="submit" className={prompts.length > 1 ? "SubmitButton-large" : "SubmitButton"} title="Apply Filters">
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </form>
      </div>
    );
}

export default ReviewFilterForm;