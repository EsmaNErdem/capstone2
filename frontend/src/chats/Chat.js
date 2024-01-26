import React, { useContext, useState, useEffect, useRef } from "react";
import UserContext from '../auth/UserContext';
import Messages from "./Message";
import { ListItem, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import "./Chat.css"

const Chat = ({ isOpen, receiver }) => {
    const { currentUser } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [formData, setFormData] = useState({ type:'chat', text: '', name: currentUser.username });
    const wsRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            // Initialize WebSocket only if it hasn't been initialized yet
            if (!wsRef.current) {
                const roomName = `${receiver},${currentUser.username}`
                wsRef.current = new WebSocket(`ws://localhost:3001/chat/${roomName}`);

                wsRef.current.onopen = function (evt) {
                    let data = { type: "join", name: currentUser.username};

                    wsRef.current.send(JSON.stringify(data));
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
                wsRef.current && wsRef.current.close();
                wsRef.current = null
            };
        }
    }, [isOpen, receiver]);

    const handleAddChat = async (e) => {
        e.preventDefault();

        // Check if the WebSocket is open before sending a message
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(formData));
            setFormData((data) => ({
                ...data,
                text: "",
            }));
        } else {
            console.error("WebSocket is not open or undefined.");
        }
    };

    const handleChangeChat = (e) => {
        setFormData((data) => ({
            ...data,
            text: e.target.value || undefined,
        }));
    };

    return (
        <div className="ChatContainer">
            <div className="MessagesContainer">
                {messages.map(({ type, text, name }, index) => (
                    type === "chat" ? <Messages text={text} username={name} key={index} /> : null
                ))}
            </div>
            <div className="ChatInputContainer">
                <ListItem disablePadding className="ChatInput">
                    <TextField
                        rows={2}
                        variant="outlined"
                        fullWidth
                        sx={{ width: '90%', marginLeft: '1rem'}}
                        value={formData.text}
                        onChange={(e) => handleChangeChat(e)}
                    />
                    <IconButton
                        onClick={handleAddChat}
                        sx={{ marginLeft: '1rem', color: "orangered" }}
                        data-testid="chat-send-button"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Prevent the default behavior of Enter key (e.g., new line)
                                handleAddChat(e);
                            }
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </ListItem>
                <ListItem disablePadding>
                </ListItem>
            </div>
        </div>
    )

    return (
        <div className="Chat">
          {messages.map(({ type, text, name }, index) => (
            type === 'chat' ? <Messages ext={text} username={name} key={index} /> : null
          ))}
          <div className="Chat-Container">
            <ListItem disablePadding className="Chat-Input">
              <TextField
                rows={2}
                variant="outlined"
                fullWidth
                sx={{ width: '100%' }}
                value={formData.text}
                onChange={(e) => handleChangeChat(e)}
              />
              <IconButton
                onClick={handleAddChat}
                sx={{ marginLeft: '1rem', color: 'orangered' }}
                data-testid="chat-send-button"
              >
                <SendIcon />
              </IconButton>
            </ListItem>
            <ListItem disablePadding></ListItem>
          </div>
        </div>
    );
    
};

export default Chat;