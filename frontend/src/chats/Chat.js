import React, { useContext, useState, useEffect, useRef } from "react";
import UserContext from '../auth/UserContext';
import { ListItem, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Messages from "./Messages";
import Alert from "../utilities/Alert";
import "./Chat.css";

const url = process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL.split('').splice(4).join('') : null
const BASE_URL = process.env.REACT_APP_BASE_URL ? `ws${url}` : "ws://localhost:3001";

/**
 * Chat Component
 * 
 * Displays a Material UI pop-up drawer for chat between current user and user on profile view.
 * 
 * - Makes WebSocket client connection to server
 * - Displays controlled-input text area for chat text input and on submit send formData to server side
 * - Handles incoming messages and lists messages between users
 * 
 * - ChatDrawer ==> Chat ==> Messages
 */
const Chat = ({ isOpen, receiver, prevMessages=[], setWebsocket }) => {
    const { currentUser } = useContext(UserContext);
    const wsRef = useRef(null);
    const messagesRef = useRef(null);
    const [formData, setFormData] = useState({ type:'chat', text: '', name: currentUser.username });
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const roomName = `${receiver},${currentUser.username}`

    /**
     * Fetches set messages previous messages when it is fetched from backend in parent component
     */ 
    useEffect(function getPreviousMessages() {
        console.debug("Chat useEffect getPreviousMessages");
        
        setMessages(prevMessages)
        scrollToBottom();
    }, [prevMessages]);

    /**
     * Initializes WebSocket sever connection on mount and user change
     * Handles incoming messages
     */
    useEffect(function getWebSocketConnected(){
        console.debug("Chat useEffect getWebSocketConnected");

        if (isOpen) {
            // Initialize WebSocket only if it hasn't been initialized yet
            if (!wsRef.current) {
                wsRef.current = new WebSocket(`${BASE_URL}/chat/${roomName}`);
                
                wsRef.current.onopen = function (evt) {
                    let data = { type: "join", name: currentUser.username, receiver};
                    
                    wsRef.current.send(JSON.stringify(data));
                    setWebsocket(true)
                    console.log("open", evt, wsRef.current);
                };

                wsRef.current.onmessage = (evt) => {
                    const receivedMessage = JSON.parse(evt.data);

                    if (receivedMessage.type === "chat") {
                        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                    }
                };
            }

            // Cleanup function to close the WebSocket when the component is unmounted
            return () => {
                console.log("closing WebSocket");
                setMessages([]);
                if(wsRef.current) wsRef.current.close();
                wsRef.current = null
            };
        }
    }, [isOpen, receiver]);

    /**
     * Sends submited text server side WebSocket after makes the connection is open
     */
    const handleAddChat = async (e) => {
        e.preventDefault();

        // Check if the WebSocket is open before sending a message
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(formData));
            scrollToBottom()
            setFormData((data) => ({
                ...data,
                text: "",
            }));
        } else {
            console.error("WebSocket is not open or undefined.");
            setError("Please restart chat")
        }
    };

    const handleChangeChat = (e) => {
        setFormData((data) => ({
            ...data,
            text: e.target.value || "",
        }));
    };

    const scrollToBottom = () => {
        // Using `scrollIntoView` to scroll to the bottom
        if (messagesRef.current) {
            // Using `scrollIntoView` to scroll to the bottom
            // messagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }
      };
    

    return (
        <div className="Chat">
            {error ? <Alert type="danger" messages={[error]} />: null}

            <div className="Chat-Messages" ref={messagesRef}>
                {messages.map(({ text, name, date }, index) => (
                    <Messages text={text} username={name} date={date} key={index} />
                ))}
            </div>

            <div className="Chat-ChatInput">
                <ListItem disablePadding className="ChatInput">
                    <TextField
                        rows={2}
                        variant="outlined"
                        fullWidth
                        sx={{ width: '90%', marginLeft: '1rem'}}
                        value={formData.text}
                        onChange={(e) => handleChangeChat(e)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Prevent the default behavior of Enter key (e.g., new line)
                                handleAddChat(e);
                            }
                        }}
                    />
                    <IconButton
                        onClick={handleAddChat}
                        sx={{ marginLeft: '1rem', color: "orangered" }}
                        data-testid="chat-send-button"
                        
                    >
                        <SendIcon />
                    </IconButton>
                </ListItem>
                <ListItem disablePadding>
                </ListItem>
            </div>
        </div>
    );
};

export default Chat;