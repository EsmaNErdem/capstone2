import { useState, useEffect } from "react";
import BookClubApi from "../api";

/** Custom Hook for fetching previous messages between receiver and current user
 * This hook makes API call to backend to retrieve related data and set messaegs state
 * 
 * Returns error and messages
 */
const usePreviousMessages = (receiver, currentUserName, websocket, isOpen) => {
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState([]);

    /**
     * Fetches the previous messages between users from backend sends to child component after WebSocket connection is established
     */ 
    useEffect(function getPreviousMessages() {
        console.debug("usePreviousMessages hook useEffect getPreviousMessages");
    
        const getMessages = async () => {
            try{
                if (isOpen && websocket) {
                    const roomName = `${receiver},${currentUserName}`
                    const previousMessages = await BookClubApi.getRoomPreviousMessages(roomName);
                    setMessages([...previousMessages]);                 
                }
            } catch (e) {
                console.error("usePreviousMessages useEffect API call data loading error:", e);
                setError("An error occurred while fetching previous messages.");
            }
        }
        getMessages();
    }, [isOpen, receiver, websocket]);

    return { error, messages }
}

export default usePreviousMessages;