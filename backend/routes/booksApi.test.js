/** Books API Data Routes Tests */
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

jest.mock("../models/book")

describe("Book Routes API Calls", () => {
      // Mock data for testing
    const mockListOfBooks = [
        {
            id: '1',
            title: 'Book 1',
            author: 'Author 1',
            publisher: 'Publisher 1',
            description: 'Description 1',
            category: 'Category 1',
            cover: 'thumbnail_link_1'
        },
        {
            id: '2',
            title: 'Book 2',
            author: 'Author 2',
            publisher: 'Publisher 2',
            category: 'Category 2',
            description: 'Description 2',
            cover: 'thumbnail_link_2'
            }
    ];

    const mockBookDetails = {
            id: '3',
            title: 'Book 3',
            author: 'Author 3',
            publisher: 'Publisher 3',
            description: 'Description 3',
            categories: ['Category 3'],
            cover: 'medium_link_3',
        };

    // Mocking BookApi.getListOfBooks
    Book.getListOfBooks.mockResolvedValue(mockListOfBooks);

    // Mocking BookApi.searchListOfBooks
    Book.searchListOfBooks.mockResolvedValue(mockListOfBooks);

    // Mocking BookApi.getBook
    Book.getBook.mockResolvedValue(mockBookDetails);

    beforeAll(commonBeforeAll);
    beforeEach(commonBeforeEach);
    afterEach(commonAfterEach);
    afterAll(commonAfterAll);

    
  /************************************** GET /books/all//:page */
  describe("GET /books/all/:page", function () {
    test("should get lists of books from mocked external API data", async function () {
      const resp = await request(app)
        .get("/books/all/0")
        .set("authorization", `User Token ${u1Token}`);
      expect(resp.body).toEqual({
        books:
        [
            {
                id: '1',
                title: 'Book 1',
                author: 'Author 1',
                publisher: 'Publisher 1',
                description: 'Description 1',
                category: 'Category 1',
                cover: 'thumbnail_link_1'
            },
            {
                id: '2',
                title: 'Book 2',
                author: 'Author 2',
                publisher: 'Publisher 2',
                category: 'Category 2',
                description: 'Description 2',
                cover: 'thumbnail_link_2'
            }
        ]
      });
    });

    test("should handle error from external API calls", async function () {
        Book.getListOfBooks.mockResolvedValue(new ApiNotFoundError("Testing"));
        try {
            const resp = await request(app)
              .get("/books/all/0")
              .set("authorization", `User Token ${u1Token}`);
        } catch (e) {
            expect(e instanceof ApiNotFoundError).toBeTruthy();
            expect(resp.statusCode).toEqual(404);
        }
    });    

    test("should fail for anon", async function () {
      const resp = await request(app)
        .get("/books/all/0");
      expect(resp.statusCode).toEqual(401);
    });
  });

  /************************************** GET /books/search/:page */
  describe("GET /books/search/:page", function () {
    test("should get lists of books from mocked external API data if search matches", async function () {
      const resp = await request(app)
        .get("/books/search/1")
          .query({search:"Book"})
          .set("authorization", `User Token ${u1Token}`);
      expect(resp.body).toEqual({
        books:
        [
            {
                id: '1',
                title: 'Book 1',
                author: 'Author 1',
                publisher: 'Publisher 1',
                description: 'Description 1',
                category: 'Category 1',
                cover: 'thumbnail_link_1'
            },
            {
                id: '2',
                title: 'Book 2',
                author: 'Author 2',
                publisher: 'Publisher 2',
                category: 'Category 2',
                description: 'Description 2',
                cover: 'thumbnail_link_2'
            }
        ]
      });
    });

    test("should throw error if no search provided", async function () {
        const resp = await request(app)
          .get("/books/search/0")
          .set("authorization", `User Token ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
    }); 

    test("should fail for anon", async function () {
      const resp = await request(app)
        .get("/books/search/0");
      expect(resp.statusCode).toEqual(401);
    });    
  });

  /************************************** GET /books/:id*/
  describe("GET /books/:id", function () {
    test("should get book detail from mocked external API data", async function () {
      const resp = await request(app)
        .get("/books/3")
        .set("authorization", `User Token ${u1Token}`);
      expect(resp.body).toEqual({
            book: {
                id: '3',
                title: 'Book 3',
                author: 'Author 3',
                publisher: 'Publisher 3',
                description: 'Description 3',
                categories: ['Category 3'],
                cover: 'medium_link_3',
            }
      });
    });

    test("should fail for anon", async function () {
      const resp = await request(app)
        .get("/books/3");
      expect(resp.statusCode).toEqual(401);
    }); 
  });
})