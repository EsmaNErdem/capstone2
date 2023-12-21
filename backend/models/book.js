
const BookApi = require("./bookApi")
const db = require("../db");
const { ApiNotFoundError, NotFoundError } = require("../expressError");

const { queryParamsForPartialFilter } = require("../helpers/queryParams")

/** Related functions and API calls for books. */
class Book {

    /** Saves book data to database 
     * 
     * Returns book id
     * 
    */
    static async insertBook({ id, title, author, publisher, description, category, cover }) { 
        const bookId = await db.query(
            `INSERT INTO books 
                (id, title, author, publisher, description, category, cover)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id`,
            [id, title, author, publisher, description, category, cover]
        );     

        return bookId.rows
    }
    
    /**  Gets Book by Book ID */
    static async getBookById(id) { 
        const book = await db.query(
            `SELECT id
            FROM books
            WHERE id = $1`, [id]
        );

        return book.rows
    }

    /** Find all book data from database 
     * 
     * Returns array of book data
     * 
     * Returns [ { id, title, author, publisher, description, category, cover, bookLikeCount, reviews }, ...] 
    */
    static async findAllBooksFromDatabase(limit=null, searchFilters={}) { 
        let query = `SELECT
        id,
        title,
        author,
        publisher,
        description,
        category,
        cover
        FROM books`
        let queryValues = [];
        
        const { search } = searchFilters;
        if (search) {
            queryValues.push(`%${search}%`);
            query += ` WHERE title ILIKE $${queryValues.length}`
        }
        query += ` ORDER BY title`
        
        if(limit){
            queryValues.push(limit);
            query += ` LIMIT $${queryValues.length} OFFSET 0;`;
        } 

        let books = await db.query(query, queryValues);  
        return books.rows
    }
        
    /**  Gets Book by Book ID */
    static async getBookById(id) { 
        const book = await db.query(
            `SELECT id
            FROM books
            WHERE id = $1`, [id]
        );

        return book.rows
    }
    
    /** Gets all like counts for all books from the database
     * 
     * Returns array of number of book like attached with book id
     * 
     * Returns [ { id: '2', count: '1' }, ...}
     */
    static async getAllLikeCounts() {
        const likeCountsQuery = await db.query(
            `SELECT book_id AS id, 
                    COUNT(*) AS "bookLikeCount"
            FROM book_likes 
            GROUP BY book_id`
        );

        const likeCounts = {};
        likeCountsQuery.rows.forEach((row) => {
          likeCounts[row.id] = row.bookLikeCount;
        });
    
        return likeCounts;
    }

    /** Gets all review counts for all books from the database 
     * 
     * Returns array of reviews of each book attached with book id
     * 
     * Returns [ { id, reviewId, review, username, date, reviewLikeCount }, ...]
    */
    static async getAllReviews() {
        const reviewsQuery = await db.query(
            `SELECT r.book_id AS id, 
                    r.id AS "reviewId",
                    r.review,
                    r.username,
                    u.img AS "userImg",
                    r.created_at AS date,
                    COUNT(l.review_id) AS "reviewLikeCount"
            FROM reviews AS r
                LEFT JOIN review_likes AS l ON l.review_id = r.id
                LEFT JOIN users as U ON u.username = r.username
            GROUP BY book_id, id, u.img
            ORDER BY date DESC`
        );

        const reviews= {};
        reviewsQuery.rows.forEach(row => {
            if (!reviews[row.id]) {
                reviews[row.id] = [];
            }
            reviews[row.id].push(row);
        });

        return reviews;
    }

    /** Gets like counts for a specific bookfrom the database 
     * 
     * Returns number
    */
    static async getLikeCountForBook(bookId) {
        const likeCountQuery = await db.query(
            `SELECT COUNT(*) AS "likeCount"
            FROM book_likes 
            WHERE book_id = $1`,
            [bookId]
        );

        return likeCountQuery.rows[0]?.likeCount || 0;
    }

    /** Gets all reviewsfor a specific bookfrom the database 
     * 
     * Returns array of reviews of the book attached 
     * 
     * Returns [ { reviewId, review, username, date, reviewLikeCount }, ...]
    */
    static async getReviewsForBook(bookId) {
        const reviewsQuery = await db.query(
                `SELECT
                    id AS "reviewId",
                    review,
                    reviews.username,
                    created_at AS date,
                    COUNT(review_likes.review_id) AS "reviewLikeCount"
                FROM reviews
                    LEFT JOIN review_likes ON review_likes.review_id = reviewS.id
                WHERE book_id = $1
                GROUP BY id
                ORDER BY date DESC;`,
                [bookId]
        );

        return reviewsQuery.rows;
    }
    
    /** Gets list of books from BookApi
     * 
     * Get books reviews and number of like to compare it to database
     * Checks through database to add like and reviews related data
     * 
     * Returns [ { id, title, author, publisher, description, category, cover, bookLikeCount, reviews }, ...] 
     */
    static async getListOfBooks(startIndex) {
        try {  
            const books = await BookApi.getListOfBooks(startIndex)
            if (!books) throw new ApiNotFoundError("External API Not Found Book List Data")

            // Fetch all like counts and review counts from the database
            const likeCounts = await this.getAllLikeCounts();
            const reviews = await this.getAllReviews();

            const booksFromApi = books.map(book => {
                const bookData =  {
                            id: book.id, 
                            title: book.volumeInfo.title,
                            author: book.volumeInfo.authors ? book.volumeInfo.authors[0] : "Unknown",
                            publisher: book.volumeInfo.publisher,
                            description: book.volumeInfo.description,
                            category: book.volumeInfo.categories ? book.volumeInfo.categories[0] : null,
                            cover: book.volumeInfo.imageLinks.thumbnail
                        };

                return {
                    ...bookData,
                    bookLikeCount: likeCounts[bookData.id] || 0,
                    reviews: reviews[bookData.id] || []
                };
            });

            return booksFromApi;
        } catch (err) {
            console.error("Error in getListOfBooks:", err);
            throw new ApiNotFoundError("External API Not Found Book List Data at getListOfBooks")
        }
    }

    /** Gets a list of books from search result 
     *
     * This API Route searches books with data given req.body and detail search with terms given in query parameters. 
     * Can provide advense search filter in query with these terms:
     * - title
     * - author
     * - publisher
     * - subject
     * Update data from frontend to Google Book API's syntax with queryParamsForPartialFilter helper function
     * Checks through database to add like and reviews related data
     * 
     * Returns  [ { id, title, author, publisher, description, category, cover, bookLikeCount, reviews }, ...] as avaliable
     */
    static async searchListOfBooks(search, query={}, startIndex) {
        try {  
            const termsUrl = queryParamsForPartialFilter(
                query,
                {
                    title: "intitle",
                    author: "inauthor", 
                    publisher: "inpublisher",
                });
            
            
            const books = await BookApi.searchListOfBooks(search, termsUrl, startIndex)
            if (!books) return [];

            // Fetch all like counts and review counts from the database
            const likeCounts = await this.getAllLikeCounts();
            const reviews = await this.getAllReviews();

            const booksFromApi =  books.map(book =>{
                        const bookData =  {
                            id: book.id, 
                            title: book.volumeInfo.title,
                            author: book.volumeInfo.authors ? book.volumeInfo.authors[0] : undefined,
                            publisher: book.volumeInfo.publisher,
                            description: book.volumeInfo.description,
                            cover: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : undefined
                        };
                return {
                    ...bookData,
                    bookLikeCount: likeCounts[bookData.id] || 0,
                    reviews: reviews[bookData.id]
                };
            });
            return booksFromApi
        } catch (err) {
            console.error("Error in searchListOfBooks:", err);
            throw new ApiNotFoundError("External API Not Found Book List Search Data at searchListOfBooks")
        }
    }

    /** Gets a book by gooogle books API id
     * 
     * Returns book details {  id, title, author, publisher, description, category, cover }
     */
    static async getBook(id) {
        try {  
            const book = await BookApi.getBook(id);
    
            const bookData = {
                id: book.id, 
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors[0],
                publisher: book.volumeInfo.publisher,
                description: book.volumeInfo.description,
                categories: book.volumeInfo.categories,
                cover: book.volumeInfo.imageLinks.thumbnail || undefined
            };
            let likeCount = "0";
            let reviews = [];

            // Fetch like counts and reviews for the specific book from the database if the book exist in the database
            let bookId = await this.getBookById(id)
            if(bookId.length !== 0) {
                likeCount = await this.getLikeCountForBook(id);
                reviews = await this.getReviewsForBook(id);
            } 
            
            return {
                ...bookData,
                bookLikeCount: likeCount,
                reviews        
            };
        } catch (err) {
            console.error("Error in getBook:", err);
            throw new ApiNotFoundError("External API Not Found Book Data at getBook")    
        }
    }

    /** Likes Book
     * Saves book data to database
     * Adds the book to user's liked list
     * 
     */
    static async likeBook({ id, ...bookData}, username) {
        const userCheck = await db.query(
            `SELECT username
             FROM users
             WHERE username = $1`,
          [username],
        );
        if (!userCheck.rows[0]) throw new NotFoundError(`No username: ${username}`);
            
        let book = await this.getBookById(id)
        if(book.length == 0) {
            book = await this.insertBook({ id, ...bookData })
        } 
            
        await db.query(
            `INSERT INTO book_likes (book_id, username)
                VALUES ($1, $2)`, [book[0].id, username]
        );

        return book[0].id
    }

    /** 
     * Remove like from user's book
     */
    static async unlikeBook(bookId, username) {
        const userCheck = await db.query(
            `SELECT username
             FROM users
             WHERE username = $1`,
          [username],
        );
        if (!userCheck.rows[0]) throw new NotFoundError(`No username: ${username}`);
            
        const book = await this.getBookById(bookId)
        if (book.length == 0) throw new NotFoundError(`No book: ${bookId}`);

        await db.query(
            `DELETE
             FROM book_likes
             WHERE book_id = $1 AND username = $2`,[bookId, username],
        );

        return book[0].id
    }
}

module.exports = Book; 