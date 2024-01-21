
import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Chat = () => {
    useEffect(function setWebsocketConnection() {
        
        const ws = new WebSocket(`ws://localhost:3001/chat/heyo`);
        /** called when connection opens, sends join info to server. */
        ws.onopen = function(evt) {
            console.log("open", evt);
        
            let data = {type: "join", name: "name"};
            ws.send(JSON.stringify(data));
        };
  
    }, [])
};

export default Chat;