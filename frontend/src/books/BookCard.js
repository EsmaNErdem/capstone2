import React, { useContext, useState, useEffect } from "react";
import UserContext from "../auth/UserContext";
import Alert from "../utilities/Alert"
import BookClubApi from "../api";
import BookReviewDrawer from "./BookReviewDrawer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faComment } from '@fortawesome/free-solid-svg-icons';
import './BookCard.css'; 

/**
 * Show short info about a book
 * 
 * - Rendered by BookList to display card for each book
 * - Send user like on a book. If fails, shows error to user
 * - Display each books reviews
 * 
 * - BookList ==> BookCard
 */
const BookCard = ({ id, title, author, description, publisher, category, cover, bookLikeCount=0, reviews=[] }) => {
    console.debug("BookCard");
    
    const { hasLikedBook, likeBook, addUserReview } = useContext(UserContext);
    
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
            <img alt={title} src={cover} className="CardImage"/>
            <div className="CardContent">
                <h2 data-testid="book-title">{title}</h2>
                <h3 data-testid="book-author">by {author}</h3>
                <p>{description}</p>
                <div className="CardFooter">
                    <button data-testid="review-button" className="Reviews" onClick={openReviewDrawer}>
                        {bookReviews.length} <FontAwesomeIcon icon={faComment} style={{ color: reviews.length > 0 ? "yellowgreen" : ""}} />
                    </button>
                    <button data-testid="like-button" className="LikeButtton" onClick={handleLikeBook}>
                        {likes} <FontAwesomeIcon icon={solidHeart} style={{ color: liked ? "red" : "black"}} />
                    </button>
                </div>
                {error ? <Alert type="danger" messages={[error]} />: null}
            </div>
            <BookReviewDrawer isOpen={isReviewDrawerOpen} onClose={closeReviewDrawer} reviews={bookReviews} addReviews={addBookReview} bookData ={{id, title, author, cover}} />
        </div>
    )
}

export default BookCard;