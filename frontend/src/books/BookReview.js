import React, { useContext, useState } from 'react';
import UserContext from "../auth/UserContext";
import Alert from "../utilities/Alert"
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';

const BookReview = ({ reviewId, review, username, userImg, date, reviewLikeCount }) => {
    console.debug("BookReview");
  
    const { hasLikedBook, likeBook, addUserReview } = useContext(UserContext);

    const [liked, setLiked] = useState();
    const [likes, setLikes] = useState(reviewLikeCount);
    const [error, setError] = useState(null);

    // Send user like API. If fails, shows error to user
    const handleLikeReview = async () =>{
        // try {
        //     setError(null);
        //     if (liked) {
        //       const unlikedBookId = await likeBook(id);
        //       if (unlikedBookId ) {
        //         setLikes((likes) => likes - 1);
        //         setLiked(false);
        //       }
        //     } else {
              
        //       if (likedBookId ) {
        //         setLikes((likes) => likes + 1);
        //         setLiked(true);
        //       }
        //     }
        //   } catch (error) {
        //     setError("Error liking book.")
        //     console.error("Error handling book like:", error);
        //   }
    }
    return (
            <React.Fragment>
                <ListItem  disablePadding>
                    <Avatar alt={username} src={userImg} sx={{ width: 32, height: 32, marginRight: 2 }} />
                    <ListItemText 
                        primary={review} 
                        secondary={`${username} • ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}`}
                    />
                    <IconButton onClick={handleLikeReview} color={liked ? 'error' : 'default'}>
                        <FavoriteIcon />
                    </IconButton>
                    <span>{likes}</span>
                </ListItem>
                <Divider />
            </React.Fragment>            
        )
}

export default BookReview;