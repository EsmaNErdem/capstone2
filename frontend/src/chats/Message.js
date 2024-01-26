import { Paper, Typography } from "@mui/material";
import "./Messages.css"

/**
 * Messages Component
 * 
 * - Displays chat message with senders name using Material UI 
 * 
 * - Chat ==> Messages
 */
const Messages = ({ text, username }) => {
    return (
        <Paper className="Messages">
            <Typography variant="body1" className="Messages-sender">
                {username}:
            </Typography>
            <Typography variant="body2">{text}</Typography>
        </Paper>
    );
}

export default Messages