import { useState, useContext } from 'react';
import UserContext from '../auth/UserContext';

/** Custom Hook for managing user review submission for /reviews route components
 * This hook provides functionality to manage user review submission and updateting bookReviews state
 * 
 * -Utilizes useContext data to send user review to database
 * -Updates book review
 * 
 * Returns error and addBookReview function
 */
const useReviewAddWithBook = (setBookReviews, errorHandlingState) => {
    console.debug("useReviewAddWithBook"); 

    const { addUserReview } = useContext(UserContext);
    const [error, setError] = useState(null);

    // add current user's book review, function is called in BookReviewDrawer
    const addBookReview = async (review, bookData={}) => {
        try {
            const convertedBookData = convertNullInObject(bookData);
            const newReview = await addUserReview({book: convertedBookData, review});
            setBookReviews(r => [{...newReview, book_id:bookData.id, title:bookData.title, author:bookData.author, cover:bookData.cover, category:bookData.category, reviewLikeCount:0}, ...r])
            return newReview
        } catch (error) {
            errorHandlingState(false)
            setError("Error adding book review.")
            console.error("Error adding book review:", error);
        }
    } 
    
    return { error, addBookReview }

}

export default useReviewAddWithBook

const convertNullInObject = (obj) => {
    const convertedObj = {};
    for (const key in obj) {
      convertedObj[key] = obj[key] === null ? "" : obj[key];
    }
    return convertedObj;
  };