"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
  u1Token,
  u2Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /users/register */
describe("POST /users/register", function () {
    const newUser = {
        username: "new",
        firstName: "Test",
        lastName: "Tester",
        email: "test@test.com",
        img: "testing"
      };

  test("should register user and send token", async function () {
    const resp = await request(app)
        .post("/users/register")
        .send({
            username: "new",
            firstName: "Test",
            lastName: "Tester",
            password: "password-new",
            email: "test@test.com",
            img: "testing"
        });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ token: expect.any(String) });
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
        .post("/users/register")
        .send({
          username: "new",
        })
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .post("/users/register")
        .send({
          username: "u-new",
          firstName: "First-new",
          lastName: "Last-newL",
          password: "password-new",
          email: "not-an-email",
          img: "testing"
        })
    expect(resp.statusCode).toEqual(400);
  });
});


/************************************** POST /users/login */
describe("POST /users/login", function () {
  test("should register user and send token", async function () {
    const resp = await request(app)
        .post("/users/login")
        .send({
            username: "u1",
            password: "password1",
        });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ token: expect.any(String) });
  });

  test("unauthorized with incorrect data", async function () {
    const resp = await request(app)
        .post("/users/login")
        .send({
          username: "u1",
          password: "nope",
        })
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
        .post("/users/login")
        .send({
          username: "u1",
        })
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .post("/users/login")
        .send({
          username: "u1",
          password: "password1",
          firstName: "Test",
        })
    expect(resp.statusCode).toEqual(400);
  });
});

// /************************************** GET /users/:username */

// describe("GET /users/:username", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//         .get(`/users/u1`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u1",
//         firstName: "U1F",
//         lastName: "U1L",
//         email: "user1@user.com",
//         isAdmin: false,
//         applications: [testJobIds[0]],
//       },
//     });
//   });

//   test("works for same user", async function () {
//     const resp = await request(app)
//         .get(`/users/u1`)
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u1",
//         firstName: "U1F",
//         lastName: "U1L",
//         email: "user1@user.com",
//         isAdmin: false,
//         applications: [testJobIds[0]],
//       },
//     });
//   });

//   test("unauth for other users", async function () {
//     const resp = await request(app)
//         .get(`/users/u1`)
//         .set("authorization", `Bearer ${u2Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .get(`/users/u1`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found if user not found", async function () {
//     const resp = await request(app)
//         .get(`/users/nope`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
  test("works for the correct user", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          firstName: "New",
        })
        .set("authorization", `User Token ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "New",
        lastName: "U1L",
        email: "user1@user.com",
        img: "img1"
      },
    });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          firstName: "New",
        })
        .set("authorization", `User Token ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          firstName: "New",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such user", async function () {
    const resp = await request(app)
        .patch(`/users/nope`)
        .send({
          firstName: "Nope",
        })
        .set("authorization", `User Token ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          firstName: 42,
        })
        .set("authorization", `User Token ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("works: can set new password", async function () {
    const resp = await request(app)
        .patch(`/users/u1`)
        .send({
          password: "new-pass",
        })
        .set("authorization", `User Token ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        img: "img1"
      },
    });
    const updated = await request(app)
        .post("/users/login")
        .send({
            username: "u1",
            password: "new-pass",
        });
    expect(updated.statusCode).toEqual(200);
  });
});
