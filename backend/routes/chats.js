/** Routes for chats */
const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

const Chat = require("../models/chats/chat");

/**
 * Get /chats/:roomName: => { messages: [{ name, type, text }, ...] }
 * 
 * Returns previous messages in given roomName
 * Authorization required: logged-in user
 */
router.get("/:roomName", ensureLoggedIn, async function (req, res, next) {
    try {
        const roomName = req.params.roomName.split(',').sort().join('');
        const messages = await Chat.getAllMessagesForRoom(roomName);
        return res.json({ messages });
    } catch (err) {
         return next(err);
    }
});

/**
 * Get /chats/:username: => { messages: [{ messageId, username, userImg, message, date }, ...] }
 * 
 * Returns the last message with sender's detail for each room that currentUser opened in order of last open 
 * Authorization required: same-user-as-:username
 */
router.get("/rooms/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        const messages = await Chat.findUserMessages(req.params.username);
        return res.json({ messages });
    } catch (err) {
         return next(err);
    }
});

module.exports =  router;