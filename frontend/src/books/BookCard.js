import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserContext from "../auth/UserContext";

/**
 * Show short info about a book
 * 
 * - Rendered by BookList to display card for each book
 * - BookList ==> BookCard
 * 
 */
const BookCard = ({ id, title, author, description, publisher, category, cover, bookLikeCount=0, reviews }) => {
    const { hasLikedBook, likeBook } = useContext(UserContext);
    
    const [bookReviews, setBookReviews] = useState(reviews);
    const [liked, setLiked] = useState();

    /**By using the useEffect, the liked status is only recalculated when the id or the hasLikedBook function changes, avoiding unnecessary recalculations on every render.  */
    useEffect(() => {
        console.debug("Bookcard useEffect, id=", id)

        setLiked(hasLikedBook(id))
    }, [id, hasLikedBook])

    const handleLikeBook = () =>{
        if(hasLikedBook(id)) {
            likeBook(id)
            setLiked(false)
        } else {
            likeBook(id, { id, title, author, description, publisher, category, cover })
            setLiked(true)
        }
    }
    
    return
}

export default BookCard;