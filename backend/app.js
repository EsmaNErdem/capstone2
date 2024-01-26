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
const chatRoutes = require("./routes/chats");

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


// /** WEBSOCKETS-CHAT */
// // allow for app.ws routes for websocket routes
const wsExpress = require('express-ws')(app);
const Chat = require("./models/chats/chat");
const ChatUser = require("./models/chats/chatUser");

app.ws('/chat/:roomName', function(ws, req, next) {
  try {
    const user = new ChatUser(
        ws.send.bind(ws), // fn to call to message this user
        req.params.roomName // name of room for user
      );
      // register handlers for message-received, connection-closed
      
      ws.on('message', function(data) {
          try {
            user.handleMessage(data);
          } catch (err) {
        console.error(err);
      }
    });

    ws.on('close', function() {
      try {
          user.handleClose();
      } catch (err) {
          console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
});

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

module.exports = app;