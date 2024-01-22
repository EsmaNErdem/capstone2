
import React, { useRef } from "react";
import { Box, SwipeableDrawer,IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Chat from "./Chat";

const ChatDrawer = ({ isOpen, onClose, receiver }) => {
    console.debug("ChatDrawer");

    const drawerRef = useRef();

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

                <Chat isOpen={isOpen} receiver={receiver} />
                
            </Box>
        </SwipeableDrawer>
    );
}

export default ChatDrawer;