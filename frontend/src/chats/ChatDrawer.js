
import React, { useRef, useEffect } from "react";
import { Box, SwipeableDrawer,IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Chat from "./Chat";
import BookClubApi from "../api";

/**
 * ChatDrawer Component
 * 
 * Displays a Material UI pop-up drawer for chat between current user and user on profile view.
 * 
 * - Displays input text area for chat text input
 * - Lists previous messages between users
 * - Makes API call to load previous messages on component mount
 * 
 * - Profile ==> ChatDrawer ==> Chat
 */
const ChatDrawer = ({ isOpen, onClose, receiver }) => {
    console.debug("ChatDrawer");

    const drawerRef = useRef();

    /**
     * Fetches the previous messages between users from backend
     */ 
    useEffect(() => {
        if (isOpen) {

        }
    }, [isOpen, receiver]);

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
                    maxHeight: '100vh',
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
            >
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: 15, right: '27rem' }}>
                    <CloseIcon />
                </IconButton>

                <Chat isOpen={isOpen} receiver={receiver}/>
                
            </Box>
        </SwipeableDrawer>
    );
}

export default ChatDrawer;