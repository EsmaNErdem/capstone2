import React, { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import UserContext from '../auth/UserContext';
import { Avatar, IconButton } from '@mui/material';
import "./ProfileCard.css"

/**
 * Display user profile information with follow/unfollow button
 * 
 * - Used in the user's followers and following lists in the Profile component
 */
const ProfileCard = ({ username, userImg, setUserFollowings, setUserFollowers }) => {
    console.debug("ProfileCard");

    const { hasFollowing, currentUser } = useContext(UserContext);
    const currUser = currentUser.username === username;

    const [isFollowed, setIsFollowed] = useState()

    console.log(currUser, "::::::")
    /**By using the useEffect, the liked status is only recalculated when the id or the   */
    useEffect(() => {
        console.debug("ProfileCard useEffect",)
        setIsFollowed(hasFollowing(username))
    }, [username])

    const handleFollow = () => {
        setIsFollowed(f => !f)
    }
    return (
      <div className={currUser ? "ProfileCard-full" :  "ProfileCard"}>
        <div className="profile-info">
            <Link to={`/profile/${username}`} className="profile-link">
                <Avatar alt={username} src={userImg} sx={{ width: 50, height: 50, marginRight: 2, marginTop: 2 }} />
            </Link>
            <Link to={`/profile/${username}`} className="profile-link">
                <span className="profile-username">{username}</span>
            </Link>
        </div>
        {!currUser &&
        <IconButton onClick={handleFollow} color={isFollowed ? 'error' : 'default'} className="profile-follow-button">
            {isFollowed ? "Unfollow" : "+ Follow"}
        </IconButton>}
      </div>
    );
  };
  
  export default ProfileCard;