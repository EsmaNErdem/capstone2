import React, { useState, useEffect } from "react";
import useReviewDelete from "../hooks/useReviewDelete";
import useReviewAddWithBook from "../hooks/useReviewAddWithBook";
import { useNavigate } from "react-router-dom";
import BookClubApi from "../api";
import ReviewFilterForm from "./ReviewFilterForm";
import ReviewDisplay from "./ReviewDisplay";
import ReviewAddForm from "./ReviewAddForm";
import Loading from "../utilities/Loading";
import Alert from "../utilities/Alert";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Modal, IconButton }from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import "./ReviewList.css"

/**
 * Displays a list of review and filter box.
 * The `ReviewList` component displays a list of review fetched from backend database
 * It supports both infinite scrolling for loading more reviews and filter reviews based on user input
 * 
 * - API call loads reviews data when the component mounts with getAllReviews
 * - This component is designed for the "/reviews" route.
 * - Utilizes ReviewCard and ReviewFilterForm components and called by Routes
 * 
 * - Routes ==> ReviewCard, ReviewFilterForm
 */
const ReviewList = () => {
  console.debug("ReviewList");
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);

  const { error: deleteError, deleteBookReview } = useReviewDelete(setReviews);
  const { error: addError, addBookReview } = useReviewAddWithBook(setReviews, setReviewFormOpen)
  
  /**
   * Fetches the initial batch of reviews from database.
  */  
 useEffect(function getReviewsOnMount() {
    console.debug("ReviewList useEffect getReviewsOnMount");
    
    // Make an API call to get first batch of reviews data from backend
    const getFirstList =  async () => {
      setError(null);
      try {
        const reviewsApi = await BookClubApi.getAllReviews(1);
        setReviews(reviewsApi);
      } catch (e) {
        console.error("ReviewList useEffect API call data loading error:", e);
        setError("An error occurred while fetching reviews.");
      }
      
      setLoading(false)
    }

    // set loading to true while async getFirstList runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to true to control the spinner.
    setLoading(true)
    getFirstList();
  }, []);


  // Gets more reviews list data as user infinite scrolls
  const getReviews = async () => {
    setError(null);
    try {
        const reviewsApi = await BookClubApi.getAllReviews(page);
        reviewsApi.length > 0 ? setHasMore(true) : setHasMore(false);
        setReviews(b => [...b, ...reviewsApi]);
    } catch (e) {
        console.error("ReviewList API call data loading error:", e);
        setError("An error occurred while fetching reviews.");
    }

    setLoading(false)
    setPage(page => page + 1)
  }

  const filterReviewData = (filterData) => {
    let queryTerms = ""
    queryTerms = filterData.title ? `&title=${filterData.title?.trim()}` : ""
    queryTerms += filterData.author ? `&author=${filterData.author?.trim()}` : ""
    queryTerms += filterData.publisher ? `&publisher=${filterData.publisher?.trim()}` : ""
    queryTerms += filterData.category ? `&category=${filterData.category?.trim()}` : ""
    queryTerms += filterData.sortBy ? `&sort=${filterData.sortBy}` : ""
    queryTerms = queryTerms ? `?${queryTerms}` : ""

    if(filterData.title || filterData.author || filterData.category || filterData.username || filterData.sortBy) {
      navigate(`/reviews/filter${queryTerms}`)
    }
  }

  // Opens Modal to display review text input 
  const openReviewAddForm = async () => {
      setReviewFormOpen(true)
  }
  
  // Closes  Modal to display review text input 
  const closeReviewAddForm = async () => {
      setReviewFormOpen(false)
  }

  if (loading) return <Loading />;

  return (
  <InfiniteScroll
    dataLength={reviews.length}
    next={getReviews}
    hasMore={hasMore}
    loader={<Loading />}
  >
      <div className="ReviewList col-md-8 offset-md-2">
        <Modal open={reviewFormOpen} onClose={closeReviewAddForm}>
          <Box className="Review-input" >
            <ReviewAddForm addReviews={addBookReview} rowCount={6} close={true} closeModal={closeReviewAddForm} addBook={true}/>
          </Box>
        </Modal>

        <IconButton
            onClick={openReviewAddForm}
            className="ReviewButton"
            style={{ color:"orangered" }}
            data-testid="add-review-button"
            >
          <span>Add New Book Review</span><AddCommentIcon />
        </IconButton>

        <ReviewFilterForm applyFilters={filterReviewData} prompts={["title", "author", "category", "username"]} navigateForward={true}/>

        {error ? <Alert type="danger" messages={[error]} />: null}
        {(deleteError || addError )&& <Alert type="danger" messages={[deleteError || addError]} />}
        
        {reviews.length
            ? (
                <div className="ReviewList-list">
                  {reviews.map(({ reviewId, review, date,  username, userImg, book_id, title, cover, author, category, reviewLikeCount }) => (
                      <ReviewDisplay 
                          key={reviewId}
                          reviewId={+reviewId}
                          review={review}
                          date={date}
                          username={username}
                          userImg={userImg}
                          bookId={book_id}
                          title={title}
                          author={author}
                          cover={cover}
                          category={category}
                          reviewLikeCount={+reviewLikeCount}
                          deleteReview={deleteBookReview}
                      />
                  ))}
                </div>
            ) : (
                <>
                  <p className="lead">Sorry, no results were found!</p>
                </>
            )}
      </div>
    </InfiniteScroll>
  );
}

export default ReviewList;