
import React, { useContext, useState, useEffect } from "react";
import UserContext from '../auth/UserContext';
import Messages from "./Message";
import { ListItem, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import useWebSocket, { ReadyState } from "react-use-websocket";

const Chat = ({ isOpen, receiver }) => {
    
    const { currentUser } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [formData, setFormData] = useState({ text: '', name: currentUser  });

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:3005/chat/${receiver}`);

        // Connection opened
        console.log(socket)
        socket.addEventListener("open", (event) => {
          socket.send("Connection established")
        })
    }, [])

    // const ws = new WebSocket(`ws://localhost:3001/chat/${receiver}`);
    // console.log(ws, ":::::::::::::::");

    // useEffect(function setWebsocketConnection() {
    //     if (isOpen) {
    //         /** called when connection opens, sends join info to server. */
    //         ws.onopen = function (evt) {
                
    //             let data = { type: "join", name: "name" };
    //             ws.send(JSON.stringify(data));
    //             console.log("open", evt, ws,  WebSocket.prototype);
    //         };

    //         /** Event handler for when a message is received*/
    //         ws.onmessage = (evt) => {
    //             const receivedMessage = JSON.parse(evt.data);
    //             console.log("received", receivedMessage);
                
    //             // Update the messages state with the new message
    //             setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    //         };

    //         // Cleanup function to close the WebSocket when the component is unmounted
    //         return () => {
    //             console.log("closing WebSocket");
    //             ws.close();
    //         };
    //     }
    // }, [isOpen, receiver]);

    // Send review and book data to database
    const handleAddChat = async e => {
        e.preventDefault();
        // // Check if the WebSocket is open before sending a message
        // if (ws.readyState === WebSocket.OPEN) {
        //     ws.send(JSON.stringify(formData));
        // } else {
        //     console.error("WebSocket is not in the OPEN state.");
        // }
    };

    // handles chat input change
    const handleChangeChat = (e) => {
        setFormData((data) => ({
            ...data,
            text: e.target.value || undefined,
        }));
    };

    return (
        <div style={{  minHeight: '98vh' }}>
            {messages.map(({ type, text, name }, index) => (
                type === "chat" ? <Messages ext={text} username={name} key={index} /> : null
            ))}
            <div style={{ position: 'absolute', bottom: 5, left: 0, right: 0 }}>
                <ListItem disablePadding sx={{ marginBottom: 2, display: "flex", flexDirection: "row" }}>
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
                    >
                        <SendIcon />
                    </IconButton>
                </ListItem>
                <ListItem disablePadding>
                </ListItem>
            </div>
        </div>
    )
    
};

export default Chat;