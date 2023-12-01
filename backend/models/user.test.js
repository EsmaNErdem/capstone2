"use strict";

const db = require("../db.js");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const User = require("./user.js")
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
  } = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** register */
describe("register", function () {
    const newUser = {
      username: "new",
      firstName: "Test",
      lastName: "Tester",
      email: "test@test.com",
      img: "testimg"
    };
  
    test("works", async function () {
      let user = await User.register({
        ...newUser,
        password: "password"
      });
      expect(user).toEqual(newUser);
      const found = await db.query("SELECT * FROM users WHERE username = 'new'");
      expect(found.rows.length).toEqual(1);
      expect(found.rows[0].img).toEqual("testimg");
      expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });
  
    test("bad request with dup data", async function () {
      try {
        await User.register({
          ...newUser,
          password: "password",
        });
        await User.register({
          ...newUser,
          password: "password",
        });
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
});
  

/************************************** authenticate */
describe("authenticate", function () {
    test("works", async function () {
      const user = await User.login({ username:"u1", password:"password1" });
      expect(user).toEqual({
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        img: "img1"
      });
    });
  
    test("unauth if no such user", async function () {
      try {
        await User.login({ username:"wrong", password:"password" });
        fail();
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      }
    });
  
    test("unauth if wrong password", async function () {
      try {
        await User.login({ username:"c1", password:"wrong" });
        fail();
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      }
    });
});

  
/************************************** get */
describe("get", function () {
    test("works", async function () {
      let user = await User.get("u1");
      expect(user).toEqual({
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        img: "img1"
      });
    });
  
    test("not found if no such user", async function () {
      try {
        await User.get("nope");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
});


/************************************** update */
describe("update", function () {
    const updateData = {
      firstName: "NewF",
      lastName: "NewF",
      email: "new@email.com",
      img: "New"
    };
  
    test("works", async function () {
      let user = await User.update("u1", updateData);
      expect(user).toEqual({
        username: "u1",
        ...updateData,
      });
    });
  
    test("works: set password", async function () {
      let user = await User.update("u1", {
        password: "new",
      });
      expect(user).toEqual({
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        img: "img1"
      });

      const updatedUser = await User.login({ username:"u1", password:"new" });
      expect(updatedUser).toEqual({
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        img: "img1"
      });

    });
  
    test("not found if no such user", async function () {
      try {
        await User.update("nope", {
          firstName: "test",
        });
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  
    test("bad request if no data", async function () {
      expect.assertions(1);
      try {
        await User.update("c1", {});
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
});