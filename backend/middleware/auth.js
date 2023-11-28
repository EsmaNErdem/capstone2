"use strict";

/** Middleware for authorization in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username field.)
 * 
 * For authorization include your token in headers
 * authorization: User Token your-token-here
 * It's not an error if no token was provided or if the token is not valid.
 * still return next() without a parameter because this functions is a middleware
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    console.log(req.headers)
    if (authHeader) {
      const token = authHeader.replace(/^[Uu]ser [Tt]oken /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    // this next() doesn't have err parameter because we don't want to raise error when there is a fail in jwt verification with a bad token just like the test case. 
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
    try {
      if (!res.locals.user) throw new UnauthorizedError();
      return next();
    } catch (err) {
      return next(err);
    }
}
  
/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

function ensureCorrectUser(req, res, next) {
    try {
      const user = res.locals.user;
      if (!(user && user.username === req.params.username)) {
        throw new UnauthorizedError();
      }
      return next();
    } catch (err) {
      return next(err);
    }
  }
  

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureCorrectUser
};