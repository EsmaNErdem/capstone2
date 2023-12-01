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
    VALUES ('1', 'Book1', 'Author1', 'Publisher1', 'Description1', 'Category1', 'Cover1'),
           ('2', 'Book2', 'Author2', 'Publisher2', 'Description2', 'Category2', 'Cover2')`
  );

  await db.query(
    `INSERT INTO book_likes 
     (book_id, username)
     VALUES ('1', 'u1'),
             ('2', 'u1')`
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