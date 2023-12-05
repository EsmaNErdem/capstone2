"use strict";

/** Routes for reviews. */

const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth")

const jsonschema = require("jsonschema");
const reviewNewSchema = require("../schemas/reviewNew.json");
const reviewFilterSchema = require("../schemas/reviewFilter.json")
const reviewBookFilterSchema = require("../schemas/reviewBookFilter.json")

const { BadRequestError } = require("../expressError");

const Review = require("../models/review");

/**
 * POST /reviews/add/users/:username: { username, book, review } => { review }
 *
 * user must include in request body:
 * - book:  { id, title, author, publisher, description, category, cover }
 * - review:  review
 * JSONSchema validates incoming data to keep database clean and bug free
 * 
 * Returns review
 *
 * Authorization required: same-user-as-:username
 */
router.post("/add/users/:username", ensureCorrectUser, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, reviewNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }

      const review = await Review.add(req.params.username, req.body.book, req.body.review);
      return res.status(201).json({ review });
    } catch (err) {
      return next(err);
    }
});

/**
 * DELETE /reviews/:id/users/:username: => { unlikedRevied: reviewId }
 *
 * Deletes review
 * Returns reviewId
 *
 * Authorization required: same-user-as-:username
 */
router.delete("/:id/users/:username", ensureCorrectUser, async function (req, res, next) {
    try {
      const reviewId = await Review.remove(req.params.id, req.params.username);
      return res.json({ deleted: req.params.id });
    } catch (err) {
      return next(err);
    }
});

/**
 * GET /reviews: => { reviews: [{ reviewId, review, username, date, bookId, title, author, category, numberOfReviewLikes }, ...] }
 *    
 * Filters (all optional):
 * - Book Title, 
 * - Book Author,
 * - Book Category
 * - Username of review owner
 * Sort by:
 * - Date of review post (default)
 * - Number of review likes
 * - Username in alphabethical order
 * 
 * Returns reviews
 * Authorization required: logged-in user
 */
router.get("/:page", ensureLoggedIn, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.query, reviewFilterSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
      
      const reviews = await Review.findAll(req.query, req.params.page);
      // console.log("*******", req.query, !validator.valid, reviews)
      return res.json({ reviews });
    } catch (err) {
      return next(err);
    }
});

/**
 * GET /reviews/books/:id: => { reviews: [{ reviewId, review, username, date, bookId, title, author, category, numberOfReviewLikes }, ...] }
 *    
 * Filters (all optional):
 * - Username of review owner
 * Sort by:
 * - Date of review post (default)
 * - Number of review likes
 * - Username in alphabethical order
 * 
 * Returns reviews of given book ID
 * Authorization required: logged-in user
 */
router.get("/books/:id", ensureLoggedIn, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.query, reviewBookFilterSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }

      const reviews = await Review.getReviewsByBook(req.params.id, req.query);
      return res.json({ reviews });
    } catch (err) {
      return next(err);
    }
});

/**
 * POST /reviews/:id/users/:username: => { likedRevied: reviewId }
 *
 * Add likes to review
 * Returns reviewId
 * 
 * Authorization required: same-user-as-:username
 */
router.post("/like/:id/users/:username", ensureCorrectUser, async function (req, res, next) {
    try {
      const reviewId = await Review.like(req.params.id, req.params.username);
      return res.status(201).json({ likedReview: reviewId });
    } catch (err) {
      return next(err);
    }
});

/**
 * DELETE /reviews/:id/users/:username: => { unlikedRevied: reviewId }
 *
 * Unlikes review
 * Returns reviewId
 *
 * Authorization required: same-user-as-:username
 */
router.delete("/like/:id/users/:username", ensureCorrectUser, async function (req, res, next) {
    try {
      const reviewId = await Review.unlike(req.params.id, req.params.username);
      return res.json({ unlikedReview: reviewId });
    } catch (err) {
      return next(err);
    }
});

module.exports =  router;