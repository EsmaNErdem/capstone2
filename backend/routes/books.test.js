/** Books Routes Tests */
"use strict";

const request = require("supertest");
const app = require("../app");
const Book = require("../models/book")

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token
} = require("./_testCommon");

jest.mock("../models/book")

describe("Book Routes", () => {
      // Mock data for testing
    const mockListOfBooks = [
        {
            id: '1',
            title: 'Book 1',
            author: 'Author 1',
            publisher: 'Publisher 1',
            description: 'Description 1',
            category: 'Category 1',
            cover: 'thumbnail_link_1',
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
    afterEach(() => {
        jest.clearAllMocks();
        commonAfterEach();
    });
    afterAll(commonAfterAll);

})