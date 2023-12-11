import React, { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import UserContext from "../auth/UserContext";
import Alert from "../utilities/Alert"
import BookClubApi from "../api";
import BookReviewDrawer from "../drawer/BookReviewDrawer";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import './BookCard.css'; 

/**
 * Show short info about a book
 * 
 * - Rendered by BookList to display card for each book and shows how many reviews and likes the book has.
 * - Send user like on a book. If fails, shows error to user
 * - Display book review count and like count
 * 
 * - BookList ==> BookCard
 */
const BookCard = ({ id, title, author, description, publisher, category, cover, bookLikeCount=0, reviews=[] }) => {
    console.debug("BookCard");
    
    const { hasLikedBook, likeBook, addUserReview, deleteUserReview, isUserReview } = useContext(UserContext);
    
    const [bookReviews, setBookReviews] = useState(reviews);
    const [liked, setLiked] = useState();
    const [likes, setLikes] = useState(bookLikeCount);
    const [error, setError] = useState(null);
    const [isReviewDrawerOpen, setReviewDrawerOpen] = useState(false);

    /**By using the useEffect, the liked status is only recalculated when the id or the hasLikedBook function changes, avoiding unnecessary recalculations on every render.  */
    useEffect(() => {
        console.debug("Bookcard useEffect, id=", id)

        setLiked(hasLikedBook(id))
    }, [id, hasLikedBook])

    // Send user like API. If fails, shows error to user
    const handleLikeBook = async () =>{
        try {
            setError(null);
            if (liked) {
              const unlikedBookId = await likeBook(id);
              if (unlikedBookId === id) {
                setLikes((likes) => likes - 1);
                setLiked(false);
              }
            } else {
              const likedBookId = await likeBook(id, {
                id,
                title,
                author,
                description,
                publisher,
                category,
                cover,
              });
              if (likedBookId === id) {
                setLikes((likes) => likes + 1);
                setLiked(true);
              }
            }
          } catch (error) {
            setError("Error liking book.")
            console.error("Error handling book like:", error);
          }
    }

    // add current user's book review, function is called in BookReviewDrawer
    const addBookReview = async ({ review }) => {
        try {
            const newReview = await addUserReview({book: {id, title, author, description, publisher, category, cover}, review});
            setBookReviews(r => [...r, {...newReview, id}])
            return newReview
        } catch (error) {
            setReviewDrawerOpen(false);
            setError("Error adding book review.")
            console.error("Error adding book review:", error);
          }
    }

    // deletes current user's book review, function is called in BookReview
    const deleteBookReview = async (reviewId) => {
        try {
            const deletedReviewId = await deleteUserReview(reviewId);
            if(reviewId === +deletedReviewId){
                const reviews = await BookClubApi.getAllReviewsByBook(id)
                setBookReviews(reviews)
            }
        } catch (error) {
            setReviewDrawerOpen(false);
            setError("Error deleting book review.")
            console.error("Error deleting book review:", error);
          }
    }

    const openReviewDrawer = async () => {
        try {
            const reviews = await BookClubApi.getAllReviewsByBook(id)
            setBookReviews(reviews)
            setReviewDrawerOpen(true);
        } catch (e) {
            console.error("BookList API call data loading error:", e);
            setError("An error occurred while fetching book reviews.");
        }
    }

    const closeReviewDrawer = () => {
        setReviewDrawerOpen(false);
    }
    
    return (
        <div className="BookCard">
            <Link to={`/books/${id}`} className="Title">
                <img alt={title} src={cover} className="CardImage"/>
            </Link>
            <div className="CardContent">
                <Link to={`/books/${id}`} className="Title">
                    <h2 data-testid="book-title">{title}</h2>
                </Link>
                <h3 data-testid="book-author">by {author}</h3>
                <p>{description}</p>
                <div className="CardFooter">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>{bookReviews.length}</span>
                            <IconButton onClick={openReviewDrawer} style={{ color: reviews.length > 0 ? "yellowgreen" : ""}}>
                                <CommentIcon  data-testid="review-button" />
                            </IconButton>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>{likes}</span>
                            <IconButton onClick={handleLikeBook} color={liked ? 'error' : 'default'}>
                                <FavoriteIcon data-testid="like-button"/>
                            </IconButton>
                        </div>
                </div>
                {error ? <Alert type="danger" messages={[error]} />: null}
            </div>
            <BookReviewDrawer isOpen={isReviewDrawerOpen} onClose={closeReviewDrawer} reviews={bookReviews} addReviews={addBookReview} deleteReview={deleteBookReview} bookData ={{id, title, author, cover}} />
        </div>
    )
}

export default BookCard;