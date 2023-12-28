const axios = require("axios")
const { ApiNotFoundError } = require("../expressError");

const API_KEY = process.env.API_KEY
const uid = process.env.uid
const BASE_URL = "https://www.googleapis.com/books/v1"

/**
 * A static class encapsulating functions and API calls related to books using the Google Books API.
 * The API_KEY is securely managed through environment variables.
 */
class BookApi {

    /**
     * Sends an Axios GET request to the Google Books API for the specified endpoint.
     * 
     * @param {string} endpoint 
     * @param {object} data 
     * @returns {Promise} - A Promise that resolves with the API response.
     * @throws {Error} - Throws an error if the API call is unsuccessful.
     */
    static async request(endpoint, data = {}) {
        console.debug("API Call:", endpoint, data);

        const url = `${BASE_URL}/${endpoint}`;
        const params = {...data, key:API_KEY}
        
        try {
            return await axios.get(url, { params });
        } catch (err) {
          console.error("API Error:", err.response);
          let message = err.response
          throw new ApiNotFoundError(Array.isArray(message) ? message : [message]);
        }
    }

    /** Gets list of books from Google Books API
     * 
     * Returns array of book details in objects
     */
    static async getListOfBooks(startIndex) {
        const res = await this.request(`users/${uid}/bookshelves/0/volumes`, { startIndex, maxResults: 20 }) 
        return res.data.items
    }

    /** Gets a list of books from search result
     *
     * Returns array of book details in objects
     */
    static async searchListOfBooks(search, terms, startIndex) {
        const res = await this.request(`volumes?q=${encodeURIComponent(search)}${terms}`, { projection:"lite", startIndex, maxResults: 20 })
        return res.data.items
    }

    /** Gets a book by Gooogle Books API id
     * 
     * Returns book details in an object
     */
    static async getBook(id) {
        const res = await this.request(`volumes/${id}`)
        return res.data
    }
}

module.exports = BookApi;


