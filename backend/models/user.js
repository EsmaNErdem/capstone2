"use strict";

const Book = require("./book");
const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */
class User {

    /** Get Username
     * Gets User by username
     * 
     */
    static async getUserByUsername(username) { 
      const userCheck = await db.query(
        `SELECT username
         FROM users
         WHERE username = $1`,
      [username],
    );

      return userCheck.rows[0]
    }


  /** Register user with data { username, password, firstName, lastName, email }
   *
   * Returns { username, firstName, lastName, email }
   *
   * Throws BadRequestError on duplicates.
   **/
   static async register({ username, password, firstName, lastName, email, img }) {
    const userCheck = await this.getUserByUsername(username);
    if (userCheck) {
        throw new BadRequestError(`Duplicate username: ${username}`);
    }
    
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            img,
            email)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", img, email`,
        [
          username,
          hashedPassword,
          firstName,
          lastName,
          img,
          email
        ],
    );

    const user = result.rows[0];

    return user;
   }


   /** Authenticate user with data { username, password }.
   *
   * Returns { username, first_name, last_name, img, email }
   * 
   * Tries to find user first then password checks
   * 
   * Throws UnauthorizedError is user not found or wrong password.
   **/
   static async login({ username, password }) {
    const result = await db.query(
        `SELECT username,
                password,
                first_name AS "firstName",
                last_name AS "lastName",
                img,
                email
         FROM users
         WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
        // compare hashed password to a new hash from password
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid === true) {
        delete user.password;
        return user;
        }
    }

    throw new UnauthorizedError("Invalid username/password");
   }

  /**Get user reviews
   * 
   * Gets all reviews that belong to user with given id
   * Filters (all optional):
   * - Book Title, 
   * - Book Author,
   * - Book Category
   * Sort by:
   * - Date of review post (default)
   * - Number of review likes
   * 
   * Returns [{reviewId, review, date, bookId, title, author, category }, ...]
   */
  static async getUserReviews(username, searchFilters={}) {
    let query = `SELECT
                    r.id AS "reviewId",
                    r.review,
                    r.username,
                    r.created_at AS date,
                    b.id AS book_id,
                    b.title,
                    b.cover,
                    b.author,
                    b.category,
                    COUNT(l.review_id) AS "reviewLikeCount"
                FROM
                    reviews AS r
                        LEFT JOIN books AS b ON r.book_id = b.id
                        LEFT JOIN review_likes AS l ON l.review_id = r.id`;

    let whereExpressions = [];
    let queryValues = [username];
    
    const { title, author, category, sortBy } = searchFilters;

    // For each possible search term, add to whereExpressions and queryValues so
    // we can generate the right SQL
    if (title) {
      queryValues.push(`%${title}%`);
      whereExpressions.push(`b.title ILIKE $${queryValues.length}`);
    }

    if (author !== undefined) {
      queryValues.push(`%${author}%`);
      whereExpressions.push(`b.author ILIKE $${queryValues.length}`);
    }

    if (category) {
      queryValues.push(`%${category}%`);
      whereExpressions.push(`b.category ILIKE $${queryValues.length}`);
    }
  
    // For each possible sorting term, add to order by, default is date
    let order = sortBy === "popular" ? ` ORDER BY "reviewLikeCount" DESC` : " ORDER BY r.created_at DESC"

    query += whereExpressions.length > 0 ? ` WHERE r.username = $1 AND ${whereExpressions.join(" AND ")}` : " WHERE r.username = $1";
    query += " GROUP BY r.id, b.id" + order;
    const reviewsRes = await db.query(query, queryValues);

    return reviewsRes.rows;
  }  

  /**Get user like books
     * 
     * Gets all books that were liked by the user
     * Filters (all optional):
     * - Book Title, 
     * - Book Author,
     * - Book Category
     * Sort by:
     * - Popular books (default)
     * - Title in alphabethical order
     * 
     * Returns [{ bookId, title, author, publisher, description, category, cover, bookLikeCount }, ...]
     */
  static async getUserLikedBooks(username, searchFilters={}) {
    let query = `SELECT
            b.id AS book_id,
            b.title,
            b.author,
            b.publisher,
            b.description,
            b.category,
            b.cover,
            COUNT(bl.username) AS "bookLikeCount"
        FROM
            books AS b 
                LEFT JOIN book_likes AS bl ON bl.book_id = b.id`;
    
    let whereExpressions = [];
    let queryValues = [username];
    
    const { title, author, category, sortBy } = searchFilters;

    // For each possible search term, add to whereExpressions and queryValues so
    // we can generate the right SQL
    if (title) {
      queryValues.push(`%${title}%`);
      whereExpressions.push(`b.title ILIKE $${queryValues.length}`);
    }

    if (author !== undefined) {
      queryValues.push(`%${author}%`);
      whereExpressions.push(`b.author ILIKE $${queryValues.length}`);
    }

    if (category) {
      queryValues.push(`%${category}%`);
      whereExpressions.push(`b.category ILIKE $${queryValues.length}`);
    }
  
    // For each possible sorting term, add to order by, default is date
    let order = sortBy === "title" ? ` ORDER BY b.title ASC` : ` ORDER BY "bookLikeCount" DESC`

    query += whereExpressions.length > 0 ? ` WHERE bl.username = $1 AND ${whereExpressions.join(" AND ")}` : " WHERE bl.username = $1";
    query += " GROUP BY b.id, b.title, b.author, b.publisher, b.description, b.category, b.cover" + order;
    const booksRes = await db.query(query, queryValues);

    const likeCounts = await Book.getAllLikeCounts();
    const likedBooks = booksRes.rows.map(book =>({...book, bookLikeCount:likeCounts[book.book_id]}));
    return likedBooks
  } 

  
    /** Return review's like counts
     * 
     *  Gets Review by Review ID
     */
    static async getAllReviewsLikeCount() { 
      const likeCountsQuery = await db.query(
          `SELECT review_id AS id,
                  COUNT(review_id) AS "reviewLikeCount"
          FROM review_likes
          GROUP BY id`
      );

      const likeCounts = {};
      likeCountsQuery.rows.forEach((row) => {
        likeCounts[row.id] = row.reviewLikeCount;
      });
      return likeCounts
  }

    /**Get user like books
     * 
     * Gets all books that were liked by the user
     * Filters (all optional):
     * - Book Title, 
     * - Book Author,
     * - Book Category
     * 
     * Returns [{ bookId, title, author, publisher, description, category, cover, bookLikeCount }, ...]
     */
    static async getUserLikedReviews(username, searchFilters={}) {
      let query = `SELECT
              r.id AS "reviewId",
              r.review,
              r.username,
              u.img AS "userImg",
              r.created_at AS date,
              b.id AS book_id,
              b.title,
              b.cover,
              b.author,
              b.category,
              COUNT(l.review_id) AS "reviewLikeCount"
          FROM
              reviews AS r
                  LEFT JOIN books AS b ON r.book_id = b.id
                  LEFT JOIN review_likes AS l ON l.review_id = r.id
                  LEFT JOIN users as U ON u.username = r.username`;
      
      let whereExpressions = [];
      let queryValues = [username];
      
      const { title, author, category, sortBy } = searchFilters;
  
      // For each possible search term, add to whereExpressions and queryValues so
      // we can generate the right SQL
      if (title) {
        queryValues.push(`%${title}%`);
        whereExpressions.push(`b.title ILIKE $${queryValues.length}`);
      }
  
      if (author !== undefined) {
        queryValues.push(`%${author}%`);
        whereExpressions.push(`b.author ILIKE $${queryValues.length}`);
      }
  
      if (category) {
        queryValues.push(`%${category}%`);
        whereExpressions.push(`b.category ILIKE $${queryValues.length}`);
      }
    
       // For each possible sorting term, add to order by, default is date
       let order = " ORDER BY r.created_at DESC"

      query += whereExpressions.length > 0 ? ` WHERE l.username = $1 AND ${whereExpressions.join(" AND ")}` : " WHERE l.username = $1";
      query += " GROUP BY r.id, b.id, u.img" + order;
  
      const likedReviewRes = await db.query(query, queryValues);

      
      const likeCounts = await this.getAllReviewsLikeCount();
      const likedReviews = likedReviewRes.rows.map(review =>({...review, reviewLikeCount:likeCounts[review.reviewId]}));
      return likedReviews
    }

  /**Get user like counts on their reviews
   * 
   * Returns total number of like the user received
   * 
   */
  static async getUserLikeCount(username) {
    const likeCount = await db.query(
      `SELECT COUNT(r.id) AS "likeCount"
        FROM
            reviews AS r 
                LEFT JOIN review_likes AS l ON l.review_id = r.id
      WHERE r.username = $1
      GROUP BY r.username`, [username] 
      );

    return likeCount.rows;
  } 
   
  /** Given a username, return data about user.
   *
   * Returns { username, firstName, lastName, email, img, reviews, bookLikes, reviewLikes, receivedLikesCount }
   * 
   * Throws NotFoundError if user not found.
   **/
  static async get(username, searchFilters={}) {
    const userRes = await db.query(
        `SELECT username,
                first_name AS "firstName",
                last_name AS "lastName",
                img,
                email
        FROM users
        WHERE username = $1`,
        [username],
      );

      const user = userRes.rows[0];
      if (!user) throw new NotFoundError(`No user: ${username}`);

      user.reviews = await this.getUserReviews(username, searchFilters);
      user.likedBooks = await this.getUserLikedBooks(username, searchFilters);
      user.likedReviews = await this.getUserLikedReviews(username, searchFilters)
      user.recievedLikeCount = await this.getUserLikeCount(username);

      return user;
    }


   /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, img }
   *
   * Returns { username, firstName, lastName, email, img }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */
   static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          firstName: "first_name",
          lastName: "last_name",
        });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                img`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  // /** Given usernames, following and followedBy accordingly, send follow to database
  //  *
  //  * Returns { following,  followedBy }
  //  * 
  //  * Throws NotFoundError if users not found.
  //  **/
  // static async followUser(following, followedBy) {
  //   const userCheck1 = await this.getUserByUsername(following);
  //   const userCheck2 = await this.getUserByUsername(followedBy);
  //   if (!userCheck1 || !userCheck2) {
  //       throw new UnauthorizedError(`No user found with username: ${username}`);
  //   }
  //   const followRes = await db.query(
  //       ``,
  //       [],
  //     );

  //     const user = userRes.rows[0];
  //     if (!user) throw new NotFoundError(`No user: ${username}`);

  //     user.reviews = await this.getUserReviews(username, searchFilters);
  //     user.likedBooks = await this.getUserLikedBooks(username, searchFilters);
  //     user.likedReviews = await this.getUserLikedReviews(username, searchFilters)
  //     user.recievedLikeCount = await this.getUserLikeCount(username);

  //     return user;
  //   }


}

module.exports = User; 