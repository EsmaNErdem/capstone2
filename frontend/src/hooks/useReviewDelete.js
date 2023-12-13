import { useState, useContext } from 'react';
import UserContext from '../auth/UserContext';
import BookClubApi from "../api";

/** Custom Hook for managing user review delete
 * This hook provides functionality to manage user review delete and updateting bookReviews state
 * 
 * -Utilizes useContext data to delete user review from database
 * -Updates book review
 * 
 * Returns error and addBookReview function
 */
const useReviewDelete = (bookId, setBookReviews, errorHandlingState, sortData={}) => {
    console.debug("useReviewDelete"); 

    const { deleteUserReview } = useContext(UserContext);
    const [error, setError] = useState(null);

    // deletes current user's book review, function is called in BookReview
    const deleteBookReview = async (reviewId) => {
        try {
            const deletedReviewId = await deleteUserReview(reviewId);
            if(reviewId === +deletedReviewId){
                const reviews = await BookClubApi.getAllReviewsByBook(bookId, sortData)
                setBookReviews(reviews)
            }
        } catch (error) {
            errorHandlingState(false);
            setError("Error deleting book review.")
            console.error("Error deleting book review:", error);
        }
    } 
    
    return { error, deleteBookReview }

}

export default useReviewDelete