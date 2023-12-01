
const BookApi = require("./bookApi")
const { ApiNotFoundError } = require("../expressError");

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
}

module.exports = Book; 