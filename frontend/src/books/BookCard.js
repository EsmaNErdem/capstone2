import React, { useState } from "react";
import { Link } from 'react-router-dom';
import useBookLike from "../hooks/useBookLike";
import useReviewAdd from "../hooks/useReviewAdd";
import useReviewDelete from "../hooks/useReviewDelete";
import Alert from "../utilities/Alert"
import BookClubApi from "../api";
import BookReviewDrawer from "./BookReviewDrawer";
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
        
    const [bookReviews, setBookReviews] = useState(reviews);
    const [isReviewDrawerOpen, setReviewDrawerOpen] = useState(false);

    const { liked, likes, error: likeError, handleLikeBook } = useBookLike(id, bookLikeCount, { id, title, author, description, publisher, category, cover });
    const { error: addError, addBookReview } = useReviewAdd(setBookReviews, { id, title, author, description, publisher, category, cover }, setReviewDrawerOpen)
    const { error: deleteError, deleteBookReview } = useReviewDelete(id, setBookReviews, setReviewDrawerOpen);
    const [error, setError] = useState(null);


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
                <p>{description?.length > 250 ? `${description.slice(0, 250)}...` : description}</p>
                <div className="CardFooter">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>{bookReviews.length}</span>
                            <IconButton onClick={openReviewDrawer} style={{ color: bookReviews.length > 0 ? "yellowgreen" : ""}}>
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
                {(likeError || addError || deleteError) && <Alert type="danger" messages={[likeError || addError || deleteError]} />}
                {error ? <Alert type="danger" messages={[error]} />: null}
            </div>
            <BookReviewDrawer isOpen={isReviewDrawerOpen} onClose={closeReviewDrawer} reviews={bookReviews} addReviews={addBookReview} deleteReview={deleteBookReview} bookData ={{id, title, author, cover}} />
        </div>
    )
}

export default BookCard;