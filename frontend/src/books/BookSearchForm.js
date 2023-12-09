import React, { useState } from "react";
/**
 *  Displays reusable search box component for searching book
 * 
 * - search value searches for value matching book title, authors or publisher.
 * - detail search with terms: { title, author, publisher, subject } 
 * - handleSubmit triggers API call in related extension
 * 
 * This component doesn't *do* the searching, but it renders the search
 * form and calls the `searchFor` function prop that runs in a parent to do the
 * searching.
 * - BookCard ==> BookSearchForm
 */
const BookSearchForm = ({searchFor}) => {
    console.debug("BookSearchForm", "searchFor=", typeof searchFor);

    const [formData, setFormData] = useState({})
    const [advancedSearch, setAdvancedSearch] = useState(false)
    const [timeoutId, setTimeoutId] = useState(null);

    //  Handles form submission and triggers the search function which API calls for data.
    const handleSubmit = e => {
        e.preventDefault();
        if (formData.search) formData.search = formData.search.trim()
        if (formData.title) formData.title = formData.title.trim()
        if (formData.author) formData.author = formData.author.trim()
        if (formData.publisher) formData.publisher = formData.publisher.trim()
        if (formData.subject) formData.subject = formData.subject.trim()
        
        const searchData = {
            search: formData.search || formData.title || formData.author || formData.publisher || formData.subject,
            terms: {
                title: formData.title,
                author: formData.author,
                publisher: formData.publisher,
                subject: formData.subject,
            }
          }
          
        searchFor(searchData || undefined)
    }
    
    // Handles changes in form inputs and updates the component's state accordingly.
    // if it is checkbox input, it becomes "true" string for query parameter in API call
    // for other inputs, turn empty string into undefined or setFormDate with given value
    const handleChange = e => {
        const { name, value} = e.target
        setFormData(data => ({
            ...data,
            [name] : value || undefined
        }))

        if (!advancedSearch) { 
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        
            // Set a new timeout
            const newTimeoutId = setTimeout(() => {
                handleSubmit(e);
            }, 1200); 
            setTimeoutId(newTimeoutId);
        }
    }

    // Toggle advancedSearch state
    const toggleAdvancedSearch = () => {
        setAdvancedSearch((prev) => !prev);
    };


    return (
        <div className="SearchBox">
            <form onSubmit={handleSubmit}>
                <input 
                    name="search"
                    type="search"
                    placeholder="Search Books"
                    value={formData.search || ""}
                    onChange={handleChange}
                />
                {advancedSearch ? 
                    <>
                        <input
                            name="title"
                            type="text"
                            placeholder="Book Title (optional)"
                            value={formData.title || ""}
                            onChange={handleChange}
                        />
                        <input
                            name="author"
                            type="text"
                            placeholder="Book Author (optional)"
                            value={formData.author || ""}
                            onChange={handleChange}
                        />
                        <input
                            name="publisher"
                            type="text"
                            placeholder="Publisher (optional)"
                            value={formData.publisher || ""}
                            onChange={handleChange}
                        />
                        <input
                            name="subject"
                            type="text"
                            placeholder="Book Subject (optional)"
                            value={formData.subject || ""}
                            onChange={handleChange}
                        />
                        <button type="button" onClick={toggleAdvancedSearch}>
                            Toggle Advanced Search
                        </button>
                        <button type="submit" className="btn btn-lg btn-primary">
                            Submit
                        </button>
                    </> :
                    <button type="button" onClick={toggleAdvancedSearch}>
                        Toggle Advanced Search
                    </button>
                }
            </form>
        </div>
    )
}

export default BookSearchForm; 