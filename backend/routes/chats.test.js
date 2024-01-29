/** Chat Routes Tests with API call mocking*/
"use strict";

const request = require("supertest");
const app = require("../app");
const Chat = require("../models/chats/chat")

const {
  commonBeforeAllReviews,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token
} = require("./_testCommon");

describe("Review Routes", function () {
    let review1;
    let review2;

    beforeAll(async () => {
        const data = await commonBeforeAllReviews();
        review1 = data.review1;
        review2 = data.review2;
    });
    
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);
    afterAll(commonAfterAll);

    /************************************** get /chats/:roomName */
    describe("GET /chats/:roomName ", function () {
        test("should return previous messages for a given room", async function () {
            const resp = await request(app)
            .get(`/chats/chatRoom1`)
                .set("authorization", `User Token ${u2Token}`);
            expect(resp.body).toEqual({
                    messages: [
                        {
                            name: 'u1',
                            text: 'test1', 
                            date: expect.any(String),
                        },
                        {
                            name: 'u2',
                            text: 'test2', 
                            date: expect.any(String),
                        }
                ]
            });
        });

        test("should return previous messages for a given room", async function () {
            const resp = await request(app)
            .get(`/chats/nope`)
                .set("authorization", `User Token ${u2Token}`);
            expect(resp.statusCode).toEqual(404);
        });

        test("should fail without auth", async function () {
            const resp = await request(app)
             .get(`/chats/chatRoom1`)
            expect(resp.statusCode).toEqual(401);
        });
    });

    /************************************** get /chats/rooms/:username */
    describe("GET /chats/rooms/:username ", function () {
        test("should return open chat rooms with last messages for give username", async function () {
            const resp = await request(app)
            .get(`/chats/rooms/u1`)
                .set("authorization", `User Token ${u1Token}`);
            expect(resp.body).toEqual({
                    messages: [{
                        message: {
                                username: 'u2',
                                message: 'test2', 
                                messageDate: expect.any(String),
                                messageId: expect.any(Number),
                            },
                        room: {
                                id: expect.any(Number),
                                roomDate: expect.any(String),
                            },
                        user: {
                            username: 'u2',
                            userImg: 'img2'
                        }
                    }]
            });
        });

        test("should fail without auth", async function () {
            const resp = await request(app)
            .get(`/chats/rooms/u1`)
                .set("authorization", `User Token ${u2Token}`);
            expect(resp.statusCode).toEqual(401);
        });

        test("should fail without auth", async function () {
            const resp = await request(app)
                .get(`/chats/rooms/u1`)
            expect(resp.statusCode).toEqual(401);
        });
    });
});