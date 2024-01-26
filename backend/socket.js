// /** WEBSOCKET CHAT */

// // allow for app.ws routes for websocket routes
// const express = require('express');
// const expressWs = require('express-ws');

// const app = express();
// const wsInstance = expressWs(app);
// const Chat = require("./models/chats/chat");
// const ChatUser = require("./models/chats/chatUser");
// const { SendMessageError } = require("./expressError");

// /** Handle a persistent connection to /chat/[roomName]
// *
// * Note that this is only called *once* per chat and within that chat, per client --- not every time
// * a particular websocket chat is sent.
// *
// * `ws` becomes the socket for the client; it is specific to that visitor.
// * The `ws.send` method is how we'll send messages back to that socket.
// */
// app.ws('/chat/:roomName', function(ws, req, next) {
//   console.log(req.params.roomName, "inside app.ws when open")
//   try {
//     const user = new ChatUser(
//       ws.send.bind(ws), // fn to call to message this user
//       req.params.roomName // name of room for user
//     );
//     // register handlers for message-received, connection-closed
//     ws.on('message', function(data) {
//       try {
//         console.log("server side on message:", data)
//         // user.handleMessage(data);
//         // Chat.handleMessage(data, req.params.roomName);
//       } catch (err) {
//         console.error("Error handling message:", err);
//         throw new SendMessageError("Failed to handle the message");
//       }
//     });
 
//     ws.on('close', function() {
//       try {
//         user.handleClose();
//       } catch (err) {
//          console.error("Error handling chat close:", err);
//          throw new Error("Failed to handle chat close");
//       }
//     });
//   } catch (err) {
//      console.error("Error handling chat:", err);
//      throw new Error("Failed to handle chat");
//   }
//  });
 
// module.exports = app;




