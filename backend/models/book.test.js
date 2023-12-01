const { ApiNotFoundError, NotFoundError } = require("../expressError");
const Book = require("./book");
const BookApi = require('./bookApi'); 
const db = require("../db.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon.js");


// Mocking the BookApi module
jest.mock("./bookApi")

describe("Book class", () => {
  // Mock data for testing
  const mockListOfBooks = [
    {
      id: '1',
      volumeInfo: {
        title: 'Book 1',
        authors: ['Author 1'],
        publisher: 'Publisher 1',
        description: 'Description 1',
        categories: ['Category 1'],
        imageLinks: {
          thumbnail: 'thumbnail_link_1',
          medium: 'medium_link_1',
        },
      },
    },
  ];

  const mockSearchResult = [
    {
      id: '2',
      volumeInfo: {
        title: 'Book 2',
        authors: ['Author 2'],
        publisher: 'Publisher 2',
        description: 'Description 2',
        imageLinks: {
          thumbnail: 'thumbnail_link_2',
        },
      },
    },
  ];

  const mockBookDetails = {
    id: '3',
    volumeInfo: {
      title: 'Book 3',
      authors: ['Author 3'],
      publisher: 'Publisher 3',
      description: 'Description 3',
      categories: ['Category 3'],
      imageLinks: {
        medium: 'medium_link_3',
      },
    },
  };

  // Mocking BookApi.getListOfBooks
  BookApi.getListOfBooks.mockResolvedValue(mockListOfBooks);

  // Mocking BookApi.searchListOfBooks
  BookApi.searchListOfBooks.mockResolvedValue(mockSearchResult);

  // Mocking BookApi.getBook
  BookApi.getBook.mockResolvedValue(mockBookDetails);

  beforeAll(commonBeforeAll);
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);
  afterAll(commonAfterAll);


  /************************************** getListOfBooks */
  describe("getListOfBooks method", function () {
      test("should return External API data of list of books", async function () {
          const books = await Book.getListOfBooks();
          expect(books).toEqual([
              {
              id: '1',
              title: 'Book 1',
              author: 'Author 1',
              publisher: 'Publisher 1',
              description: 'Description 1',
              category: 'Category 1',
              cover: 'thumbnail_link_1',
              }
          ]);
      });

      test("should throw ApiNotFoundError if BookApi.getListOfBooks returns falsy value", async () => {
          BookApi.getListOfBooks.mockResolvedValueOnce(null);
          try {
              await Book.getListOfBooks()
          } catch (err) {
              expect(err instanceof ApiNotFoundError).toBeTruthy();
          }
      });
  });

  /************************************** searchListOfBooks */
  describe("searchListOfBooks method", () => {
      test("should return External API data of list of books that fit search with partial terms", async function () {
          const books = await Book.searchListOfBooks({ q: "2" }, { author:"Author" });
          expect(books).toEqual([
              {
              id: '2',
              title: 'Book 2',
              author: 'Author 2',
              publisher: 'Publisher 2',
              description: 'Description 2',
              cover: 'thumbnail_link_2',
              }
          ]);
      });

      test("should return External API data of list of books that fit search with no terms", async () => {
          const books = await Book.searchListOfBooks({ q: "2" });
          expect(books).toEqual([
              {
              id: '2',
              title: 'Book 2',
              author: 'Author 2',
              publisher: 'Publisher 2',
              description: 'Description 2',
              cover: 'thumbnail_link_2',
              }
          ]);
      });

      test("should throw error if no search data given", async () => {
          try {
              const books = await Book.searchListOfBooks();
          } catch (err) {
                  expect(err instanceof ApiNotFoundError).toBeTruthy();
          }
      });
  });
    
  /************************************** getBook */
  describe('getBook method', () => {
      test("should return External API data of book detail", async function () {
          const books = await Book.getBook();
          expect(books).toEqual({
              id: '3',
              title: 'Book 3',
              author: 'Author 3',
              publisher: 'Publisher 3',
              description: 'Description 3',
              categories: ['Category 3'],
              cover: 'medium_link_3',
          });
      });

      test("should throw ApiNotFoundError if BookApi.getListOfBooks returns falsy value", async () => {
          BookApi.getBook.mockResolvedValueOnce(null);
          try {
              await Book.getBook()
          } catch (err) {
              expect(err instanceof ApiNotFoundError).toBeTruthy();
          }
      });
});

    /************************************** likeBook */
  describe('likeBook method', () => {
      test("should like book username", async function () {
        let res = await db.query(
          "SELECT * FROM book_likes WHERE book_id=$1 AND username=$2", ['2', 'u2']);
        expect(res.rowCount).toBe(0); 

        const bookId = await Book.likeBook({
          id: '2',
          title: 'Book2',
          author: 'Author2',
          publisher: 'Publisher2',
          description: 'Description2',
          cover: 'Cover2',
          }, "u2");
        expect(bookId).toBe('2')
        res = await db.query(
          "SELECT * FROM book_likes WHERE book_id=$1 AND username=$2", ['2', 'u2']);
        expect(res.rows[0]).toEqual({
            id: expect.any(Number),
            book_id: "2", 
            username: "u2"
        });
      });

      test("should like book username and add new book to database if liked book doesn't already exist", async function () {
          let bookCheck = await db.query(
            "SELECT * FROM books WHERE id=$1", ['5']);
          expect(bookCheck.rowCount).toBe(0); 
          await Book.likeBook({
            id: '5',
            title: 'Book5',
            author: 'Author5',
            publisher: 'Publisher5',
            description: 'Description5',
            cover: 'Cover5',
            }, "u2");

          bookCheck = await db.query(
              "SELECT * FROM books WHERE id=$1", ['5']);
          expect(bookCheck.rowCount).toBe(1); 
          const res = await db.query(
            "SELECT * FROM book_likes WHERE book_id=$1 AND username=$2", ['5', 'u2']);
          expect(res.rows[0]).toEqual({
              id: expect.any(Number),
              book_id: "5", 
              username: "u2"
          });
      });

      test("should fail if cannot find username book username", async function () {
          try {
            await Book.likeBook({
              id: '2',
              title: 'Book2',
              author: 'Author2',
              publisher: 'Publisher2',
              description: 'Description2',
              cover: 'Cover2',
              }, "nope");
          }  catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
          }
      });
  });

  /************************************** unlikeBook */
  describe('unlikeBook method', () => {
    test("should unlike book username", async function () {
      let res = await db.query(
      "SELECT * FROM book_likes WHERE book_id=$1 AND username=$2", ['1', 'u1']);
      expect(res.rowCount).toBe(1); 

      await Book.unlikeBook("1", "u1");
      res = await db.query(
        "SELECT * FROM book_likes WHERE book_id=$1 AND username=$2", ['1', 'u1']);
        expect(res.rowCount).toBe(0); 
    });

    test("should fail if cannot find username", async function () {
      try {
        await Book.unlikeBook("1", "nope");
      }  catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });

    test("should fail if cannot find book", async function () {
      try {
        await Book.unlikeBook("nope", "u1");
      }  catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });
});
