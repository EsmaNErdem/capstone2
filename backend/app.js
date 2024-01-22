"use strict";

/** Express app for Book Club Backend */

const express = require("express");
// allow connections to all routes from any browser
const cors = require("cors");

const { NotFoundError } = require("./expressError");

/** IMPORT MIDDLEWARE AND ROUTES */
const { authenticateJWT } = require("./middleware/auth");
const usersRoutes = require("./routes/users");
const booksRoutes =  require("./routes/books");
const reviewRoutes = require("./routes/reviews");
// const chatRoutes = require("./routes/chats");

// morgan middleware for understanding how your Express application is behaving, diagnosing issues, ensuring security, and optimizing performance.
const morgan = require("morgan");

const app = express();

app.use(cors());
// to parse request bodies for either form data or JSON
app.use(express.json());
app.use(morgan("tiny"));
// user token check middleware
app.use(authenticateJWT);

/** ROUTES */
app.use("/users", usersRoutes);
app.use("/books", booksRoutes);
app.use("/reviews", reviewRoutes);
// app.use("/chats", chatRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});
  
/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
});

/** WEBSOCKET CHAT */

// allow for app.ws routes for websocket routes
const wsExpress = require('express-ws')(app);
const Chat = require("./models/chats/chat");
const ChatUser = require("./models/chats/chatUser");
const { SendMessageError } = require("./expressError");

/** Handle a persistent connection to /chat/[roomName]
*
* Note that this is only called *once* per chat and within that chat, per client --- not every time
* a particular websocket chat is sent.
*
* `ws` becomes the socket for the client; it is specific to that visitor.
* The `ws.send` method is how we'll send messages back to that socket.
*/
app.ws('/chat/:roomName', function(ws, req, next) {
  console.log(req.params.roomName, "inside app.ws when open")
  try {
    const user = new ChatUser(
      ws.send.bind(ws), // fn to call to message this user
      req.params.roomName // name of room for user
    );
    // register handlers for message-received, connection-closed
    ws.on('message', function(data) {
      try {
        console.log("server side on message:", data)
        // user.handleMessage(data);
        // Chat.handleMessage(data, req.params.roomName);
      } catch (err) {
        console.error("Error handling message:", err);
        throw new SendMessageError("Failed to handle the message");
      }
    });
 
    ws.on('close', function() {
      try {
        user.handleClose();
      } catch (err) {
         console.error("Error handling chat close:", err);
         throw new Error("Failed to handle chat close");
      }
    });
  } catch (err) {
     console.error("Error handling chat:", err);
     throw new Error("Failed to handle chat");
  }
 });
 
module.exports = app;






// /** app for groupchat */

// const express = require('express');
// const app = express();

// // serve stuff in static/ folder

// app.use(express.static('static/'));

// /** Handle websocket chat */

// // allow for app.ws routes for websocket routes
// const wsExpress = require('express-ws')(app);

// const ChatUser = require("./models/chats/chatUser");

// /** Handle a persistent connection to /chat/[roomName]
//  *
//  * Note that this is only called *once* per client --- not every time
//  * a particular websocket chat is sent.
//  * `ws` becomes the socket for the client; it is specific to that visitor.
//  * The `ws.send` method is how we'll send messages back to that socket.
//  */

// app.ws('/chat/:roomName', function(ws, req, next) {
//   try {
//         console.log(req.params.roomName, "DDDDDDDDDDd")
//     const user = new ChatUser(
//       ws.send.bind(ws), // fn to call to message this user
//       req.params.roomName // name of room for user
//       );
      
//       // register handlers for message-received, connection-closed
      
//       ws.on('message', function(data) {
//         try {
//         console.log(data, "hhhhhhhhh")
//         user.handleMessage(data);
//       } catch (err) {
//         console.error(err);
//       }
//     });

//     ws.on('close', function() {
//       try {
//         user.handleClose();
//       } catch (err) {
//         console.error(err);
//       }
//     });
//   } catch (err) {
//     console.error(err);
//   }
// });

// /** serve homepage --- just static HTML
//  *
//  * Allow any roomName to come after homepage --- client JS will find the
//  * roomname in the URL.
//  *
//  * */

// app.get('/:roomName', function(req, res, next) {
//   res.sendFile(`${__dirname}/chat.html`);
// });

// module.exports = app;
