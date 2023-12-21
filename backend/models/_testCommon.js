const bcrypt = require("bcrypt");
process.env.NODE_ENV = "test";
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");  
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM books");  
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM book_likes");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM reviews");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM review_likes");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM followers");

  await db.query(`
    INSERT INTO users(username,
                      password,
                      first_name,
                      last_name,
                      img,
                      email)
    VALUES ('u1', $1, 'U1F', 'U1L', 'img1', 'u1@email.com'),
            ('u2', $2, 'U2F', 'U2L', 'img2', 'u2@email.com')
    RETURNING username`,
  [
    await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
    await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
  ]);

  await db.query(
    `INSERT INTO books 
    (id, title, author, publisher, description, category, cover)
    VALUES ('1', 'Book 1', 'Author 1', 'Publisher 1', 'Description 1', 'Category 1', 'Cover 1'),
           ('2', 'Book 2', 'Author 2', 'Publisher 2', 'Description 2', 'Category 2', 'Cover 2')`
  );

  await db.query(
    `INSERT INTO book_likes 
     (book_id, username)
     VALUES ('1', 'u1'),
             ('1', 'u2'),
             ('2', 'u1')`
  );

  await db.query(
    `INSERT INTO reviews 
     (id, username, book_id, review)
     VALUES (10000, 'u1', '1', 'Review1'),
            (20000, 'u1', '2', 'Review2')`
  );

  await db.query(
    `INSERT INTO review_likes
     (review_id, username)
     VALUES (10000, 'u1'),
            (20000, 'u2'),
            (20000, 'u1')`
  );

  await db.query(
    `INSERT INTO followers
     (following, followed_by)
     VALUES ('u2', 'u1')`
  );
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


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
};