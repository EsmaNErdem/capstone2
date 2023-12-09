import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import UserContext from "../auth/UserContext";

/**
 * Show short info about a book
 * 
 * - Rendered by BookList to display card for each book
 * - BookList ==> BookCard
 * 
 */
const BookCard = ({ id, title, author, description, publisher, category, cover, bookLikeCount=0, reviews=[] }) => {
    const { hasLikedBook, likeBook } = useContext(UserContext);
    
    // const [bookReviews, setBookReviews] = useState(reviews);
    const [liked, setLiked] = useState();
    const [likes, setLikes] = useState(bookLikeCount);

    /**By using the useEffect, the liked status is only recalculated when the id or the hasLikedBook function changes, avoiding unnecessary recalculations on every render.  */
    useEffect(() => {
        console.debug("Bookcard useEffect, id=", id)

        setLiked(hasLikedBook(id))
    }, [id, hasLikedBook])

    const handleLikeBook = () =>{
        if(liked) {
            likeBook(id)
            setLikes(likes => likes-1)
            setLiked(false)
        } else {
            likeBook(id, { id, title, author, description, publisher, category, cover })
            setLikes(likes => likes+1)
            setLiked(true)
        }
    }
    
    return (
        <div className="BookCard">
            <img alt={title} src={cover}/>
            <h2 data-testid="book-title">{title}</h2>
            <h3 data-testid="book-author">by {author}</h3>
            <p>{description}</p>
            <p>Reviews: {reviews.length}</p>
            <button onClick={handleLikeBook}> 
                {likes}<FontAwesomeIcon icon={solidHeart} style={{ color: liked ? "#f00000" : "#00FF00" }} />
            </button>
        </div>
    )
}

export default BookCard;