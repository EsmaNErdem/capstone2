import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserContext from "../auth/UserContext";
import useReviewLike from '../hooks/useReviewLike';
import Alert from "../utilities/Alert";
import { Divider, ListItem, ListItemText, Avatar, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Show review with a like button and adds likes to review 
 * if current user review show delete button adn delete review
 * 
 * - Rendered by BookReviewDrawer to display card for existing book reviews
 * - Send user like on a review. If fails, shows error to user
 * 
 * - BookReviewDrawer, BookDetail ==> ReviewCard
 */
const ReviewCard = ({ reviewId, review, date, username, userImg, reviewLikeCount, deleteReview, bookId }) => {
    console.debug("ReviewCard");
  
    const { isUserReview } = useContext(UserContext);

    const [userReview, setUserReview] = useState();
    const [error, setError] = useState(null);
    const { liked, likes, error: likeError, handleLikeReview } = useReviewLike(reviewId, reviewLikeCount)

    /**By using the useEffect, the liked status is only recalculated when the id or the   */
    useEffect(() => {
        console.debug("ReviewCard useEffect, reviewId=", reviewId)

        setUserReview(isUserReview(reviewId))
    }, [reviewId, isUserReview])

    // Delete current user review
    const handleDeleteReview = async () =>{
        try {
            setError(null);
            await deleteReview(reviewId, bookId);
        } catch (error) {
        setError("Error deleting review.")
        console.error("Error handling review delete:", error);
        }
    }

    return (
            <React.Fragment>
                <ListItem  disablePadding>
                    <Link to={`/profile/${username}`} data-testid="review-card-profile-link">
                        <Avatar alt={username} src={userImg} sx={{ width: 32, height: 32, marginRight: 2 }} />
                    </Link>
                    <ListItemText 
                        primary={review} 
                        secondary={`${username} • ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}`}
                    />
                    {userReview ?
                     (
                        <div style={{ display: "flex", alignItems: "stretch" }}>
                            <IconButton color="success">
                                <span>{likes}</span>
                                <FavoriteIcon />
                            </IconButton>
                            <IconButton onClick={handleDeleteReview} color="secondary"  data-testid="review-card-review-delete">
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    ) 
                    : (
                        <>
                            <IconButton onClick={handleLikeReview} color={liked ? 'error' : 'default'} data-testid="review-card-review-like">
                                <span>{likes}</span>
                                <FavoriteIcon />
                            </IconButton>
                        </>
                    )}
                </ListItem>
                {likeError && <Alert type="danger" messages={[likeError]} />}
                {error ? <Alert type="danger" messages={[error]} />: null}
                <Divider />
            </React.Fragment>            
        )
}

export default ReviewCard;