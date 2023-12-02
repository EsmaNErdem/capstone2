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


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// // Child router for example: /users/3/books/4 user id access
// const childRouter = express.Router({ mergeParams: true });
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


/** GET /books => { books: [ { id, title, author, publisher, description, category, cover }, ...] }
 *
 * Return JSON list of API retrieved books data
 * Can provide search filter in query:
 * - title
 * - author
 * - publisher
 * - category
 * 
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
    const q = req.query;

    try {  
      const books = await Book.getListOfBooks();
      return res.json({ books });
    } catch (err) {
      console.error("Error in GET /books:", err);
      return next(err);
    }
});

/** GET /books/search => { books: [ { id, title, author, publisher, description, category, cover }, ...] }
 *
 * Return JSON list of API retrieved books data filter by search params
 * Can provide advense search filter in query with these terms:
 * - Body: { search: string (required) }
 * - Query Parameters: title, author, publisher, subject
 * 
 * Authorization required: none
 */

router.get("/search", async function (req, res, next) {
    const search = req.body;
    const terms = req.query;

    try {
      const validator = jsonschema.validate({...search, ...terms}, bookSearchSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const books = await Book.searchListOfBooks(search, terms);
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
 * Authorization required: same-user-as-:username
 */

router.post("/:id/users/:username", ensureCorrectUser, async function (req, res, next) {
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
 * Authorization required: same-user-as-:username
 */

router.delete("/:id/users/:username", ensureCorrectUser,  async function (req, res, next) {
  try {
    const bookId = await Book.unlikeBook(req.params.id, req.params.username);

    return res.json({ unlikedBook: bookId });
  } catch (err) {
    console.error("Error in DELETE /books/:id/username/:username", err);
    return next(err);
  }
});


module.exports =  router;
