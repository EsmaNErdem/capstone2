import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../auth/UserContext';
import useReviewLike from '../hooks/useReviewLike';
import Alert from '../utilities/Alert';
import { Divider, ListItem, ListItemText, Avatar, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import './ReviewDisplay.css';

const ReviewDisplay = ({ reviewId, review, date, username, userImg, reviewLikeCount, deleteReview, bookId, title=null, author=null, cover=null, category=null}) => {
  console.debug('ReviewDisplay');

  const { isUserReview } = useContext(UserContext);

  const [userReview, setUserReview] = useState();
  const [error, setError] = useState(null);
  const { liked, likes, error: likeError, handleLikeReview } = useReviewLike(
    reviewId,
    reviewLikeCount
  );

  useEffect(() => {
    console.debug('ReviewDisplay useEffect, reviewId=', reviewId);

    setUserReview(isUserReview(reviewId));
  }, [reviewId, isUserReview]);

  const handleDeleteReview = async () => {
    try {
      setError(null);
      await deleteReview(reviewId, bookId);
    } catch (error) {
      setError('Error deleting review.');
      console.error('Error handling review delete:', error);
    }
  };

  return (
    <React.Fragment>
      <ListItem disablePadding className="ReviewDisplay">
        <div className="UserInfo">
          <Link to={`/profile/${username}`} className="UsernameLink">
            <Avatar alt={username} src={userImg} sx={{ width: 32, height: 32, marginRight: 2 }} />
            <ListItemText primary={username} />
          </Link>
        </div>
        <div className="ReviewInfo">
          <ListItemText
            primary={review}
            secondary={`${new Date(date).toLocaleDateString()} ${new Date(
              date
            ).toLocaleTimeString()}`}
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
        </div>
        {title && (
          <div className="BookInfo">
            <Link to={`/books/${bookId}`} className="Title">
                <img alt={title} src={cover} className="CardImage"/>
            </Link>
            <div>
                <h2>
                <Link to={`/books/${bookId}`} className="TitleLink">
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
