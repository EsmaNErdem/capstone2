/** Books Routes Tests with API call mocking*/
"use strict";

const request = require("supertest");
const app = require("../app");
const Book = require("../models/book")
const { ApiNotFoundError } = require("../expressError");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


describe("Books Like-Unlike Routes", function () {
    /************************************** POST /books/:id/users/:username */
    describe("POST /books/:id/users/:username", function () {
        test("should add book to user's liked list", async function () {
            const resp = await request(app)
            .post("/books/1/users/u2")
              .send({
                  id: '1',
                  title: 'Book1',
                  author: 'Author1',
                  publisher: 'Publisher1',
                  description: 'Description1',
                  category: 'Category1',
                  cover: 'Cover1',
              })
              .set("authorization", `User Token ${u2Token}`);
            expect(resp.body).toEqual({
                    likedBook: "1"
            });
        });
        
        test("should fail without correct username", async function () {
          const resp = await request(app)
            .post("/books/1/users/u1")
              .send({
                id: '1',
                title: 'Book1',
                author: 'Author1',
                publisher: 'Publisher1',
                description: 'Description1',
                category: 'Category1',
                cover: 'Cover1',
              })
              .set("authorization", `User Token ${u2Token}`);
          expect(resp.statusCode).toEqual(401);
        });
        
        test("should fail without neccessary book data", async function () {
          const resp = await request(app)
            .post("/books/1/users/u2")
              .send({
                id: '1',
                author: 'Author1',
                publisher: 'Publisher1',
                description: 'Description1',
                category: 'Category1',
                cover: 'Cover1',
              })
              .set("authorization", `User Token ${u2Token}`);
          expect(resp.statusCode).toEqual(400);
        });
        
        test("should fail for anon", async function () {
          const resp = await request(app)
            .post("/books/1/users/u1")
              .send({
                id: '1',
                title: 'Book1',
                author: 'Author1',
                publisher: 'Publisher1',
                description: 'Description1',
                category: 'Category1',
                cover: 'Cover1',
              });
          expect(resp.statusCode).toEqual(401);
        });
    });
    
    /************************************** DELETE /books/:id/users/:username */
    describe("DELETE /books/:id/users/:username", function () {
        test("should remove book from user's liked list", async function () {
            const resp = await request(app)
            .delete("/books/1/users/u1")
              .set("authorization", `User Token ${u1Token}`);
            expect(resp.body).toEqual({
                    unlikedBook: "1"
            });
        });
        
        test("should fail without correct username", async function () {
          const resp = await request(app)
            .delete("/books/1/users/nope")
             .set("authorization", `User Token ${u1Token}`);
          expect(resp.statusCode).toEqual(401);
        });
        
        test("should fail without auth", async function () {
            const resp = await request(app)
              .delete("/books/nope/users/u2")
               .set("authorization", `User Token ${u1Token}`);
            expect(resp.statusCode).toEqual(401);
        });
          
        test("should fail without correct book id", async function () {
          const resp = await request(app)
            .delete("/books/nope/users/u1")
              .set("authorization", `User Token ${u1Token}`);
          expect(resp.statusCode).toEqual(404);
        });
        
        test("should fail for anon", async function () {
          const resp = await request(app)
            .delete("/books/1/users/u1");
          expect(resp.statusCode).toEqual(401);
        });
    });
})
