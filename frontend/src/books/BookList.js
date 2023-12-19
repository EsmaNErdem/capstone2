import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookClubApi from "../api";
import Loading from "../utilities/Loading";
import BookSearchForm from "./BookSearchForm";
import BookCard from "./BookCard";
import Alert from "../utilities/Alert"
import InfiniteScroll from "react-infinite-scroll-component";
import "./BookList.css"

/**
 * Displays a list of books and search box.
 * The `BookList` component displays a list of books fetched from the Google Books API,
 * along with database reviews and likes. It supports both infinite scrolling for loading
 * more books and a search feature to filter books based on user input.
 * 
 * - API call loads books data when the component mounts with getBookList and when the search box is submitted redirects to /books/search.
 * - This component is designed for the "/books" route.
 * - Utilizes BookCard and BookSearchForm components and called by Routes
 * 
 * - Routes ==> BookCard, BookSearchForm
 */
const BookList = () => {
  console.debug("BookList");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [books, setBooks] = useState([]);
  const [indexList, setIndexList] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches the initial batch of books from the Google Books API and sets the state.
   */  
  useEffect(function getBooksOnMount() {
    console.debug("BookList useEffect getBooksOnMount");

    // Make an API call to get first batch of books data from backend when there is no searchDatan submitted
    const getFirstList =  async () => {
      setError(null);
      try {
        const booksApi = await BookClubApi.getBookList(0);
        setBooks(booksApi);
      } catch (e) {
        console.error("BookList useEffect API call data loading error:", e);
        setError("An error occurred while fetching books.");
      }
      
      setLoading(false)
    }

    // set loading to true while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to true to control the spinner.
    setLoading(true)
    getFirstList();
  }, []);


  // Gets more books list data as user infinite scrolls
  const getBookList = async () => {
    setError(null);
    try {
        const booksApi = await BookClubApi.getBookList(indexList);
        booksApi.length > 0 ? setHasMore(true) : setHasMore(false);
        setBooks(b => [...b, ...booksApi]);
    } catch (e) {
        console.error("BookList API call data loading error:", e);
        setError("An error occurred while fetching books.");
    }

    setLoading(false)
    setIndexList(index => index + 20)
  }

  const searchBookData = (searchData) => {
    let queryTerms = ""
    queryTerms = searchData.terms.title ? `&title=${searchData.terms.title}` : ""
    queryTerms += searchData.terms.author ? `&author=${searchData.terms.author}` : ""
    queryTerms += searchData.terms.publisher ? `&publisher=${searchData.terms.publisher}` : ""
    queryTerms += searchData.terms.subject ? `&title=${searchData.terms.subject}` : ""

    navigate(`/books/search?search=${searchData.search}${queryTerms}`);
  }

  if (loading) return <Loading />;

  return (
  <InfiniteScroll
    dataLength={books.length}
    next={getBookList}
    hasMore={hasMore}
    loader={<Loading />}
  >
      <div className="BookList col-md-8 offset-md-2">
        <BookSearchForm searchFor={searchBookData} />
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
  );
}

export default BookList;