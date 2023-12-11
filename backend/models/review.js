const User = require("./user")
const Book = require("./book")

const db = require("../db");
const { NotFoundError } = require("../expressError");

/** Related functions and API calls for books. */
class Review {

    /** Add Review
     * 
     * Adds user review to database
     * Checks if book exists, if not inserts book 
     * Throws error if no user
     * 
     */
    static async add(username, bookData, review) {
        const userCheck = await User.getUserByUsername(username)      
        if (!userCheck) throw new NotFoundError(`No username: ${username}`);

        let book = await Book.getBookById(bookData.id)
        if (book.length == 0) {
            book = await Book.insertBook(bookData)
        } 
        
        const reviewRes =  await db.query(
            `INSERT INTO reviews (review, book_id, username)
            VALUES ($1, $2, $3)
            RETURNING id, review, book_id, username, created_at AS date`, [review, book[0].id, username]
            );

        return reviewRes.rows[0]
    }

    /** Get All Reviews
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
     * Returns [{ reviewId, review, username, date, bookId, title, author, category, numberOfReviewLikes }, ...]
     */
    static async findAll(searchFilters = {}, page = 1, pageSize = 10) {
        let query = `SELECT
                        r.id AS "reviewId",
                        r.review,
                        r.username,
                        r.created_at AS date,
                        b.id AS book_id,
                        b.title,
                        b.author,
                        b.category,
                        COUNT(l.review_id) AS "likeCount"
                    FROM
                        reviews AS r
                            LEFT JOIN books AS b ON r.book_id = b.id
                            LEFT JOIN review_likes AS l ON l.review_id = r.id`;
        let whereExpressions = [];
        let queryValues = [];

        const { title, author, category, username, sortBy } = searchFilters;

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

        if (username) {
        queryValues.push(`%${username}%`);
        whereExpressions.push(`r.username ILIKE $${queryValues.length}`);
        } 
        
        // For each possible sorting term, add to order by, default is date
        let order = " ORDER BY r.created_at DESC"
        if (sortBy == "user") {
            order =  " ORDER BY r.username"
        } else if (sortBy == "popular") {
            order = ` ORDER BY "likeCount" DESC`
        } 

        query += whereExpressions.length > 0 ? ` WHERE ${whereExpressions.join(" AND ")}` : "";
        query += " GROUP BY r.id, b.id" + order;
        query += ` LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2}`;

        queryValues.push(pageSize, (page - 1) * pageSize);

        const reviewsRes = await db.query(query, queryValues);
        return reviewsRes.rows;
    }

    /** Lists Reviews for given bookId
     * 
     * Filters (all optional):
     * - Username of review owner
     * Sort by:
     * - Date of review post (default)
     * - Number of review likes
     * - Username in alphabethical order
     * 
     * Returns [{reviewId, review, username, date, bookId, title, author, category }, ...]
     */
    static async getReviewsByBook(bookId, searchFilters={}) { 
        let query = `SELECT
                        r.id AS "reviewId",
                        r.review,
                        r.username,
                        u.img AS "userImg",
                        r.created_at AS date,
                        b.id AS book_id,
                        COUNT(l.review_id) AS "reviewLikeCount"
                    FROM
                        reviews AS r
                            LEFT JOIN books AS b ON r.book_id = b.id
                            LEFT JOIN review_likes AS l ON l.review_id = r.id
                            LEFT JOIN users as U ON u.username = r.username`;

        let whereExpressions = [];
        let queryValues = [bookId];

        const { username, sortBy } = searchFilters;

        // For each possible search term, add to whereExpressions and queryValues so
        // we can generate the right SQL
        if (username) {
        queryValues.push(`%${username}%`);
        whereExpressions.push(`r.username ILIKE $${queryValues.length}`);
        } 
        
        // For each possible sorting term, add to order by, default is date
        let order = " ORDER BY r.created_at ASC"
        if (sortBy == "user") {
            order =  " ORDER BY r.username"
        } else if (sortBy == "popular") {
            order = ` ORDER BY "reviewLikeCount" DESC`
        }  else if (sortBy == "date") {
            order = " ORDER BY r.created_at DESC"
        }

        query += whereExpressions.length > 0 ? ` WHERE b.id = $1 AND ${whereExpressions.join(" AND ")}` : " WHERE b.id = $1";
        query += " GROUP BY r.id, b.id, u.img" + order;

        const reviewsRes = await db.query(query, queryValues);
        return reviewsRes.rows;
    }
        
    /** Checks if review exist 
     * 
     *  Gets Review by Review ID
     */
    static async getReviewId(id) { 
        const review = await db.query(
            `SELECT id
            FROM reviews
            WHERE id = $1`, [id]
        );

        return review.rows
    }

    /** Checks if review exist 
     * 
     *  Gets Review by Review ID
     */
    static async getReviewLikeCount(id) { 
        const review = await db.query(
            `SELECT COUNT(l.review_id) AS "likeCount"
            FROM
                reviews AS r
                    LEFT JOIN review_likes AS l ON l.review_id = r.id
            WHERE r.id = $1
            GROUP BY r.id`, [id]
        );

        return review.rows
    }

    /** Remove Review
     * 
     * Deletes review
     * 
     */
    static async remove(id, username) {
        const userCheck = await User.getUserByUsername(username)      
        if (!userCheck) throw new NotFoundError(`No username: ${username}`);
            
        const review = await this.getReviewId(id)
        if (review.length == 0) throw new NotFoundError(`No review: ${id}`);

        await db.query(
            `DELETE
             FROM reviews
             WHERE id = $1 AND username = $2`, [id, username]
        );
    }

    /** Likes Review
     * 
     * Adds review to user's liked list
     * 
     */
    static async like(reviewId, username) {
        const userCheck = await User.getUserByUsername(username)      
        if (!userCheck) throw new NotFoundError(`No username: ${username}`);
            
        const review = await this.getReviewId(reviewId)
        if (review.length == 0) throw new NotFoundError(`No review: ${reviewId}`);

        const reviewLike = await db.query(
            `INSERT INTO review_likes (review_id, username)
                VALUES ($1, $2)
                RETURNING review_id`, [reviewId, username]
        );
        
        return reviewLike.rows[0].review_id
    }

    /** Unlikes Review
     * 
     * Remove review from user's liked list
     * 
     */
    static async unlike(reviewId, username) {
        const userCheck = await User.getUserByUsername(username)      
        if (!userCheck) throw new NotFoundError(`No username: ${username}`);
            
        const review = await this.getReviewId(reviewId)
        if (review.length == 0) throw new NotFoundError(`No review: ${reviewId}`);

        await db.query(
            `DELETE
             FROM review_likes 
             WHERE review_id = $1 AND username = $2`, [reviewId, username]
        );

        return review[0].id
    }
}

module.exports = Review; 