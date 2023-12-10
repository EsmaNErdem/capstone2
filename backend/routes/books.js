"use strict";

/** Routes for users. */

const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth")
const { BadRequestError } = require("../expressError");

const jsonschema = require("jsonschema");
const bookSearchSchema = require("../schemas/bookSearch.json")
const bookNewSchema = require("../schemas/bookNew.json")

const Book = require("../models/book")


/** GET /books/all/:startIndex => { books: [ { id, title, author, publisher, description, category, cover, bookLikeCount, reviews }, ...] }
 *
 * Return JSON list of API retrieved books data
 * 	{
			"id": "ayJpGQeyxgkC",
			"title": "To Kill a Mockingbird 40th",
			"author": "Harper Lee",
			"publisher": "HarperCollins Christian Publishing",
			"description": "The explosion of racial hate and violence in a small Alabama town is viewed by a little girl whose father defends a Black man accused of rape",
			"category": "FICTION",
			"cover": "http://books.google.com/books/content?id=ayJpGQeyxgkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
		}

 * Authorization required: none
 */

router.get("/all/:startIndex", async function (req, res, next) {
    try {  
      const books = await Book.getListOfBooks(req.params.startIndex);
      
      return res.json({ books });
    } catch (err) {
      console.error("Error in GET /books:", err);
      return next(err);
    }
});

// const fetchMoreData = async () => {
//   setLoading(true);
//   try {
//     const nextPage = currentPage + 1;
//     const newData = await fetchData(nextPage);
//     setData((prevData) => [...prevData, ...newData]);
//     setCurrentPage(nextPage);
//   } catch (error) {
//     console.error("Error fetching more data:", error);
//   } finally {
//     setLoading(false);
//   }
// };
// const fetchData = async (page) => {
//   const response = await fetch(`/api/books?page=${page}`);
//   const data = await response.json();
//   return data.books;
// }



/** GET /books/search/:startIndex => { books: [ { id, title, author, publisher, description, category, cover }, ...] }
 *
 * Return JSON list of API retrieved books data filter by search params
 * Can provide advense search filter in query with these terms:
 * - Query Parameters: { search: string (required), terms: { title, author, publisher, subject } (optional) }
 * 
 * Authorization required: none
 */
router.get("/search/:startIndex", async function (req, res, next) {
    const {terms, search} = req.query;

    try {
      const validator = jsonschema.validate({search, ...terms}, bookSearchSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const books = await Book.searchListOfBooks(search, terms, req.params.startIndex);
      return res.json({ books });
    } catch (err) {
      console.error("Error in GET /books/search:", err);
      return next(err);
    }
});

/** GET /books/:id => { book: { id, title, author, publisher, description, category, cover }}
 * /books/IUq6BwAAQBAJ
 * 
 * Return JSON list of API retrieved book data by id
 * 
 * Authorization required: none
 */
router.get("/:id", async function (req, res, next) {
    try {
      const book = await Book.getBook(req.params.id);
      return res.json({ book });
    } catch (err) {
      console.error("Error in GET /books/:id:", err);
      return next(err);
    }
});

/** POST /books/:id/users/:username => { likedBook: bookId }
 * /books/IUq6BwAAQBAJ/users/test
 * 
 * Saves book data to database and adds book id to user's book_likes
 * Book data will be sent from frontend
 * 
 * Authorization required: logged-in user
 */
router.post("/:id/users/:username", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, bookNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const bookId = await Book.likeBook(req.body, req.params.username);
    return res.status(201).json({ likedBook: bookId });
  } catch (err) {
    console.error("Error in POST /books/:id/username/:username", err);
    return next(err);
  }
});

/** DELETE /books/:id/users/:username => { unlikedBook: book title }
 * /books/IUq6BwAAQBAJ/users/EsmaE
 * 
 * Removes book from user's liked list
 * 
 * Authorization required: logged-in user
 */
router.delete("/:id/users/:username", ensureLoggedIn,  async function (req, res, next) {
  try {
    const bookId = await Book.unlikeBook(req.params.id, req.params.username);

    return res.json({ unlikedBook: bookId });
  } catch (err) {
    console.error("Error in DELETE /books/:id/username/:username", err);
    return next(err);
  }
});


module.exports =  router;
