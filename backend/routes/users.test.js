"use strict";

const request = require("supertest");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
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

/************************************** GET /users/:username */
describe("GET /users/:username", function () {
  test("shows detail of a user", async function () {
    const resp = await request(app)
        .get(`/users/u1`)
        .set("authorization", `User Token ${u2Token}`);
    expect(resp.body).toEqual({
      user: {
        username: 'u1',
        firstName: 'U1F',
        lastName: 'U1L',
        img: 'img1',
        email: "user1@user.com",
        reviews: [],
        likedBooks: [
          {
            book_id: '1',
            title: 'Book1',
            author: 'Author1',
            publisher: 'Publisher1',
            description: 'Description1',
            category: 'Category 1',
            cover: 'Cover1',
            bookLikeCount: '1'
          },
          {
            book_id: '2',
            title: 'Book2',
            author: 'Author2',
            publisher: 'Publisher2',
            description: 'Description2',
            category: 'Category 2',
            cover: 'Cover2',
            bookLikeCount: '1'
          }
        ],
        likedReviews: [],
        recievedLikeCount: [],
        followers: [
          {
            followedBy: "u2",
            userImg: 'img2'
          }
        ],
        following: [
          {
            following: 'u2',
            userImg: 'img2',
          },
          {
            following: 'u3',
            userImg: 'img3',
          }
      ]
      }
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user not found", async function () {
    const resp = await request(app)
        .get(`/users/nope`)
        .set("authorization", `User Token ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

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

/************************************** POST /users/:following/follow/:username */
describe("POST /users/:following/follow/:username", () => {
  test("works for the correct users", async function () {
    const resp = await request(app)
        .post(`/users/u3/follow/u2`)
        .set("authorization", `User Token ${u2Token}`);
    expect(resp.body).toEqual({
      follow: {
        following: "u3",
        followedBy: "u2",
      },
    });
  });

  test("fails for already following", async function () {
    const resp = await request(app)
        .post(`/users/u3/follow/u1`)
        .set("authorization", `User Token ${u1Token}`);
        expect(resp.statusCode).toEqual(500);
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
        .post(`/users/u3/follow/u1`)
        .set("authorization", `User Token ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .post(`/users/u3/follow/u1`)
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such user", async function () {
    const resp = await request(app)
        .post(`/users/nope/follow/u2`)
        .set("authorization", `User Token ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if no such user", async function () {
    const resp = await request(app)
        .post(`/users/u3/follow/nope`)
        .set("authorization", `User Token ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** DELETE /users/:following/follow/:username */
describe("DELETE /users/:following/follow/:username", () => {
  test("works for the correct users", async function () {
    const resp = await request(app)
        .delete(`/users/u3/follow/u1`)
        .set("authorization", `User Token ${u1Token}`);
    expect(resp.body).toEqual({
      unfollow: {
        unfollowedBy: "u1"
      },
    });
  });

  test("fails for already unfollowing", async function () {
    const resp = await request(app)
        .delete(`/users/u3/follow/u2 `)
        .set("authorization", `User Token ${u2Token}`);
        expect(resp.statusCode).toEqual(400);
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
        .delete(`/users/u3/follow/u1`)
        .set("authorization", `User Token ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/users/u3/follow/u1`)
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such user", async function () {
    const resp = await request(app)
        .delete(`/users/nope/follow/u2`)
        .set("authorization", `User Token ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if no such user", async function () {
    const resp = await request(app)
        .delete(`/users/u3/follow/nope`)
        .set("authorization", `User Token ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});
