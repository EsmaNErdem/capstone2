
const BookApi = require("./bookApi")
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
        return next(err);
        }
    }

    /** Gets a list of books from search result
     *
     * This API Route searches books with terms given in query parameters. 
     * Update data from frontend to Google Book API's syntax with queryParamsForPartialFilter helper function
     * 
     * Returns  [ { id, title, author, publisher, description, category, cover }, ...] as avaliable
     */
    static async searchListOfBooks(search, query) {
        try {  
            const queryParams = queryParamsForPartialFilter(
                query,
                {
                    title: "intitle",
                    author: "inauthor", 
                    publisher: "inpublisher",
                });
            
            // Build the query string with encoded parameters
            const queryString = Object.entries(queryParams)
                .map(([key, value]) => `${encodeURIComponent(key)}:${encodeURIComponent(value)}`)
                .join('+');
    
            const termsUrl = queryString ? `+${queryString}` : '';
            const books = await BookApi.searchListOfBooks(search.q, termsUrl)
            
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
        return next(err);
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
        return next(err);
        }
    }
}

module.exports = Book; 