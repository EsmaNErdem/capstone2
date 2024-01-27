import React, { useContext, useState, useEffect } from "react";
import UserContext from '../auth/UserContext';
import BookClubApi from "../api";
import Loading from "../utilities/Loading";
import Alert from "../utilities/Alert";
import ChatUser from "./ChatUser";
import { List, ListItem, ListItemText, Paper, Avatar } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * Displays current user's previously open chat rooms
 * 
 * - Makes API call loads chat room data when the component mounts
 * - This component is designed for the "/chats" route.
 * - Utilizes Chat and Messages components and called by Routes
 * - Displays input text area for chat text input
 * - Lists previous messages between users
 * 
 * - Routes ==> ChatList ==> Chat ==> Messages
 */
const ChatList = () => {
    console.debug("ChatList");

    const { currentUser } = useContext(UserContext);
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState(null);
    const [receiver, setReceiver] = useState(null);
    const [loading, setLoading] = useState(true);
    
    /**
     * Fetches current user's chat rooms from backend
     */ 
    useEffect(() => {
        console.debug("Chatlist useEffect getUserChatRooms");
        
        // Make an API call to get chats room that were used by current user in chronological order
        const getRooms = async () => {
            setError(null);
            try {
                const userChatRooms = await BookClubApi.getUserPreviousMessages(currentUser.username);
                setRooms([userChatRooms[0]]);
                console.log(userChatRooms)
                if (userChatRooms.lenght !== 0) setReceiver(userChatRooms[0].user)
            } catch (e) {
                console.error("ChatList useEffect API call data loading error:", e);
                setError("An error occurred while fetching chat rooms.");
            }
            
            setLoading(false)
        }

        // set loading to true while async getRooms runs; once the
        // data is fetched (or even if an error happens!), this will be set back
        // to true to control the spinner.
        setLoading(true)
        getRooms();
    }, []);

    /** Format message timestamp */ 
    const formatMessageDate = (messageDate) => {
        const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return new Date(messageDate).toLocaleString('en-US', options);
    };

    /* Handles click on room and start chat */
    const handleRoomClick = (username) => {
        setReceiver(username);
    };

    if (loading) return <Loading />;

    return (
        <div className="ChatList">
            {error ? <Alert type="danger" messages={[error]} />: null}
            
            <Paper elevation={3} style={{ display: 'flex', maxWidth: '80%', height:'85vh', margin: 'auto' }}>
                <List style={{ flex: 2 }}>
                    {rooms.map((roomDetails) => (
                            <ListItem
                                key={roomDetails.room.id}
                                selected={receiver && receiver.username === roomDetails.user.username}
                                onClick={() => handleRoomClick(roomDetails.user)}
                            >
                                <Avatar alt={roomDetails.user.username} src={roomDetails.user.userImg} sx={{ width: 32, height: 32, marginRight: 2 }} />
                                <ListItemText 
                                    primary={roomDetails.user.username} 
                                    secondary={
                                        <React.Fragment>
                                            <div>{roomDetails.message.username === currentUser.username ? "You" : roomDetails.message.username}:</div>
                                            <div>{`${roomDetails.message.message} • ${formatMessageDate(roomDetails.message.messageDate)}`}</div>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                        // </Link>    
                    ))}
                </List>
                <List style={{ flex: 3 }}>
                    {receiver && 
                        <ChatUser 
                            receiver={receiver.username} 
                            receiverImg={receiver.userImg}
                        />
                    }
                </List>

            </Paper>
        </div>
    );
    
}

export default ChatList;
