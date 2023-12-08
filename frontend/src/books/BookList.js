import React, { useState, useEffect } from "react";
import BookClubApi from "../api";
import Loading from "../utilities/Loading";
import BookSearchForm from "./BookSearchForm";
import BookCard from "./BookCard";

/**
 * Displays a list of books and search box.
 * On mount, loads book from Gooogle Books API with database reviews and likes.
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
  const [indexList, setIndexList] = useState(0)
  const [indexSearch, setIndexSearch] = useState(0)

  //Loads books data on page load and as user scroll on infinite scroll
  useEffect(function getBooksOnMount() {
    console.debug("BookList useEffect getBooksOnMount");
    // set loading to true while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to true to control the spinner.
    setLoading(true)
    getBookList();
  }, [indexList]);

  const getBookList = async () => {
    try {
        const booksApi = await BookClubApi.getBookList(indexList);
        setBooks(b => [...b, ...booksApi]);
    } catch (e) {
        console.error("BookList API call data loading error:", e)
    }
    setLoading(false)
  }

  //Loads books data on search submit and as user scroll on infinite scroll
  useEffect(function getBooksOnSearch() {
    console.debug("BookList useEffect getBooksOnSearch");

    setLoading(true)
    searchBook();
  }, [indexSearch]);

  const searchBook = async (searchData) => {
    if(indexSearch == 0 && searchData) {
        setBooks([])
    }
    try {
        const searchBook = await BookClubApi.getSearchedBookResult(indexSearch, searchData);
        setBooks(b => [...b, ...searchBook]);
    } catch (e) {
        console.error("BookSearch API call data loading error:", e)
    }
    setLoading(false)
  }


  if (!books) return <Loading />;

  return (
      <div className="BookList col-md-8 offset-md-2">
        <BookSearchForm searchFor={searchBook} />
        {books.length
            ? (
                <div className="BookList-list">
                  {books.map(book => (
                      <BookCard 
                        key = {book.id}
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
                <p className="lead">Sorry, no results were found!</p>
            )}
        {loading ? <Loading /> : null}
      </div>
  );
}

export default BookList;
