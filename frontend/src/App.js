import './App.css';
import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import BookRoutes from "./routes-nav/BookRoutes";
import NavBar from "./routes-nav/NavBar";
import UserContext from "./auth/UserContext";
import BookClubApi from './api';
import Loading from "./utilities/Loading";
// import jwt from "jsonwebtoken";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "bookClub-token";

/** Book Club Social Platform Web Application
 * 
 * - Displays loader while pulling API data
 * 
 * - currenUser is user obj pulled from the backend
 *  if user logged-in, it share user data through out app with useContext
 *  Saves user data into localStorage so when page refereshes, logged-in-user stay consistent
 * 
 * - Manages signup and login API function and their return values token to provide user date flow with context
 * - Makes API call to user like/unlike reviews/books, posts reviews, follow/unfollow users
 *  
 * App -> Routes
 */
const App = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useLocalStorage(TOKEN_STORAGE_ID);
  const [currentUser, setCurrentUser] = useState(null)
  const [reviews, setReviews] = useState(new Set([]))
  const [likedReviews, setLikedReviews] = useState(new Set([]))
  const [likedBooks, setLikedBooks] = useState(new Set([]))
  const [followings, setFollowings] = useState(new Set([]))

  /**
   * Load user data from API, runs when user signup or login and get a token
   * only rerun when a user logs out, so the user state is a dependency for this effect
   */
  useEffect(() => {
    console.debug("App useEffect loadUserInfo", "user=", user);

    const getCurrentUser = async () => {
      if (user) {
        try{
          // set token on BookBlubApi for API call auth.
          BookClubApi.token = user.token
          // get data on the current user
          const currentUser = await BookClubApi.getUser(user.username)

          setCurrentUser(currentUser)
          setReviews(new Set(currentUser.reviews.map(r => r.reviewId)));
          setLikedReviews(new Set(currentUser.likedReviews.map(r => r.reviewId)))
          setLikedBooks(new Set(currentUser.likedBooks.map(b => b.book_id)))
          setFollowings(new Set(currentUser.following.map(u => u.following)))
        } catch (e) {
          console.error("App loadUserInfo: problem loading", e)
          setCurrentUser(null)
        }
      }
      setLoading(false)
    }
    // set loading to true while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to true to control the spinner.
    setLoading(true)
    getCurrentUser()
  }, [user])

  /** 
   * Makes an API call to register user and set user state with user token and username
   * Returns success to the signupform to be redirected to "/" 
   * */
  const signup = async (userSignupData) => {
    try {
      const token = await BookClubApi.registerUser(userSignupData);
      setUser({ token, username: userSignupData.username })
      return { success: true }
    } catch (e) {
      console.error("signup failed", e)
      return {success: false, error: e}
    }
  }
  
  /** 
   * Makes an API call to login user and set user state with user token and username 
   * Returns success to the loginform to be redirected to "/" 
   * */
  const login = async userLoginData => {
    try {
      const token = await BookClubApi.loginUser(userLoginData)
      setUser({ token, username: userLoginData.username })
      return { success: true }
    } catch (e) {
      console.error("login failed", e)
      return { success: false, error: e }
    }
  }

  /** 
   * Logs user out by clearing current user state and user token and username state 
   * */
  const logOut = () => {
    setCurrentUser(null)
    setUser(null)
  }

  /**
   * Searches through current user liked reviews set to find if review has been liked before, 
   * Set.has() returns false or true is O(1) 
   * */
  const hasLikedReview = (reviewId) => {
    return likedReviews.has(reviewId)
  }

  /**
   * Searches through current user liked books set to find if book has been liked before, 
   * */
  const hasLikedBook = (bookId) => {
    return likedBooks.has(bookId)
  }

 /**
   * Searches through current user following set to find if user is following 
   * */
  const hasFollowing = (username) => {
    return followings.has(username)
  }

  /**
   * Searches through current user reviews set to find if the review belogns to currentuser
   * */
  const isUserReview = (reviewId) => {
    return reviews.has(reviewId)
  }

  /** 
  * Send user like review, check if it is already liked, update likedReviews state 
  * Current user cannot like their own reviews
  * */
  const likeReview = async (reviewId) => {
    if(isUserReview(reviewId)) return

    if(hasLikedReview(reviewId)) {
      const unlikedReviewId = await BookClubApi.unlikeReview(reviewId, currentUser.username)
      setLikedReviews(prevLikedReviews => {
        const newLikedReviews = new Set(prevLikedReviews);
        newLikedReviews.delete(unlikedReviewId);
        return newLikedReviews;
      });
      return unlikedReviewId;
    } else {
      const likedReviewId = await BookClubApi.likeReview(reviewId, currentUser.username)
      setLikedReviews(r => new Set([...r, likedReviewId]))
      return likedReviewId
    }
  }

  /** 
  * Add current user review and updates review state
  * Returns review
  * */
  const addUserReview = async (reviewData) => {
    let userReview = await BookClubApi.sendBookReview(currentUser.username, reviewData)
    userReview ={
      reviewId: userReview.id,
      review: userReview.review,
      username: userReview.username,
      userImg: currentUser.img,
      date: userReview.date,
      reviewLikeCount: "0",
    }
    setReviews(r => new Set([...r, userReview.reviewId]))
    return userReview
  }


 /** 
  * Delete current user review and updates review state
  * Returns deleted review id
  * */
 const deleteUserReview = async (reviewId) => {
    let deletedReviewId = await BookClubApi.deleteBookReview(+reviewId,  currentUser.username)
    setReviews(userReviewIds => {
      const newUserReviewIds = new Set(userReviewIds);
      newUserReviewIds.delete(deletedReviewId);
      return newUserReviewIds;
    });
    return deletedReviewId
  }


  /** 
  * Send user like book, check if it is already liked, update likedBooks state 
  * */
  const likeBook = async (bookId, bookData={}) => {
    if(hasLikedBook(bookId)) {
      const unlikedBookId = await BookClubApi.unlikeBook(bookId, currentUser.username)
      setLikedBooks(prevLikedBooks => {
        const newLikedBooks = new Set(prevLikedBooks);
        newLikedBooks.delete(unlikedBookId);
        return newLikedBooks;
      });
      return unlikedBookId
    } else {
      const likedBookId = await BookClubApi.likeBook(bookId, currentUser.username, bookData)
      setLikedBooks(b => new Set([...b, likedBookId]))
      return likedBookId
    }
  }

  /** 
  * Send user like review, check if it is already liked, update likedReviews state 
  * */
  const followUser = async (userToBeFollowed) => {
    
    if(hasFollowing(userToBeFollowed)) {
      const { unfollowedBy } = await BookClubApi.unfollowUser(userToBeFollowed, currentUser.username)
      setFollowings(prevFollowedUsers => {
        const newFollowedUsers = new Set(prevFollowedUsers)
        newFollowedUsers.delete(userToBeFollowed)
        return newFollowedUsers
      })
      
      return unfollowedBy
    } else {    
      const {following, followedBy} = await BookClubApi.followUser(userToBeFollowed, currentUser.username)
      setFollowings(u => new Set([...u, following]))
    
      return { followedBy, userImg: currentUser.img };
    }
  }

  if(loading) return <Loading className="Loading"/>;

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={{ currentUser, setCurrentUser, hasLikedReview, hasLikedBook, isUserReview, hasFollowing, likeReview, addUserReview, deleteUserReview, likeBook, followUser }}>
          <NavBar logOut={logOut} />
          <BookRoutes login={login} signup={signup} />
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
