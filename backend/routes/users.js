"use strict";

/** Routes for users. */

const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth")

const jsonschema = require("jsonschema");
const userRegisterSchema = require("../schemas/userRegister.json")
const userLoginSchema = require("../schemas/userLogin.json")
const userUpdateSchema = require("../schemas/userUpdate.json")
const { BadRequestError } = require("../expressError");

const User = require("../models/user");
const { createToken } = require("../helpers/tokens");

// // creating multer middleware for user profile image upload
// const multer = require('multer');
// const maxFileSize = 500 * 1024; // 500 KB
// // const storage = multer.memoryStorage();

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log("**************", file)
//     cb(null, '../uploads')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)  }
// })
// const upload = multer({
//   storage: storage,
//   // limits: {
//   //   fileSize: maxFileSize,
//   // },
// });
// upload.single('userImg'), 

/**
 * POST /users/register: { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email, img }
 * 
 * JSONSchema validates incoming data to keep database clean and bug free
 * 
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */
router.post("/register", async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, userRegisterSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const newUser = await User.register({ ...req.body });
      const token = createToken(newUser);
      return res.status(201).json({ token });
    } catch (err) {
      return next(err);
    }
});

/**
 * POST /users/login: { user } => { token }
 *
 * user must include { username, password }
 * 
 * JSONSchema validates incoming data to keep database clean and bug free
 * 
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */
router.post("/login", async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, userLoginSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }

      const user = await User.login({ ...req.body });
      const token = createToken(user);
      return res.json({ token });
    } catch (err) {
      return next(err);
    }
});

/** GET /users/[username] => { user }
 *
 * Returns { username, firstName, lastName, email, img, reviews, bookLikes, reviewLikes, receivedLikesCount, followings, followers }
 * 
 * Authorization required: logged-in user
 **/
router.get("/:username", ensureLoggedIn, async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
});

/** PATCH /users/[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email, img }
 *
 * Returns { username, firstName, lastName, email, img }
 *
 * Authorization required: same-user-as-:username
 **/
router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
      console.log("RRRRR", req.params.username)
        const validator = jsonschema.validate(req.body, userUpdateSchema);
        if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
        }

        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

/** POST /users/:following/follow/:username => { following: username, followedBy: username }
 * 
 * Sends user follow data to database
 * Returns username being followed and username who is following
 * 
 * Authorization required: ensureCorrectUser
 */
router.post("/:following/follow/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const follow = await User.followUser(req.params.following, req.params.username);
    return res.status(201).json({ follow });
  } catch (err) {
    console.error("Error in POST /users/:following/follow/:username", err);
    return next(err);
  }
});

/** DELETE /users/:following/follow/:username => { unfollowedBy: username }
 * 
 * Deletes user follow data from database
 * Returns username who is unfollowing
 * 
 * Authorization required: ensureCorrectUser
 */
router.delete("/:following/follow/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const unfollow = await User.unfollowUser(req.params.following, req.params.username);
    return res.json({ unfollow });
  } catch (err) {
    console.error("Error in DELETE /users/:following/follow/:username", err);
    return next(err);
  }
});

module.exports =  router;
  