import React, { useState, useEffect } from "react";
import useReviewDelete from "../hooks/useReviewDelete";
import useReviewAddWithBook from "../hooks/useReviewAddWithBook";
import { useLocation, useNavigate } from "react-router-dom";
import BookClubApi from "../api";
import ReviewFilterForm from "./ReviewFilterForm";
import ReviewDisplay from "./ReviewDisplay";
import ReviewAddForm from "./ReviewAddForm";
import Loading from "../utilities/Loading";
import Alert from "../utilities/Alert"
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Modal, IconButton }from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import "./ReviewList.css"

/**
 * Displays a list of filtered review and filter box.
 * The `ReviewFilterList` component displays a list of filtered review fetched from backend database
 * It supports both infinite scrolling for loading more reviews and filter reviews based on user input
 * 
 * - API call loads reviews data when the component mounts with getAllReviews
 * - This component is designed for the "/reviews/filter" route.
 * - Utilizes ReviewCard and ReviewFilterForm components and called by Routes
 * 
 * - Routes ==> ReviewCard, ReviewFilterForm
 */
const ReviewFilterList = () => {
  console.debug("ReviewFilterList");
        
  const location = useLocation();
  // Parse filter data from URL parameters
  const urlSearchParams = new URLSearchParams(location.search);
  const title = urlSearchParams.get("title");
  const author = urlSearchParams.get("author");
  const category = urlSearchParams.get("category");
  const username = urlSearchParams.get("username");
  const sortBy = urlSearchParams.get("sort");
  
  // Utility function to convert "undefined" strings to undefined
  const convertUndefined = value => (value === "undefined" ? undefined : value);
  const filterDataFromURL = {
    title: convertUndefined(title),
    author: convertUndefined(author),
    category: convertUndefined(category),
    username: convertUndefined(username),
    sortBy: convertUndefined(sortBy),
  }
  
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
   * Fetches the initial batch of filtered reviews from database
   * filter data from url
  */ 
 useEffect(function getReviewsOnMount() {
    console.debug("ReviewList useEffect getReviewsOnMount");

    // Make an API call to get first batch of reviews data from backend
    const getFirstList =  async () => {
      setError(null);
      try {
        const reviewsApi = await BookClubApi.getAllReviews(1, filterDataFromURL);
        setReviews(reviewsApi);
      } catch (e) {
        console.error("ReviewList useEffect API call data loading error:", e);
        setError("An error occurred while fetching reviews.");
      }
      
      setLoading(false)
    }

    // set loading to true while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to true to control the spinner.
    setLoading(true)
    getFirstList();
  }, [title, author, category, username, sortBy]);


  // Gets more reviews list data as user infinite scrolls
  const getReviews = async () => {
    setError(null);
    try {
        const reviewsApi = await BookClubApi.getAllReviews(page, filterDataFromURL);
        reviewsApi.length > 0 ? setHasMore(true) : setHasMore(false);
        setReviews(b => [...b, ...reviewsApi]);
    } catch (e) {
        console.error("ReviewList API call data loading error:", e);
        setError("An error occurred while fetching reviews.");
    }

    setLoading(false)
    setPage(page => page + 1)
  }

//When review form resubmmit, submitted data is used to get firts batch of review data and updates, 
  const filterReviewData = async (filterData) => {
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
          <span>Add New Book Review</span><AddCommentIcon data-testid="review-button" />
        </IconButton>
        
        <ReviewFilterForm applyFilters={filterReviewData} prompts={["title", "author", "category", "username"]} initialValue={filterDataFromURL}/>
        {reviews.length
            ? (
                <div className="ReviewList-list">
                  {reviews.map(({ reviewId, review, date,  username, userImg, book_id, title, author, category, reviewLikeCount, cover }) => (
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
                  {error ? <Alert type="danger" messages={[error]} />: null}
                  {(deleteError || addError)&& <Alert type="danger" messages={[deleteError || addError]} />}

                </>
            )}
      </div>
    </InfiniteScroll>
  );
}

export default ReviewFilterList;