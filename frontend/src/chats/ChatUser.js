import React, { useState, useContext } from "react";
import UserContext from '../auth/UserContext';
import { ListItem, ListItemText, Avatar, Typography, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import Chat from "./Chat";
import Alert from "../utilities/Alert";
import usePreviousMessages from "../hooks/usePreviousMessages";

/**
 * ChatUser Component
 * 
 * Displays chat between current user and selected chat room receiver.
 * 
 * - Displays receiver image and usernane that linked to user's profile
 * - Displays input text area for chat text input
 * - Lists previous messages between users
 * - uses custom hook that makes API call to load previous messages on component mount
 * 
 * - ChatList ==> ChatUser ==> Chat
 */
const ChatUser = ({ receiver, receiverImg }) => {
    console.debug("ChatUser");

    const { currentUser } = useContext(UserContext);
    const [websocket, setWebsocket] = useState(false)
    const { error, messages } = usePreviousMessages(receiver, currentUser.username, websocket, true);

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