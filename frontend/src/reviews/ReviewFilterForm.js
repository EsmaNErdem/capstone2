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
const ReviewFilterForm = ({applyFilters, prompts, initialValue={}}) => {
    console.debug("ReviewFilterForm");

    const [filterData, setFilterData] = useState(initialValue);  
    const timerId = useRef();

    const sendFilterData = () => {
      applyFilters(filterData);
    }
    
    const handleSubmit = (e) => {
      e.preventDefault();
      sendFilterData()
    };

    const handleChange = async (prompt, value, e) => {  
      setFilterData((prevData) => ({ ...prevData, [prompt]: value || undefined})); 
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
    
    // Clear the timeout when the component unmounts or when input changes
    useEffect(() => {
      if (timerId.current) {
        clearTimeout(timerId.current);
        timerId.current = null
      }
      
      timerId.current = setTimeout(() => {
        sendFilterData()
      }, 1500);

      return () => {
        if (timerId.current) {
          clearTimeout(timerId.current);
          timerId.current = null
        }
      };
    }, [filterData]);
    
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
              value={filterData.sortBy || ""}
              onChange={(e)=>handleChange("sortBy", e.target.value, e)}
              >
              <option value="">
                Sort by
              </option>
              <option value="date">
                Sort by Date &#x2191;
              </option>
              <option value="user">
                User by Alphabet &#x2193;
              </option>
              <option value="popular">
                Sort by Popularity &#x2191;
              </option>
            </select>
          <button type="submit" className={prompts.length > 1 ? "SubmitButton-large" : "SubmitButton"} title="Apply Filters">
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </form>
      </div>
    );
}

export default ReviewFilterForm;