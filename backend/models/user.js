"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */
class User {

  /** Register user with data { username, password, firstName, lastName, email }
   *
   * Returns { username, firstName, lastName, email }
   *
   * Throws BadRequestError on duplicates.
   **/
   static async register({ username, password, firstName, lastName, email, img }) {
    const duplicateCheck = await db.query(
        `SELECT username
         FROM users
         WHERE username = $1`,
      [username],
    );
    if (duplicateCheck.rows[0]) {
        throw new BadRequestError(`Duplicate username: ${username}`);
    }
    
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            img,
            email)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", img, email`,
        [
          username,
          hashedPassword,
          firstName,
          lastName,
          img,
          email
        ],
    );

    const user = result.rows[0];

    return user;
   }


   /** Authenticate user with data { username, password }.
   *
   * Returns { username, first_name, last_name, img, email }
   * 
   * Tries to find user first then password checks
   * 
   * Throws UnauthorizedError is user not found or wrong password.
   **/
   static async login({ username, password }) {
    const result = await db.query(
        `SELECT username,
                password,
                first_name AS "firstName",
                last_name AS "lastName",
                img,
                email
         FROM users
         WHERE username = $1`,
        [username],
    );

    const user = result.rows[0];

    if (user) {
        // compare hashed password to a new hash from password
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid === true) {
        delete user.password;
        return user;
        }
    }

    throw new UnauthorizedError("Invalid username/password");
   }

   
  /** Given a username, return data about user.
   *
   * Returns { username, firstName, lastName, email, img }
   * 
   * Throws NotFoundError if user not found.
   **/
  static async get(username) {
    const userRes = await db.query(
        `SELECT username,
                first_name AS "firstName",
                last_name AS "lastName",
                img,
                email
        FROM users
        WHERE username = $1`,
        [username],
    );


    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
    }


   /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, img }
   *
   * Returns { username, firstName, lastName, email, img }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

   static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          firstName: "first_name",
          lastName: "last_name",
        });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                img`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

}

module.exports = User; 