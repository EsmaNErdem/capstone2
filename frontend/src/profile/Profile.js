import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useReviewDelete from "../hooks/useReviewDelete";
import BookClubApi from "../api";
import ReviewDisplay from "../reviews/ReviewDisplay";
import BookCard from "../books/BookCard";
import ProfileCard from "./ProfileCard";
import ProfileEditForm from "./ProfileEditForm"
import Loading from "../utilities/Loading";
import Alert from "../utilities/Alert";
import UserContext from '../auth/UserContext';
import useFollowUser from "../hooks/userFollowUser";
import { AppBar, Avatar, Box, Tab, Tabs, Typography, Modal, IconButton  } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import "./Profile.css"

/**Display User Profile data
 * Display list user related data under tabs and check user on view is whether current user and changes view accordingly.
 * 
 * - Shows list of reviews owned by user, reviews and books liked by user, and user's following and followers. 
 * - Displays edit profile form in modal if user is current user
 * - Handle user follow if user is not current user
 * 
 * - Routes ==> BookCard, ReviewDisplay, ProfileEditForm
 */
const Profile = () => {
    console.debug("Profile");

    const { username } = useParams();
    const { currentUser } = useContext(UserContext);

    // checks if user on view is current user
    const currUserProfile = currentUser.username === username;

    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(0);
    const [error, setError] = useState(null);
    const [user, setUser] = useState();
    const [userFollowings, setUserFollowings] = useState([]);
    const [userFollowers, setUserFollowers] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [userLikedReviews, setUserLikedReviews] = useState([]);
    const [userLikedBooks, setUserLikedBooks] = useState([]);
    const [userEditFormOpen, setUserEditFormOpen] = useState(false);

    const { error: deleteError, deleteBookReview } = useReviewDelete(setUserReviews);
    const { followed, error: followUser, handleFollowUser } = useFollowUser(user?.username, setUserFollowers, currUserProfile, false)

    /**
     * Fetches the user data when component mounts
     */  
    useEffect(function getProfileOnMount() {
        console.debug("Profile useEffect getProfileOnMount");
        
        // Make an API call to get user profile data
        const getuserProfile =  async () => {
        setError(null);
        try {
            const userApi = await BookClubApi.getUser(username);
            setUser(userApi);
            setUserFollowings(userApi.following)
            setUserFollowers(userApi.followers)
            setUserReviews(userApi.reviews)
            setUserLikedReviews(userApi.likedReviews)
            setUserLikedBooks(userApi.likedBooks)
        } catch (e) {
            console.error("Profile useEffect API call data loading error:", e);
            setError("An error occurred while fetching user profile.");
        }
        
        setLoading(false)
        }

        // set loading to true while async getCurrentUser runs; once the
        // data is fetched (or even if an error happens!), this will be set back
        // to true to control the spinner.
        setLoading(true)
        getuserProfile();
    }, [username]);

    // Opens Modal to display user profile edit form
    const openEditProfileForm = async () => {
        setUserEditFormOpen(true)
    }

    // Closes Modal to display user profile edit form
    const closeEditProfileForm = async () => {
        setUserEditFormOpen(false)
    }

    if(!user || loading) return <Loading />;

    return (
        <div className="Profile">
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '1rem', marginBottom: '2rem' }}>
                <Avatar alt={user.username} src={user.img} sx={{ width: 60, height: 60 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between"}}>
                        <Typography variant="h4">{user.username}</Typography>
                        { currUserProfile ? (
                            <IconButton 
                                onClick={openEditProfileForm}
                                color="primary" 
                                aria-label="edit" 
                                sx={{ marginLeft: '2rem', color:"orangered" }}
                                data-testid="edit-profile-button"
                            >
                                <EditIcon /><span>Edit</span>
                            </IconButton>
                            )
                            : (
                                <IconButton 
                                    onClick={handleFollowUser} 
                                    color="primary" 
                                    aria-label="follow" 
                                    sx={{ marginLeft: '2rem', color: '#6d17b7' }}
                                    data-testid="follow-profile-button"
                                >
                                    {followed ? "Unfollow" : "+ Follow"}
                                </IconButton>
                            )
                        }
                    </Box>
                    {currUserProfile &&
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginLeft: '1rem' }}>
                            <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
                        </Box>
                    }
                </Box>
            </Box> 

            <Modal open={userEditFormOpen} onClose={closeEditProfileForm}>
                <Box className="Profile-edit" >
                    <ProfileEditForm 
                        close={true} 
                        closeModal={closeEditProfileForm}
                        initialValues={{
                            username: user.username,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            img: user.img,
                            email: user.email,
                        }}
                        updateUser={setUser}
                        />
                </Box>
            </Modal>

            {error || deleteError || followUser ? <Alert type="danger" messages={[error || deleteError || followUser]} />: null}

            <AppBar position="static" color="transparent" className="appBarWithShadow">
                <Tabs value={value} onChange={(event, newValue) => setValue(newValue)} >
                    <Tab label={`${userReviews.length} User Reviews`} className={value === 0 ? "selectedTab" : ""} />
                    <Tab label={`${userLikedReviews.length} Liked Reviews`} className={value === 1 ? "selectedTab" : ""} />
                    <Tab label={`${userLikedBooks.length} Liked Books`} className={value === 2 ? "selectedTab" : ""} />
                    <Tab label={`${userFollowers.length} Followers`} className={value === 3 ? "selectedTab" : ""} />
                    <Tab label={`${userFollowings.length} Following`} className={value === 4 ? "selectedTab" : ""} />
                </Tabs>
            </AppBar>

            {value === 0 && (
                <div className="Profile-UserReviews-List">
                    {userReviews.map(({ reviewId, review, date, book_id, title, cover, author, category, reviewLikeCount }) => (
                      <ReviewDisplay 
                          key={reviewId}
                          reviewId={+reviewId}
                          review={review}
                          date={date}
                          username={user.username}
                          userImg={user.img}
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
            )}
            {value === 1 && (
                <div className="Profile-LikedReviews-List">
                    {userLikedReviews.map(({ reviewId, review, date, username, userImg, book_id, title, cover, author, category, reviewLikeCount }) => (
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
                          likedReview={currUserProfile}
                          setReviews={setUserLikedReviews}
                      />
                    ))}                
                </div>
            )}
            {value === 2 && (
                <div className="Profile-LikeBooks-List">
                    {userLikedBooks.map(({ book_id, title, author, description, publisher, category, cover, bookLikeCount, reviews }) => (
                      <BookCard 
                          key={book_id}
                          id={book_id}
                          title={title}
                          author={author}
                          description={description}
                          publisher={publisher}
                          category={category}
                          cover={cover}
                          bookLikeCount={+bookLikeCount}
                          likedBook={true}
                          currUser={currUserProfile}
                          setBooks={setUserLikedBooks}
                      />
                  ))}
                </div>
            )}

            {value === 3 && (
                <div className="Profile-Followers-List">
                    {userFollowers.map((follower) => (
                        <ProfileCard
                            key={follower.followedBy}
                            username={follower.followedBy}
                            userImg={follower.userImg}
                            setUserFollow={setUserFollowings}
                            currUserProfile={currUserProfile}
                        />
                    ))}
                </div>
            )}

            {value === 4 && (
                <div className="Profile-Following-List">
                    {userFollowings.map((following) => (
                        <ProfileCard
                            key={following.following}
                            username={following.following}
                            userImg={following.userImg}
                            setUserFollow={setUserFollowings}
                            currUserProfile={currUserProfile}
                        />
                    ))}
                </div>
            )}

        </div>
    )
}

export default Profile;