import React, { useContext, useState, useEffect } from 'react';
import UserContext from "../auth/UserContext";
import Alert from "../utilities/Alert"
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Show review with a like button and adds likes to review
 * 
 * - Rendered by BookReviewDrawer to display card for existing book reviews
 * - Send user like on a review. If fails, shows error to user
 * 
 * - BookReviewDrawer ==> BookReview
 */
const BookReview = ({ reviewId, review, username, userImg, date, reviewLikeCount, deleteReview }) => {
    console.debug("BookReview");
  
    const { hasLikedReview, likeReview, isUserReview } = useContext(UserContext);

    const [liked, setLiked] = useState();
    const [likes, setLikes] = useState(reviewLikeCount);
    const [userReview, setUserReview] = useState();
    const [error, setError] = useState(null);

    /**By using the useEffect, the liked status is only recalculated when the id or the hasLikedBook function changes, avoiding unnecessary recalculations on every render.  */
    useEffect(() => {
        console.debug("BookReview useEffect, reviewId=", reviewId)

        setLiked(hasLikedReview(reviewId))
        setUserReview(isUserReview(reviewId))
    }, [reviewId, hasLikedReview, isUserReview])

    // Send user like API. If fails, shows error to user
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

     // Send user like API. If fails, shows error to user
     const handleDeleteReview = async () =>{
        try {
            setError(null);
            await deleteReview(reviewId);
        } catch (error) {
        setError("Error deleting review.")
        console.error("Error handling review delete:", error);
        }
    }
    // console.log(isUserReview(reviewId), userReview, "KKKKKK", review)

    return (
            <React.Fragment>
                <ListItem  disablePadding>
                    <Avatar alt={username} src={userImg} sx={{ width: 32, height: 32, marginRight: 2 }} />
                    <ListItemText 
                        primary={review} 
                        secondary={`${username} • ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}`}
                    />
                    {userReview ? (
                        <IconButton onClick={handleDeleteReview} color="secondary">
                            <DeleteIcon />
                        </IconButton>
                    ) : (
                        <>
                            <span>{likes}</span>
                            <IconButton onClick={handleLikeReview} color={liked ? 'error' : 'default'}>
                                <FavoriteIcon />
                            </IconButton>
                        </>
                    )}
                </ListItem>
                {error ? <Alert type="danger" messages={[error]} />: null}
                <Divider />
            </React.Fragment>            
        )
}

export default BookReview;