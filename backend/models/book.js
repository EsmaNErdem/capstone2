
const BookApi = require("./bookApi")
const User = require("./user")
const db = require("../db");
const { ApiNotFoundError, NotFoundError } = require("../expressError");

const { queryParamsForPartialFilter } = require("../helpers/queryParams")

/** Related functions and API calls for books. */
class Book {

    /** Saves book data to database */
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
    
    /** Gets all like counts for all books from the database */
    static async getAllLikeCounts() {
        const likeCountsQuery = await db.query(
            `SELECT book_id AS id, 
                    COUNT(*) 
            FROM book_likes 
            GROUP BY book_id`
        );

        return likeCountsQuery.rows;
    }

    /** Gets all review counts for all books from the database */
    static async booksReviews() {
        const reviewCountsQuery = await db.query(
            `SELECT book_id AS id, 
                    id AS "reviewId",
                    review,
                    username,
                    created_at AS date,
                    COUNT(*) 
            FROM reviews
            GROUP BY book_id, id`
        );

        return reviewCountsQuery.rows;
    }

    /** Gets list of books from BookApi
     * 
     * Returns [ { id, title, author, publisher, description, category, cover }, ...] 
     */
    static async getListOfBooks() {
        try {  
            const books = await BookApi.getListOfBooks()
            if (!books) throw new ApiNotFoundError("External API Not Found Book List Data")
            const booksFromApi = books.map(book => (
                {
                    id: book.id, 
                    title: book.volumeInfo.title,
                    author: book.volumeInfo.authors[0],
                    publisher: book.volumeInfo.publisher,
                    description: book.volumeInfo.description,
                    category: book.volumeInfo.categories[0],
                    cover: book.volumeInfo.imageLinks.thumbnail
                })
            )
            // Fetch all like counts and review counts from the database
            const likeCounts = await this.getAllLikeCounts();
            const reviews = await this.booksReviews();




            return booksFromApi
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
     * 
     * Returns  [ { id, title, author, publisher, description, category, cover }, ...] as avaliable
     */
    static async searchListOfBooks(search, query={}) {
        try {  
            const termsUrl = queryParamsForPartialFilter(
                query,
                {
                    title: "intitle",
                    author: "inauthor", 
                    publisher: "inpublisher",
                });
            
            
            const books = await BookApi.searchListOfBooks(search.q, termsUrl)
            if (!books) return [];
            return books.map(book => (
                    {
                        id: book.id, 
                        title: book.volumeInfo.title,
                        author: book.volumeInfo.authors[0],
                        publisher: book.volumeInfo.publisher,
                        description: book.volumeInfo.description,
                        cover: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : undefined
                    })
                )
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
            const book = await BookApi.getBook(id)
            
            return {
                id: book.id, 
                title: book.volumeInfo.title,
                author: book.volumeInfo.authors[0],
                publisher: book.volumeInfo.publisher,
                description: book.volumeInfo.description,
                categories: book.volumeInfo.categories,
                cover: book.volumeInfo.imageLinks.medium
            }
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
        const userCheck = await User.getUserByUsername(username)      
        if (!userCheck) throw new NotFoundError(`No username: ${username}`);
            
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
        const userCheck = await User.getUserByUsername(username)           
        if (!userCheck) throw new NotFoundError(`No username: ${username}`);
            
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