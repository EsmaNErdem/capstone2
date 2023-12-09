import React, { useState, useEffect } from "react";
import BookClubApi from "../api";
import Loading from "../utilities/Loading";
import BookSearchForm from "./BookSearchForm";
import BookCard from "./BookCard";
import Alert from "../utilities/Alert"
import InfiniteScroll from "react-infinite-scroll-component";

/**
 * Displays a list of books and search box.
 * The `BookList` component displays a list of books fetched from the Google Books API,
 * along with database reviews and likes. It supports both infinite scrolling for loading
 * more books and a search feature to filter books based on user input.
 * 
 * - API call loads books data when the component mounts wtih getBookList and when the search box is submitted with getSearchedBookResult.
 * - This component is designed for the "/books" route.
 * - Utilizes BookCard and BookSearchForm components and called by Routes
 * - Routes ==> BookCard, BookSearchForm
 */
const BookList = () => {
  console.debug("BookList");

  const [loading, setLoading] = useState(true)
  const [books, setBooks] = useState([]);
  const [indexList, setIndexList] = useState(10);
  const [searchData, setSearchData] = useState({})
  const [indexSearch, setIndexSearch] = useState(10)
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches the initial batch of books from the Google Books API and sets the state.
   */  
  useEffect(function getBooksOnMount() {
    console.debug("BookList useEffect getBooksOnMount");

    // Make an API call to get first batch of books data from backend when there is no searchDatan submitted
    const getFirstList =  async () => {
      try {
        const booksApi = await BookClubApi.getBookList(0);
        setBooks(booksApi);
      } catch (e) {
          console.error("BookList useEffect API call data loading error:", e)
      }
      
      setLoading(false)
    }

    // Makes the initial API call based on the provided search data
    const getFirstSearch =  async () => {
      
      if (!searchData.search) {
        getFirstList();
      }

      try {
        const searchBook = await BookClubApi.getSearchedBookResult(0, searchData);
        setBooks(searchBook);
      } catch (e) {
          console.error("Search BookList useEffect API call data loading error:", e)
          setLoading(false); 
      }
      
      setLoading(false)
    }
    
    // set loading to true while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to true to control the spinner.
    setLoading(true)
    searchData.search ? getFirstSearch() : getFirstList();
  }, [searchData]);


  // Gets more books list data as user infinite scrolls
  const getBookList = async () => {
    try {
        const booksApi = await BookClubApi.getBookList(indexList);
        booksApi.length > 0 ? setHasMore(true) : setHasMore(false);
        setBooks(b => [...b, ...booksApi]);
    } catch (e) {
        console.error("BookList API call data loading error:", e)
    }
    setLoading(false)
    setIndexList(index => index + 10)
  }

  // Gets more searched books data as user infinite scrolls
  const searchBookList = async () => {
    if (!searchData.search) {
      setError("Search data is required.");
    }

    try {
        const searchBook = await BookClubApi.getSearchedBookResult(indexSearch, searchData);
        searchBook.length > 0 ? setHasMore(true) : setHasMore(false);
        setBooks(b => [...b, ...searchBook]);
    } catch (e) {
        console.error("BookSearch API call data loading error:", e)
    }
    setLoading(false)
    setIndexSearch(index => index + 10)
  }


  const searchBookData = (data) => {
    setSearchData(data)
  }

  if (loading) return <Loading />;

  return (
  <InfiniteScroll
    dataLength={books.length}
    next={!searchData.search ? getBookList : searchBookList}
    hasMore={hasMore}
    loader={<Loading />}
  >
      <div className="BookList col-md-8 offset-md-2">
        <BookSearchForm searchFor={searchBookData} />
        {books.length
            ? (
                <div className="BookList-list">
                  {books.map((book, i) => (
                      <BookCard 
                        key = {i}
                        id = {book.id}
                        title = {book.title}
                        author = {book.author}
                        description = {book.description}
                        publisher = {book.publisher}
                        category = {book.category}
                        cover = {book.cover}
                        bookLikeCount = {book.bookLikeCount}
                        reviews = {book.reviews}
                      />
                  ))}
                </div>
            ) : (
                <>
                  <p className="lead">Sorry, no results were found!</p>
                  {error ? <Alert type="danger" messages={error} />: null}
                </>
            )}
      </div>
    </InfiniteScroll>
  );
}

export default BookList;