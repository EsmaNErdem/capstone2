import { useState, useEffect, useContext } from 'react';
import UserContext from '../auth/UserContext';

/** Custom Hook for managing user book like
 * This hook provides functionality to manage user likes on books, including retrieving initial like status and count,
 * updating the like status and count, and handling user interactions to like or unlike a book.
 * 
 * -Utilizes useContext data to send user like to database
 * -Creates state to update book like count and user book like status
 * -Use useEffect to avoid to recalculations
 * 
 * Returns user like status, book like count states and handleLike function
 */
const useBookLike = (bookId, initialLikes, bookData={}) => {
    console.debug("useBookLike"); 

    const { hasLikedBook, likeBook } = useContext(UserContext);
    const [liked, setLiked] = useState();
    const [likes, setLikes] = useState();
    const [error, setError] = useState(null);

    // Helper function to convert "undefined" or "null" strings to actual undefined
    const convertUndefined = (value) => (value === "undefined" || value === null ? undefined : value);

    // Convert undefined/null strings in the bookData object
    const convertedBookData = Object.fromEntries(
        Object.keys(bookData).map((key) => [key, convertUndefined(bookData[key])])
    );
        
    /**By using the useEffect, the liked status is only recalculated when the id avoiding unnecessary recalculations on every render.  */
    useEffect(() => {
      setLiked(hasLikedBook(bookId));
      setLikes(initialLikes)
    }, [bookId, initialLikes]);
    
    /**
     * Send user like to database
     * Updates the like count and status based on user actions.
     */ 
    const handleLikeBook = async () => {
        try {
            setError(null);
            if (liked) {
                const unlikedBookId = await likeBook(bookId);
                if (unlikedBookId === bookId) {
                    setLikes((likes) => likes - 1);
                    setLiked(false);
                }
            } else {
                const likedBookId = await likeBook(bookId, convertedBookData);
                if (likedBookId === bookId) {
                    setLikes((likes) => likes + 1);
                    setLiked(true);
                }
            }
        } catch (error) {
            setError('Error liking book.');
            console.error('Error handling book like:', error);
        }
    };
    
  return { liked, likes, error, handleLikeBook };
};

export default useBookLike;