import { useState, useEffect, useContext } from 'react';
import UserContext from '../auth/UserContext';

/** Custom Hook for managing user review like
 * This hook provides functionality to manage user likes on reviews, including retrieving initial like status and count,
 * updating the like status and count, and handling user interactions to like or unlike a review.
 * 
 * -Utilizes useContext data to send user like to database
 * -Creates state to update review like count and user review like status
 * -Use useEffect to avoid to recalculations
 * 
 * Returns user like status, review like count states and handleLike function
 */
const useReviewLike = (reviewId, reviewLikeCount) => {   
    console.debug("useReviewLike"); 
  
    const { hasLikedReview, likeReview } = useContext(UserContext);
    const [liked, setLiked] = useState();
    const [likes, setLikes] = useState(reviewLikeCount);
    const [error, setError] = useState(null);

    /**By using the useEffect, the liked status is only recalculated when the id avoiding unnecessary recalculations on every render.  */
    useEffect(() => {
        console.debug("BookReview like useEffect, reviewId=", reviewId)

        setLiked(hasLikedReview(reviewId))
    }, [reviewId])
    
    /**
     * Send user like to database
     * Updates the like count and status based on user actions.
     */ 
    const handleLikeReview = async () =>{
        try {
            setError(null);
            if (liked) {
              const unlikeReviewId = await likeReview(reviewId);

              if (unlikeReviewId === reviewId) {
                setLikes((likes) => likes - 1);
                setLiked(false);
                
              }
            } else {
              const likeReviewId = await likeReview(reviewId);

              if (likeReviewId === reviewId) {
                setLikes((likes) => likes + 1);
                setLiked(true);
              } 
            }
        } catch (error) {
          setError("Error liking review.")
          console.error("Error handling review like:", error);
        }
    }

    return { liked, likes, error, handleLikeReview };
}

export default useReviewLike;