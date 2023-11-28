"use strict";
process.env.NODE_ENV = "test";
const db = require("../db.js");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await User.register(
      {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        password: "password1",
        img: "img1"
      });
  await User.register(
      {
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "user2@user.com",
        password: "password2",
        img: "img2"
      });
  await User.register(
      {
        username: "u3",
        firstName: "U3F",
        lastName: "U3L",
        email: "user3@user.com",
        password: "password3",
        img: "img3"
      });

}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({ username: "u1" });
const u2Token = createToken({ username: "u2" });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
};
