import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

    const navigate = useNavigate();
    const [formData, setFormData] = useState({})
    const [advancedSearch, setAdvancedSearch] = useState(false)
    const timeoutId = useRef();

    //  Handles form submission and triggers the search function which API calls for data.
    const handleSubmit = e => {
        e.preventDefault();
        if (formData.title) formData.title = formData.title.trim()
        if (formData.author) formData.author = formData.author.trim()
        if (formData.publisher) formData.publisher = formData.publisher.trim()
        if (formData.subject) formData.subject = formData.subject.trim()

        const searchData = {
            search:
                formData.search ||
                formData.title ||
                formData.author ||
                formData.publisher ||
                formData.subject,
            terms: {
                title: formData.title,
                author: formData.author,
                publisher: formData.publisher,
                subject: formData.subject,
            },
        };

        searchFor(searchData || undefined)
         // Pass search data as URL parameters
        let queryTerms = ""
        queryTerms = searchData.terms.title ? `&title=${searchData.terms.title}` : ""
        queryTerms += searchData.terms.author ? `&author=${searchData.terms.author}` : ""
        queryTerms += searchData.terms.publisher ? `&publisher=${searchData.terms.publisher}` : ""
        queryTerms += searchData.terms.subject ? `&title=${searchData.terms.subject}` : ""

        navigate(`/books/search?search=${searchData.search}${queryTerms}`);

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
            
            timeoutId.current = setTimeout(() => {
                handleSubmit(e)
            }, 1200);
        }  

    }

    // Clear the timeout when the component unmounts or when input changes
    useEffect(() => {
        if (!advancedSearch) {
            return () => {
                if (timeoutId.current) {
                clearTimeout(timeoutId.current);
                timeoutId.current = null
                }
            };
        }    
    }, []);

    // Toggle advancedSearch state
    const toggleAdvancedSearch = () => {
        setAdvancedSearch((prev) => !prev);
    };
    console.log()

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