import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
const ReviewFilterForm = ({applyFilters, prompts, navigateForward=false}) => {
    console.debug("ReviewFilterForm");

    const navigate = useNavigate();
    const [filterData, setFilterData] = useState({ sortBy: "date" });  
    const timerId = useRef();
  
    const handleChange = (prompt, value, e) => {      
      setFilterData((prevData) => ({ ...prevData, [prompt]: value }));     
      
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null
      }
      
      timerId.current = setTimeout(() => {
        handleSubmit(e);
      }, 1250);  
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      applyFilters(filterData);
      if(navigateForward){
        // Pass search data as URL parameters
        let queryTerms = ""
        queryTerms = filterData.title ? `&title=${filterData.title}` : ""
        queryTerms += filterData.author ? `&author=${filterData.author}` : ""
        queryTerms += filterData.publisher ? `&publisher=${filterData.publisher}` : ""
        queryTerms += filterData.category ? `&category=${filterData.category}` : ""
        queryTerms += filterData.sortBy ? `&sort=${filterData.sortBy}` : ""
        queryTerms = queryTerms ? `?${queryTerms}` : ""
        
        navigate(`/reviews/filter${queryTerms}`)
      }
    };
    
    // Clear the timeout when the component unmounts or when input changes
    useEffect(() => {

      return () => {
        if (timerId.current) {
          clearTimeout(timerId.current);
          timerId.current = null
        }
      };
    }, []);
  
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