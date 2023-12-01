"use strict";

/** Routes for reviews. */

const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth")

const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");

const Review = require("../models/review");



module.exports =  router;