import React, { useState, useEffect } from "react";
import useReviewDelete from "../hooks/useReviewDelete";
import { useNavigate } from "react-router-dom";
import BookClubApi from "../api";
import ReviewFilterForm from "./ReviewFilterForm";
import ReviewDisplay from "./ReviewDisplay";
import Loading from "../utilities/Loading";
import Alert from "../utilities/Alert"
import InfiniteScroll from "react-infinite-scroll-component";
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

  const { error: deleteError, deleteBookReview } = useReviewDelete(setReviews);

  
  /**
   * Fetches the initial batch of reviews from database.
  */  
 useEffect(function getBooksOnMount() {
    console.debug("ReviewList useEffect getBooksOnMount");
    
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

    // set loading to true while async getCurrentUser runs; once the
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
    if (filterData.title) filterData.title = filterData.title.trim()
    if (filterData.author) filterData.author = filterData.author.trim()
    if (filterData.publisher) filterData.publisher = filterData.publisher.trim()
    if (filterData.subject) filterData.subject = filterData.subject.trim()

    let queryTerms = ""
    queryTerms = filterData.title ? `&title=${filterData.title}` : ""
    queryTerms += filterData.author ? `&author=${filterData.author}` : ""
    queryTerms += filterData.publisher ? `&publisher=${filterData.publisher}` : ""
    queryTerms += filterData.category ? `&category=${filterData.category}` : ""
    queryTerms += filterData.sortBy ? `&sort=${filterData.sortBy}` : ""
    queryTerms = queryTerms ? `?${queryTerms}` : ""
    if(filterData.title || filterData.author || filterData.category || filterData.username || filterData.sortBy) {
      navigate(`/reviews/filter${queryTerms}`)
    }
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
        <ReviewFilterForm applyFilters={filterReviewData} prompts={["title", "author", "category", "username"]} navigateForward={true}/>
        {reviews.length
            ? (
                <div className="ReviewList-list">
                  {reviews.map(({ reviewId, review, date,  username, userImg,book_id, title, author, category, likeCount, cover }) => (
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
                          reviewLikeCount={+likeCount}
                          deleteReview={deleteBookReview}
                      />
                  ))}
                </div>
            ) : (
                <>
                  <p className="lead">Sorry, no results were found!</p>
                  {error ? <Alert type="danger" messages={error} />: null}
                  {(deleteError)&& <Alert type="danger" messages={[deleteError]} />}

                </>
            )}
      </div>
    </InfiniteScroll>
  );
}

export default ReviewList;