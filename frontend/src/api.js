import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */
class BookClubApi {
    // the token for interactive with the API will be stored here.
    static token;

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);

        //there are multiple ways to pass an authorization token, this is how you pass it in the header.
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `User Token ${BookClubApi.token}` };
        const params = (method === "get")
            ? data
            : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Individual API routes

    /** 
     * Get details on a book by id
     */
    static async getBook(id) {
        const res = await this.request(`books/${id}`);
        return res.book;
    }

    /** 
     * Get all books from database
     */
    static async getBooksFromDatabase(limit, data) {
        const res = await this.request(`books/all-db/${limit}`, data);
        return res.books;
    }

    /**
     * Get all books
     * Books data is paginated, as index as params increase more data loads
     */
    static async getBookList(index) {
        const res = await this.request(`books/all/${index}`)
        return res.books;
    }

    /**
     * Get search books result, sending filter as params
     * Books data is paginated, as index as params increase more data loads
     * Search and detailed search terms are sent in query
     * - data: { search: string (required), terms: { title, author, publisher, subject } (optional) }
     */
    static async getSearchedBookResult(index, data) {
        const res = await this.request(`books/search/${index}`, data)
        return res.books;
    }

    /**
     * Send user book like, returns liked book id
     * Data includes book database 
     * - data:  { id, title, author, publisher, description, category, cover }
     */
    static async likeBook(id, username, data) {
        const res = await this.request(`books/${id}/users/${username}`, data, "post")
        return res.likedBook;
    }

    /**
     * Deletes user book like, returns unliked book id
     */
    static async unlikeBook(id, username) {
        const res = await this.request(`books/${id}/users/${username}`, {}, "delete")
        return res.unlikedBook;
    }

    /**
     * Send post request to register a user, return token
     */
    static async registerUser(data) {
        const res = await this.request(`users/register`, data, "post")
        return res.token;
    }

    /**
     * Send post request to login user, return token
     */
    static async loginUser(data) {
        const res = await this.request(`users/login`, data, "post")
        return res.token;
    }

    /**
     * Get details on a user 
     */
    static async getUser(username) {
    const res = await this.request(`users/${username}`)
    return res.user;
    }

    /**
     * Send delete request to update user
     */
    static async updateUser(username, data) {
        const res = await this.request(`users/${username}`, data, "patch")
        return res.user;
    }

    /**
     * Send user follow
     */
    static async followUser(following, followedBy) {
        const res = await this.request(`users/${following}/follow/${followedBy}`, {}, "post")
        return res.follow;
    }

    /**
     * Send user unfollow
     */
    static async unfollowUser(following, unfollowedBy) {
        const res = await this.request(`users/${following}/follow/${unfollowedBy}`, {}, "delete")
        return res.unfollow;
    }

    /**
     * Get previous messages for a given chat room
     */
    static async getRoomPreviousMessages(roomName) {
        const res = await this.request(`chats/${roomName}`, {})
        return res.messages;
    }

    /**
     * Get previous chat rooms with last chat text for current user
     */
    static async getUserPreviousMessages(currentUser) {
        const res = await this.request(`chats/rooms/${currentUser}`, {})
        return res.messages;
    }

    /**
     * Send user book review
     * - data: { review: string (required), book: { id, title, author, publisher, description, category, cover } (required)}
     */
    static async sendBookReview(username, data) {
    const res = await this.request(`reviews/add/users/${username}`, data, "post")
    return res.review;
    }

    /**
     * Deleted user book review
     */
    static async deleteBookReview(id, username) {
        const res = await this.request(`reviews/${id}/users/${username}`, {}, "delete")
        return res.deleted;
    }
    
    /**
     * Get all reviews, sending filter as params
     * Review data is paginated, as page as params increase more data loads
     * - data: { title, author, category, username, sortBy: [date, user, popular] }
     */
    static async getAllReviews(page, data) {
        const res = await this.request(`reviews/${page}`, data)
        return res.reviews;
    }

     /**
     * Get all reviews on a book, sending filter as params
     * - data: { username, sortBy: [date, user, popular] }
     */
     static async getAllReviewsByBook(id, data) {
        const res = await this.request(`reviews/books/${id}`, data)
        return res.reviews;
    }

    /**
     * Send user review like, returns liked review id
     */
    static async likeReview(id, username) {
        const res = await this.request(`reviews/like/${id}/users/${username}`, {}, "post")
        return res.likedReview;
    }

    /**
     * Deletes user review like, returns unliked review id
     */
    static async unlikeReview(id, username) {
        const res = await this.request(`reviews/like/${id}/users/${username}`, {}, "delete")
        return res.unlikedReview;
    }

}

export default BookClubApi
