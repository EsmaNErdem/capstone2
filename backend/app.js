"use strict";

/** Express app for Book Club Backend */

const express = require("express");
// allow connections to all routes from any browser
const cors = require("cors");

const { NotFoundError } = require("./expressError");
/** IMPORT MIDDLEWARE AND ROUTES */

// morgan middleware for understanding how your Express application is behaving, diagnosing issues, ensuring security, and optimizing performance.
const morgan = require("morgan");

const app = express();

app.use(cors());
// to parse request bodies for either form data or JSON
app.use(express.json());
app.use(morgan("tiny"));
/** MIDDLEWARE */

/** ROUTES */

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