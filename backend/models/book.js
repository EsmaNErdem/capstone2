
const BookApi = require("./bookApi")
const db = require("../db");
const { ApiNotFoundError, NotFoundError } = require("../expressError");

const { queryParamsForPartialFilter } = require("../helpers/queryParams")

/** Related functions and API calls for books. */
class Book {

    /** Gets list of books from BookApi
     * 
     * Returns [ { id, title, author, publisher, description, category, cover }, ...] 
     */
    static async getListOfBooks() {
        try {  
            const books = await BookApi.getListOfBooks()

            if (!books) throw new ApiNotFoundError("External API Not Found Book List Data")

            return books.map(book => (
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
    static async likeBook({ id, title, author, publisher, description, category, cover }, username) {
        const preCheck = await db.query(
                `SELECT username
                FROM users
                WHERE username = $1`, [username]
            );
        const user = preCheck.rows[0];
            
        if (!user) throw new NotFoundError(`No username: ${username}`);
            
        let bookId = await db.query(
                `SELECT id
                FROM books
                WHERE id = $1`, [id]
            );

        if(bookId.rows[0]) {
            await db.query(
                `INSERT INTO book_likes (book_id, username)
                 VALUES ($1, $2)`, [id, username]
                );
        } else {
            await db.query(
                `INSERT INTO books 
                 (id, title, author, publisher, description, category, cover)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [id, title, author, publisher, description, category, cover]
            );
            await db.query(
                `INSERT INTO book_likes (book_id, username)
                 VALUES ($1, $2)`, [id, username]
            );
        }
        
        return user
    }

    /** 
     * Remove like from user's book
     */
    static async unlikeBook(bookId, username) {
        const preCheck1 = await db.query(
                `SELECT username
                FROM users
                WHERE username = $1`, [username]
            );
        const user = preCheck1.rows[0];
            
        if (!user) throw new NotFoundError(`No username: ${username}`);
            
        const preCheck2 = await db.query(
                `SELECT id
                FROM books
                WHERE id = $1`, [bookId]
            );
        const book = preCheck2.rows[0];
        if (!book) throw new NotFoundError(`No book: ${bookId}`);

        await db.query(
            `DELETE
             FROM book_likes
             WHERE book_id=$1 AND username = $2`,[bookId, username],
        );
        return preCheck1
    }
}

module.exports = Book; 