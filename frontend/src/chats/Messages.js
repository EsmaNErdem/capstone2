import { List, Paper, Typography } from "@mui/material";
import "./Messages.css"

/**
 * Messages Component
 * 
 * - Displays chat message with senders name using Material UI 
 * 
 * - Chat ==> Messages
 */
const Messages = ({ text, username, date=null }) => {
    
    /** Format message timestamp */ 
    const formatMessageDate = (messageDate) => {
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        return new Date(messageDate).toLocaleString('en-US', options);
    };

    return (
        <Paper className="Messages" style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
            <List>
                <Typography variant="body1" className="Messages-sender">
                    {username}:
                </Typography>
                <Typography variant="body2">{text}</Typography>
            </List>
            {date && <Typography variant="body2">{`${formatMessageDate(date)}`}</Typography>}

        </Paper>
    );
}

export default Messages