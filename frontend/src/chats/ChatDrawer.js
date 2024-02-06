import React, { useRef, useState, useContext } from "react";
import UserContext from '../auth/UserContext';
import { Box, SwipeableDrawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Chat from "./Chat";
import Alert from "../utilities/Alert";
import usePreviousMessages from "../hooks/usePreviousMessages";

/**
 * ChatDrawer Component
 * 
 * Displays a Material UI pop-up drawer for chat between current user and user on profile view.
 * 
 * - Displays input text area for chat text input
 * - Lists previous messages between users
 * - uses custom hook that makes API call to load previous messages on component mount
 * 
 * - Profile ==> ChatDrawer ==> Chat
 */
const ChatDrawer = ({ isOpen, onClose, receiver }) => {
    console.debug("ChatDrawer");

    const drawerRef = useRef();
    const { currentUser } = useContext(UserContext);
    const [websocket, setWebsocket] = useState(false)
    const { error, messages } = usePreviousMessages(receiver, currentUser.username, websocket, isOpen);

    return (
        <SwipeableDrawer
            ref={drawerRef} 
            anchor="right"
            open={isOpen}
            onClose={onClose}
            onOpen={() => {}}
        >
            <Box
                sx={{
                    width: '30rem',
                    padding: '10px', 
                    height: '100vh',
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: "center"
                }}
                role="presentation"
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        onClose();
                    }
                }}
                data-testid="box"
            >
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: 15, right: '27rem' }}>
                    <CloseIcon />
                </IconButton>
                {error ? <Alert type="danger" messages={[error]} />: null}
                <Chat 
                    isOpen={isOpen} 
                    receiver={receiver}
                    prevMessages={messages}
                    setWebsocket={setWebsocket}
                />

            </Box>
        </SwipeableDrawer>
    );
}

export default ChatDrawer;