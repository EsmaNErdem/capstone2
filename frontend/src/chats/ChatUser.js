import React, { useState, useEffect, useContext } from "react";
import UserContext from '../auth/UserContext';
import Chat from "./Chat";
import Alert from "../utilities/Alert";
import BookClubApi from "../api";
import { ListItem, ListItemText, Avatar, Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";

const ChatUser = ({ receiver, receiverImg }) => {
    console.debug("ChatUser");

    const { currentUser } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [websocket, setWebsocket] = useState(false)
    const [error, setError] = useState(null);

     /**
     * Fetches the previous messages between users from backend sends to child component after WebSocket connection is established
     */ 
     useEffect(function getPreviousMessages() {
        console.debug("ChatUser useEffect getPreviousMessages");

        const getMessages = async () => {
            try{
                if (websocket) {
                    const roomName = `${receiver},${currentUser.username}`
                    const previousMessages = await BookClubApi.getRoomPreviousMessages(roomName);
                    setMessages([...previousMessages]);                 
                }
            } catch (e) {
                console.error("ChatUser-previous messages useEffect API call data loading error:", e);
                setError("An error occurred while fetching previous messages.");
            }
        }
        getMessages();
    }, [receiver, websocket]);

    return (
        <div className="ChatUser" style={{ width: '100%', height: '100%', display:"flex", flexDirection:"column", justifyContent:"space-between", paddingLeft: 5 }}>
            {error ? <Alert type="danger" messages={[error]} />: null}
            <Link to={`/profile/${receiver}`} style={{ textDecoration: 'none', color: 'redorange' }}>
                <ListItem>
                    <Avatar alt={receiver} src={receiverImg} sx={{ width: 50, height: 50, marginRight: 2 }} />  
                    <ListItemText
                        disableTypography
                        primary={<Typography variant="body2" style={{ color: 'orangered', fontSize: '1.3rem' }}>{receiver}</Typography>}
                    />
                </ListItem>
            </Link>
            
            <Divider />

            <Chat 
                isOpen={true} 
                receiver={receiver}
                prevMessages={messages}
                setWebsocket={setWebsocket}
            />
        </div>
    )


}

export default ChatUser;