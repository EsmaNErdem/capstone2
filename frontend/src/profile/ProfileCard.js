import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import Alert from "../utilities/Alert";
import UserContext from '../auth/UserContext';
import useFollowUser from "../hooks/userFollowUser";
import { Avatar, IconButton } from '@mui/material';
import "./ProfileCard.css"

/**
 * Display user profile information with follow/unfollow button
 * 
 * - Used in the user's followers and following lists in the Profile component
 */
const ProfileCard = ({ username, userImg, setUserFollow, currUserProfile }) => {
    console.debug("ProfileCard");

    const { currentUser } = useContext(UserContext);
    const { followed, error: followUser, handleFollowUser } = useFollowUser(username, setUserFollow, currUserProfile, true, userImg)

    // Check if profile card if current user's 
    const profileCardOwner = currentUser.username === username;

    return (
      <div className={profileCardOwner ? "ProfileCard-full" :  "ProfileCard"}>
        {followUser ? <Alert type="danger" messages={[followUser]} />: null}
        <div className="profile-info">
            <Link to={`/profile/${username}`} className="profile-link">
                <Avatar alt={username} src={userImg} sx={{ width: 50, height: 50, marginRight: 2, marginTop: 2 }} />
            </Link>
            <Link to={`/profile/${username}`} className="profile-link">
                <span className="profile-username">{username}</span>
            </Link>
        </div>
        {!profileCardOwner &&
        <IconButton onClick={() => handleFollowUser()} color={followed ? 'error' : 'default'} className="profile-follow-button">
            {followed ? "Unfollow" : "+ Follow"}
        </IconButton>}
      </div>
    );
  };
  
  export default ProfileCard;