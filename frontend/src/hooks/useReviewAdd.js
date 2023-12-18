import { useState, useContext } from 'react';
import UserContext from '../auth/UserContext';

/** Custom Hook for managing user review submission on books/:id route components
 * This hook provides functionality to manage user review submission and updateting bookReviews state
 * 
 * -Utilizes useContext data to send user review to database
 * -Updates book review
 * 
 * Returns error and addBookReview function
 */
const useReviewAdd = (setBookReviews, bookData={}, errorHandlingState) => {
    console.debug("useReviewAdd"); 

    const { addUserReview } = useContext(UserContext);
    const [error, setError] = useState(null);

    // add current user's book review, function is called in BookReviewDrawer
    const addBookReview = async ({ review }) => {
        try {
            console.log({book: bookData, review})
            const newReview = await addUserReview({book: bookData, review});
            setBookReviews(r => [{...newReview, id:bookData.id}, ...r])
            return newReview
        } catch (error) {
            errorHandlingState(false)
            setError("Error adding book review.")
            console.error("Error adding book review:", error);
        }
    } 
    
    return { error, addBookReview }

}

export default useReviewAdd