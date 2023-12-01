"use strict";
process.env.NODE_ENV = "test";
const db = require("../db.js");
const User = require("../models/user");
const Book = require("../models/book.js")
const { createToken } = require("../helpers/tokens");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM books");  
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM book_likes");

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

  await Book.likeBook(
    {
      id: '1',
      title: 'Book1',
      author: 'Author1',
      publisher: 'Publisher1',
      description: 'Description1',
      cover: 'Cover1',
    }, "u1");

  await Book.likeBook(
    {
      id: '2',
      title: 'Book2',
      author: 'Author2',
      publisher: 'Publisher2',
      description: 'Description2',
      cover: 'Cover2',
    }, "u1");

    // await db.query( `INSERT INTO books 
    // (id, title, author, publisher, description, category, cover)
    // VALUES ('1', 'Book1', 'Author1', 'Publisher1', 'Description1', 'Category1', 'Cover1'),
    //        ('2', 'Book2', 'Author2', 'Publisher2', 'Description2', 'Category2', 'Cover2')`)
    let heyo = await db.query("SELECT * FROM books", );

    console.log("**********************")
    console.log(heyo.rows[0])
    console.log(await Book.likeBook(
      {
        id: '2',
        title: 'Book2',
        author: 'Author2',
        publisher: 'Publisher2',
        description: 'Description2',
        cover: 'Cover2',
      }, "u1"))
    console.log("**********************")

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
