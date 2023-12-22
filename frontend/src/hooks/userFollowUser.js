import { useState, useEffect, useContext } from 'react';
import UserContext from '../auth/UserContext';

/** Custom Hook for managing user follow
 * This hook provides functionality to manage user follow on user profile page, retrieves initial follow status,
 * updating the follow status and user followers list, and handling user follow data to database
 * 
 * -Utilizes useContext data to send user like to database
 * -Creates state to update user follow status
 * -Use useEffect to avoid to recalculations
 * 
 * Returns user follow status, related error nand handleFollowUser function
 */
const useFollowUser = (userToBeFollowed, setUserFollowers) => {
    console.debug("useFollowUser"); 
    const { hasFollowing, followUser } = useContext(UserContext);
    
    const [followed, setFollowed] = useState()
    const [error, setError] = useState(null);
    
    /**By using the useEffect, the followed status is only recalculated when username changes  */
    useEffect(() => {
        console.debug("Follow user useEffect, userToBeFollowed=", userToBeFollowed)

        setFollowed(hasFollowing(userToBeFollowed))
    }, [userToBeFollowed])
    

    /** 
     * Sends user follow and unfollow data to database
     * Update users followers list
    */
    const handleFollowUser = async () =>{
        try {
            setError(null);
            if (followed) {
                const unfollowedUsername = await followUser(userToBeFollowed);
                setUserFollowers(followers => followers.filter(follower => follower.followedBy !== unfollowedUsername));
                setFollowed(false) 
            } else {
                const followingUser = await followUser(userToBeFollowed);
                setUserFollowers(followers => [...followers, followingUser])
                setFollowed(true) 
            }
        } catch (error) {
            setError("Error following user.")
            console.error("Error handling user follow:", error);
        }
    }
    
    return { followed, error, handleFollowUser }
}

export default useFollowUser;