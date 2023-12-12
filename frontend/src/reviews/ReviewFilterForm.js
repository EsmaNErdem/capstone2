import React, { useState } from "react";
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
const ReviewFilterForm = ({applyFilters, fullFilter=false}) => {
    const [filterData, setFilterData] = useState({
        title: "",
        author: "",
        category: "",
        username: "",
        sortBy: "date",
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFilterData((prevData) => ({ ...prevData, [name]: value }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        applyFilters(filterData);
      };
    
      return (
        <div className="FilterBox">
          <form className="FilterForm" onSubmit={handleSubmit}>
            { fullFilter && 
            <>
                <input
                name="title"
                type="text"
                placeholder="Book Title"
                value={filterData.title}
                onChange={handleChange}
                />
                <input
                name="author"
                type="text"
                placeholder="Book Author"
                value={filterData.author}
                onChange={handleChange}
                />
                <input
                name="category"
                type="text"
                placeholder="Book Category"
                value={filterData.category}
                onChange={handleChange}
                />
            </>
            }
              <input
                name="username"
                type="text"
                placeholder="Review Owner"
                value={filterData.username}
                onChange={handleChange}
              />
              <select
                name="sortBy"
                value={filterData.sortBy}
                onChange={handleChange}
                >
                <option value="date">Sort by Date</option>
                <option value="user">Sort by User</option>
                <option value="popular">Sort by Popularity</option>
              </select>
            <button type="submit" className={fullFilter ? "SubmitButton-large" : "SubmitButton"} title="Apply Filters">
              <FontAwesomeIcon icon={faFilter} />
            </button>
          </form>
        </div>
      );
}

export default ReviewFilterForm;