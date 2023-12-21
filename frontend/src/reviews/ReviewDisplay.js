import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../auth/UserContext';
import useReviewLike from '../hooks/useReviewLike';
import Alert from '../utilities/Alert';
import { Divider, ListItem, ListItemText, Avatar, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import './ReviewDisplay.css';

/**
 * Show review with a like button and adds likes to review 
 * if current user review show delete button adn delete review
 * 
 * - Rendered by ReviewList and ReviewFilterList to display reviews and related books
 * - Send user like on a review. If fails, shows error to user
 * 
 * - ReviewList, ReviewFilterList ==> ReviewCard
 */
const ReviewDisplay = ({ reviewId, review, date, username, userImg, reviewLikeCount=0, deleteReview, bookId, title, author=null, cover=null, category=null, likedReview=false, setReviews=null }) => {
  console.debug('ReviewDisplay');

  const { isUserReview } = useContext(UserContext);

  const [userReview, setUserReview] = useState();
  const [error, setError] = useState(null);
  const { liked, likes, error: likeError, handleLikeReview } = useReviewLike(reviewId, reviewLikeCount);

  /**By using the useEffect, the liked status is only recalculated when the id or the   */
  useEffect(() => {
    console.debug('ReviewDisplay useEffect, reviewId=', reviewId);

    setUserReview(isUserReview(reviewId));
  }, [reviewId, isUserReview]);

  // Delete current user review
  const handleDeleteReview = async () => {
    try {
      setError(null);
      await deleteReview(reviewId, bookId);
    } catch (error) {
      setError('Error deleting review.');
      console.error('Error handling review delete:', error);
    }
  };

  const handleLikeReviewButton = async () => {
    await handleLikeReview();
    if(liked && likedReview) {
      setReviews(prevReviews => {
        const updatedReviews = prevReviews.filter(review => review.reviewId !== reviewId)
        return updatedReviews
      })
    }
  }

  return (
    <React.Fragment>
      <ListItem disablePadding className="ReviewDisplay">
        <div className="UserInfo">
          <Link to={`/profile/${username}`} className="UsernameLink" data-testid="review-display-profile-link">
            <Avatar alt={username} src={userImg} sx={{ width: 32, height: 32, marginRight: 2 }} />
            <ListItemText 
              primary={username} 
              secondary={`${new Date(date).toLocaleDateString()} ${new Date(
                date
              ).toLocaleTimeString()}`}
            />
          </Link>
          {userReview ? 
          (
            <>
              <div style={{ display: "flex", alignItems: "stretch" }}>
                <IconButton color="success">
                  <span>{likes}</span>
                  <FavoriteIcon />
                </IconButton>
                <IconButton onClick={handleDeleteReview} color="secondary" data-testid="review-display-review-delete">
                    <DeleteIcon />
                </IconButton>
              </div>
            </>
          ) : (
            <div>
              <IconButton onClick={handleLikeReviewButton} color={liked ? 'error' : 'default'} data-testid="review-display-review-like">
                <span data-testid="display-like-count">{likes}</span>
                <FavoriteIcon />
              </IconButton>
            </div>
          )}
        </div>
        <div className="ReviewInfo">
          <ListItemText
            primaryTypographyProps={{fontSize: '18px', fontWeight: "600"}} 
            primary={review}
          />
        </div>
        {title && (
          <div className="BookInfo">
            <Link to={`/books/${bookId}`} className="Title">
                <img alt={title} src={cover} className="CardImage"/>
            </Link>
            <div>
                <h2>
                <Link to={`/books/${bookId}`} className="TitleLink" data-testid="review-display-book-title-link">
                    {title}
                </Link>
                </h2>
                {author && <p>Author: {author}</p>}
                {category && <p>Category: {category}</p>}
            </div>
          </div>
        )}
      </ListItem>
      {likeError && <Alert type="danger" messages={[likeError]} />}
      {error ? <Alert type="danger" messages={[error]} /> : null}
      <Divider />
    </React.Fragment>
  );
};

export default ReviewDisplay;
