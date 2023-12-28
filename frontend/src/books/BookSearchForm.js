import React, { useState, useEffect, useRef } from "react";
import Prompt from "../utilities/Prompt";
import "./BookSearchForm.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';

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
 * 
 * - BookCard ==> BookSearchForm
 */
const BookSearchForm = ({searchFor}) => {
    console.debug("BookSearchForm", "searchFor=", typeof searchFor);

    const [formData, setFormData] = useState({})
    const [advancedSearch, setAdvancedSearch] = useState(false)
    const timeoutId = useRef();

    const sendSearchData = () => {
        let title
        let author
        let publisher
        let subject 

        if (formData.title) title = formData.title.trim()
        if (formData.author) author = formData.author.trim()
        if (formData.publisher) publisher = formData.publisher.trim()
        if (formData.subject) subject = formData.subject.trim()

        const searchData = {
            search:
                formData.search ||
                title ||
                author ||
                publisher ||
                subject,
            terms: {
                title,
                author,
                publisher,
                subject
            },
        };

        if(searchData.search) searchFor(searchData || undefined)
      }

    //  Handles form submission and sends searchData 
    const handleSubmit = e => {
        e.preventDefault();
        sendSearchData();
    }
    
    // Handles changes in form inputs and updates the component's state accordingly.
    // if it is checkbox input, it becomes "true" string for query parameter in API call
    // for other inputs, turn empty string into undefined 
    const handleChange = (prompt, value, e) => {
        setFormData(data => ({
            ...data,
            [prompt] : value || undefined
        }))

        if (!advancedSearch) { 
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        }  
    }

    // Clear the timeout when the component unmounts or when input changes
    useEffect(() => {
        if (!advancedSearch) {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            
            timeoutId.current = setTimeout(() => {
                sendSearchData();
            }, 1200);

            return () => {
                if (timeoutId.current) {
                clearTimeout(timeoutId.current);
                timeoutId.current = null
                }
            };
        }    
    }, [formData]);

    // Toggle advancedSearch state
    const toggleAdvancedSearch = () => {
        setAdvancedSearch((prev) => !prev);
    };

    return (
        <div className={`SearchBox ${advancedSearch ? "AdvancedSearch" : ""}`}>
            <form className="SearchForm" onSubmit={handleSubmit}>
                <div className="SearchInputContainer">
                    <Prompt 
                        prompt={"search"} 
                        value={formData["search"]} 
                        handleChange={handleChange}
                    />
                    {!advancedSearch && (
                        <FontAwesomeIcon icon={faSearch} className="SubmitButton-inside" />
                    )}
                </div>
                {advancedSearch ? (
                    <>
                        {["title", "author", "publisher", "subject"].map(prompt => (
                            <Prompt key={prompt}
                                prompt={prompt}
                                value={formData[prompt]}
                                handleChange={handleChange}
                            />
                        ))}
                        <button
                            type="button"
                            className="ToggleButton"
                            onClick={toggleAdvancedSearch}
                            title="Toggle Advanced Search"
                            >
                            <FontAwesomeIcon icon={faFilter} />
                        </button>
                        <button 
                            data-testid="submit"
                            type="submit" 
                            className="SubmitButton" 
                            title="Submit Search"
                            >
                            <FontAwesomeIcon icon={faSearch} /> 
                        </button>
                    </>
                    ) : (
                    <>
                        <button
                            data-testid="filter-toggle"
                            type="button"
                            className="ToggleButton-large"
                            onClick={toggleAdvancedSearch}
                            title="Toggle Advanced Search"
                            >
                            <FontAwesomeIcon icon={faFilter} />
                        </button>
                    </>
                )}
            </form>
        </div>
    )
}

export default BookSearchForm; 