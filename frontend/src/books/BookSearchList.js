import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BookClubApi from "../api";
import Loading from "../utilities/Loading";
import BookSearchForm from "./BookSearchForm";
import BookCard from "./BookCard";
import Alert from "../utilities/Alert"
import InfiniteScroll from "react-infinite-scroll-component";
import "./BookList.css"

/**
 * Displays a list of search result books and search box.
 * The `BookSearchList` component displays of a list of searched books fetched from the Google Books API,
 * along with database reviews and likes. It supports both infinite scrolling for loading
 * more books and a search feature to filter books based on user input.
 * 
 * - API call loads books data when the component mounts with getBookList and when the search box is submitted with getSearchedBookResult.
 * - This component is designed for the "/books/search" route.
 * - Utilizes BookCard and BookSearchForm components and called by Routes
 * 
 * - Routes ==> BookCard, BookSearchForm
 */
const BookSearchList = () => {
    console.debug("BookSearchList");

    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true)
    const [books, setBooks] = useState([]);
    const [searchData, setSearchData] = useState(null)
    const [indexSearch, setIndexSearch] = useState(20)
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    
    // Parse search data from URL parameters
    const urlSearchParams = new URLSearchParams(location.search);
    const search = urlSearchParams.get("search");
    const title = urlSearchParams.get("title");
    const author = urlSearchParams.get("author");
    const publisher = urlSearchParams.get("publisher");
    const subject = urlSearchParams.get("subject");

    // Utility function to convert "undefined" strings to undefined
    const convertUndefined = value => (value === "undefined" ? undefined : value);

    // Create the searchData object with converted values
    const searchDataFromUrl = {
        search: convertUndefined(search),
        terms: {
            title: convertUndefined(title),
            author: convertUndefined(author),
            publisher: convertUndefined(publisher),
            category: convertUndefined(subject),
        },
    };

    /**
     * Fetches the initial batch of books from the Google Books API and sets the state.
     */  
    useEffect(function getBooksOnMount() {
        console.debug("BookSearchList useEffect getBooksOnMount");


        setSearchData(searchDataFromUrl);

        // Makes the initial API call based on the provided search data
        const getFirstSearch =  async () => {
            setError(null);
            if (!searchDataFromUrl.search) {
                navigate('/books');
            }
            
            try {
                const searchBook = await BookClubApi.getSearchedBookResult(0, searchDataFromUrl);
                setBooks(searchBook);
            } catch (e) {
                console.error("BookSearchList useEffect API call data loading error:", e)
                setError("An error occurred while fetching search results.");
            }
            
            setLoading(false)
        }
        
        // set loading to true while async getCurrentUser runs; once the
        // data is fetched (or even if an error happens!), this will be set back
        // to true to control the spinner.
        setLoading(true)
        getFirstSearch()
    }, [search]);


    // Gets more searched books data as user infinite scrolls
    const searchBookList = async () => {
        setError(null);
        if (!searchData.search) {
        setError("Search data is required.");
        return;
        }

        try {
            const searchBook = await BookClubApi.getSearchedBookResult(indexSearch, searchData);
            searchBook.length > 0 ? setHasMore(true) : setHasMore(false);
            setBooks(b => [...b, ...searchBook]);
        } catch (e) {
            console.error("BookSearch API call data loading error:", e);
            setError("An error occurred while fetching search books.");
        }

        setLoading(false)
        setIndexSearch(index => index + 20)
    }

    const searchBookData = (searchData) => {
        if (!searchData) {
            navigate('/books');
        }
        
        let queryTerms = ""
        queryTerms = searchData.terms.title ? `&title=${searchData.terms.title}` : ""
        queryTerms += searchData.terms.author ? `&author=${searchData.terms.author}` : ""
        queryTerms += searchData.terms.publisher ? `&publisher=${searchData.terms.publisher}` : ""
        queryTerms += searchData.terms.subject ? `&title=${searchData.terms.subject}` : ""
    
        navigate(`/books/search?search=${searchData.search}${queryTerms}`);  
    }

    if (loading || !searchData) return <Loading />;

    return (
        <>
        {books.length
            ? (
            <InfiniteScroll
                dataLength={books.length}
                next={searchBookList}
                hasMore={hasMore}
                loader={<Loading />}
            >
                <div className="BookList col-md-8 offset-md-2">
                    <BookSearchForm searchFor={searchBookData} />
                    <h3>Results for {search}</h3>
                    {books.length
                        ? (
                            <div className="BookList-list">
                            {books.map(({ id, title, author, description, publisher, category, cover, bookLikeCount, reviews }) => (
                                <BookCard 
                                    key={id}
                                    id={id}
                                    title={title}
                                    author={author}
                                    description={description}
                                    publisher={publisher}
                                    category={category}
                                    cover={cover}
                                    bookLikeCount={+bookLikeCount}
                                    reviews={reviews}
                                />
                            ))}
                            </div>
                        ) : (
                            <>
                            <p className="lead">Sorry, no results were found!</p>
                            {error ? <Alert type="danger" messages={[error]} />: null}
                            </>
                        )}
                </div>
                </InfiniteScroll>
            ) : (
                <>
                <p className="lead">Sorry, no results were found!</p>
                {error ? <Alert type="danger" messages={[error]} />: null}
                </>
            )
        }
        </>
   
    );
}

export default BookSearchList;