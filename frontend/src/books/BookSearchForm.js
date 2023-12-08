import React, { useState } from "react";
/**
 *  Displays reusable search box component for filtering job or company listings.
 * 
 * - when used for job filter, display title, additoinally min salary and has equity inputs
 * - When used for company filter, displays name, additoinally min employees and max employees
 * - handleSubmit triggers API call in related extension
 * 
 * * // Example usage for searching job listings
 * <SearchBox job search={handleJobSearch} />
 * 
 * // Example usage for searching company listings
 * <SearchBox company search={handleCompanySearch} />
 *  
 */
const BookSearchForm = ({job=null, company=null, search}) => {
    const [formData, setFormData] = useState({})
    
    //  Handles form submission and triggers the search function which API calls for data.
    const handleSubmit = e => {
        e.preventDefault();
        if (formData.name) formData.name = formData.name.trim()
        if (formData.title) formData.title = formData.title.trim()
        search(formData || undefined)
    }
    
    // Handles changes in form inputs and updates the component's state accordingly.
    // if it is checkbox input, it becomes "true" string for query parameter in API call
    // for other inputs, turn empty string into undefined or setFormDate with given value
    const handleChange = e => {
        const { name, value, type, checked } = e.target
        setFormData(data => ({
            ...data,
            [name] : type === 'checkbox' ? `${checked}` : value || undefined
        }))
    }

    return (
        <div className="SearchBox">
            <form onSubmit={handleSubmit}>
                <label htmlFor="search">{company ? "Name" : "Title"}</label>
                <input 
                    id="search"
                    name={company ? "name" : "title"}
                    type="search"
                    value={company ? (formData.name || "") : (formData.title || "")}
                    onChange={handleChange}
                    placeholder={company ? "name" : "title"}
                />
                {company && 
                    <>
                        <label htmlFor="minEmployees">Min Employees</label>
                        <input
                            id="minEmployees"
                            name="minEmployees"
                            type="number"
                            min="0"
                            value={formData.minEmployees || ""}
                            onChange={handleChange}
                        />
                        <label htmlFor="maxEmployees">Max Employees</label>
                        <input
                            id="maxEmployees"
                            name="maxEmployees"
                            type="number"
                            value={formData.maxEmployees || ""}
                            onChange={handleChange}
                        />
                    </>
                }

                {job && 
                    <>
                        <label htmlFor="minSalary">Min Salary</label>
                        <input
                            id="minSalary"
                            name="minSalary"
                            type="number"
                            min="0"
                            value={formData.minSalary || ""}
                            onChange={handleChange}

                        />
                        <label htmlFor="hasEquity">Has Equity</label>
                        <input
                            id="hasEquity"
                            name="hasEquity"
                            type="checkbox"
                            value={formData.equity || false}
                            onChange={handleChange}
                        />
                    </>
                }
                <button>Search</button>
            </form>
        </div>
    )
}

export default BookSearchForm; 