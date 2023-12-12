import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useBookLike from "../hooks/useBookLike";
import BookClubApi from "../api";
import ReviewFilterForm from "../reviews/ReviewFilterForm";
import ReviewCard from "../reviews/ReviewCard"
import Loading from "../utilities/Loading";
import Alert from "../utilities/Alert";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCommentIcon from '@mui/icons-material/AddComment';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import './BookDetail.css';

/**
 * Displays detailed info about a book
 * The `BookDetail` component displays a book detail info fetched from the Google Books API,
 * along with database reviews and likes. It supports both infinite scrolling for loading
 * more book related reviews and filter book reviews based on user input.
 * 
 * - API call loads book data when the component mounts with getBook and when the filter changes to load updated review list with getAllReviewsByBook from BookClubApi
 * - Send user like on a book. If fails, shows error to user
 * - This component is designed for the "/books/:id" route.
 * 
 * - Routes ==> BookCard, BookSearchForm
 */
const BookDetail = () => {
    console.debug("BookDetail");

    const { id } = useParams();

    const [loading, setLoading] = useState(true)
    const [book, setBook] = useState(null);
    const [bookReviews, setBookReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fetches the book data from the Google Books API and related reviews from database, then sets the bookReviews state.
     */  
    useEffect(function getBookOnMount() {
        console.debug("BookDetail useEffect getBookOnMount");

        // Make an API call to get book data and book related reviews
        const getBookData =  async () => {
            setError(null);
            try {
                const bookData = await BookClubApi.getBook(id);    
                setBook(bookData)
                getFilteredBookReviews({ sortBy: "date" })
            } catch (e) {
                console.error("BookDetail useEffect API call data loading error:", e);
                setError("An error occurred while fetching book data.");
            }
            
            setLoading(false)
        }

        // set loading to true while async getCurrentUser runs; once the
        // data is fetched (or even if an error happens!), this will be set back
        // to true to control the spinner.
        setLoading(true)
        getBookData()
    }, [id]);

    // With form submission, make an API call and update bookReviews state
    const getFilteredBookReviews = async (data) => {
        try {
            const reviews = await BookClubApi.getAllReviewsByBook(id, data)
            setBookReviews(reviews)
        } catch (e) {
            console.error("BookDetail get filtered book reviews", e);
            setError("An error occurred while fetching filtered reviews.");
        }
    }

    // make sure to wait untill book detail data loads
    const { liked, likes, error: likeError, handleLikeBook } = useBookLike(id, +book?.bookLikeCount);

    const openReviewAddForm = async () => {
        setReviewForm(true)
    }

    if(loading || !book) return <Loading />;
console.log(bookReviews, "HHHHHHH")
    return (
        <div className="BookDetail">
            <Box sx={{ border: 0 }}>
                <Grid container spacing={3} className="BookDetailContainer" style={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid item xs={12} md={4} lg={6}>
                        <Paper className="BookCoverPaper">
                            <img
                            alt={book.title}
                            src={book.cover}
                            className="BookCoverImage"
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper className="BookDetailPaper">
                            <h1 data-testid="book-title">{book.title}</h1>
                            <p>by {book.author}</p>
                            {book.publisher && <p>Publisher {book.publisher}</p>}
                            {book.categories && (
                            <div>
                                <strong>Categories: </strong>
                                {book.categories.map((category, index) => (
                                <span key={index}>
                                    {category}
                                    {index !== book.categories.length - 1 ? ", " : ""}
                                </span>
                                ))}
                            </div>
                            )}
                            <p className="BookSummary">{removeHtmlTags(book.description)}</p>
                            <div className="CardFooter">
                                <div className="LikeSection">
                                    <IconButton
                                        onClick={handleLikeBook}
                                        color={liked ? "error" : "default"}
                                    >
                                    <FavoriteIcon data-testid="like-button" />
                                    </IconButton>
                                    <span>{likes}</span>
                                </div>
                                <div className="ReviewSection">
                                    <span>{bookReviews.length}</span>
                                    <IconButton
                                    onClick={openReviewAddForm}
                                    className="ReviewButton"
                                    style={{ color: bookReviews.length > 0 ? "yellowgreen" : ""}}
                                    >
                                    <AddCommentIcon data-testid="review-button" />
                                    </IconButton>
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            
            {likeError && <Alert type="danger" messages={[likeError]} />}
            {error && <Alert type="danger" messages={[error]} />}
            
            <ReviewFilterForm applyFilters={getFilteredBookReviews} fullFilter={false} />
            {/* <List>
                    {bookReviews.map(({ reviewId, review, username, userImg, date, reviewLikeCount }) => 
                            <ReviewCard 
                                key={reviewId}
                                reviewId={reviewId}
                                review={review}
                                username={username}
                                userImg={userImg}
                                date={date}
                                reviewLikeCount={+reviewLikeCount}
                                deleteReview={deleteReview}
                            />
                        )}
            </List> */}
        </div>
    )

  
}

export default BookDetail;

const removeHtmlTags = (htmlString) => {
    var doc = new DOMParser().parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
}