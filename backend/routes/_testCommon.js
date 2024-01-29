"use strict";
process.env.NODE_ENV = "test";
const db = require("../db.js");
const User = require("../models/user");
const Book = require("../models/book.js")
const Review = require("../models/review.js")
const Chat = require("../models/chats/chat.js");
const { Room } = require("../models/chats/room.js");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAllReviews() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM reviews");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM review_likes");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM books");  
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM book_likes");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM followers");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM rooms");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM room_members");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM messages");

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
  
  await User.followUser("u2", "u1");

  await User.followUser("u3", "u1");

  await User.followUser("u1", "u2");

  const book1 = {
    id: '1',
    title: 'Book1',
    author: 'Author1',
    publisher: 'Publisher1',
    description: 'Description1',
    category: 'Category 1',
    cover: 'Cover1',
  };
  
  const book2 = {
    id: '2',
    title: 'Book2',
    author: 'Author2',
    publisher: 'Publisher2',
    description: 'Description2',
    category: 'Category 2',
    cover: 'Cover2',
  }
  
  await Book.likeBook(book1, "u1");
  await Book.likeBook(book2,  "u1");
  
  const review1 = await Review.add("u1", book1, "Review1");
  const review2 = await Review.add("u2", book1, "Review2");
  const review3 = await Review.add("u1", book2, "Review3");
  
  await Review.like(review1.id, "u1");
  await Review.like(review1.id, "u2");
  await Review.like(review2.id, "u1");

  const room1 = await Room.get("chatRoom1");
  const room2 = await Room.get("chatRoom2");

  room1.join({name: 'u1', receiver: 'u2'})

  await Chat.handleMessage({type: 'chat', name:'u1', text:'test1'}, 'chatRoom1')
  await Chat.handleMessage({type: 'chat', name:'u2', text:'test2'}, 'chatRoom1')

  return { 
    review1: review1.id,
    review2: review2.id,
    review3: review3.id
  }

}

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM books");  
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM book_likes");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM followers");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM rooms");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM room_members");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM messages");

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

  await User.followUser("u2", "u1");

  await User.followUser("u3", "u1");

  await User.followUser("u1", "u2");

  const book1 = {
    id: '1',
    title: 'Book1',
    author: 'Author1',
    publisher: 'Publisher1',
    description: 'Description1',
    category: 'Category 1',
    cover: 'Cover1',
  };
  
  const book2 = {
    id: '2',
    title: 'Book2',
    author: 'Author2',
    publisher: 'Publisher2',
    description: 'Description2',
    category: 'Category 2',
    cover: 'Cover2',
  }
  
  await Book.likeBook(book1, "u1");
  await Book.likeBook(book2,  "u1");
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
  commonBeforeAllReviews,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
};
