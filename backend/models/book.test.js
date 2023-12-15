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
          thumbnail: 'Cover 1',
        },
      },
    },
    {
      id: '2',
      volumeInfo: {
        title: 'Book 2',
        authors: ['Author 2'],
        publisher: 'Publisher 2',
        description: 'Description 2',
        categories: ['Category 2'],
        imageLinks: {
          thumbnail: 'Cover 2',
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
          thumbnail: 'Cover 2',
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
        medium: 'Cover 3',
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


  /************************************** insertBook */
  describe("insertBook method", function () {
    test("should insert book and return book ID", async function () {
        const books = await Book.insertBook({
                        id: 'New',
                        title: 'Book',
                        author: 'Author ',
                        publisher: 'Publisher',
                        description: 'Description',
                        category: 'Category',
                        cover: 'Cover',
                      });
        expect(books).toEqual([ { id: 'New' } ]);
    });
  });

  /************************************** getBookById */
  describe("getBookById method", function () {
    test("should checkif book exist in database", async function () {
        const book = await Book.getBookById("1");
        expect(book).toEqual([ { id: '1' } ]);
    });

    test("should return empty array if no book", async function () {
      const book = await Book.getBookById("nope");
      expect(book).toEqual([]);
  });
  });
  
  /************************************** getAllLikeCounts */
  describe("getAllLikeCounts method", function () {
    test("should return number of likes list of books", async function () {
      const booksLikesCount = await Book.getAllLikeCounts();
      expect(booksLikesCount).toEqual({ '2': '1', '1': '2' });
    });
  });
  
  /************************************** getAllReviews */
  describe("getAllReviews method", function () {
    test("should return External API review data of list of books", async function () {
        const booksReviews = await Book.getAllReviews();
        expect(booksReviews).toEqual({
          '1': [
            {
              id: '1',
              reviewId: 10000,
              review: 'Review1',
              username: 'u1',
              userImg: "img1",
              date: expect.any(Date),
              reviewLikeCount: '1'
            }
          ],
          '2': [
            {
              id: '2',
              reviewId: 20000,
              review: 'Review2',
              username: 'u1',
              userImg: "img1",
              date: expect.any(Date),
              reviewLikeCount: '2'
            }
          ]
        });
    });
  });

    /************************************** getLikeCountForBook */
    describe("getLikeCountForBook method", function () {
      test("should return number of likes of a book", async function () {
        const bookLikesCount = await Book.getLikeCountForBook('1');
        expect(bookLikesCount).toEqual('2');
      });
    });
    
    /************************************** getReviewsForBook */
    describe("getReviewsForBook method", function () {
      test("should return reviews data of list of a book", async function () {
          const booksReviews = await Book.getReviewsForBook('1');
          expect(booksReviews).toEqual([
              {
                reviewId: 10000,
                review: 'Review1',
                username: 'u1',
                date: expect.any(Date),
                reviewLikeCount: '1'
              }
            ]);
      });
    });
  
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
              cover: 'Cover 1',
              bookLikeCount: '2',
              reviews: [
                {
                  id: '1',
                  reviewId: 10000,
                  review: 'Review1',
                  username: 'u1',
                  userImg: "img1",
                  date: expect.any(Date),
                  reviewLikeCount: '1'
                },
              ]
              }, 
              {
              id: '2',
              title: 'Book 2',
              author: 'Author 2',
              publisher: 'Publisher 2',
              description: 'Description 2',
              category: 'Category 2',
              cover: 'Cover 2',
              bookLikeCount: '1',
              reviews: [{
                id: '2',
                reviewId: 20000,
                review: 'Review2',
                username: 'u1',
                userImg: "img1",
                date: expect.any(Date),
                reviewLikeCount: '2'
              }]
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
              cover: 'Cover 2',
              bookLikeCount: '1',
              reviews: [{
                id: '2',
                reviewId: 20000,
                review: 'Review2',
                username: 'u1',
                userImg: "img1",
                date: expect.any(Date),
                reviewLikeCount: '2'
              }]
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
              cover: 'Cover 2',
              bookLikeCount: '1',
              reviews: [{
                id: '2',
                reviewId: 20000,
                review: 'Review2',
                username: 'u1',
                userImg: "img1",
                date: expect.any(Date),
                reviewLikeCount: '2'
              }]
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
          let book = await Book.getBookById("3");
          expect(book).toEqual([]);

          book = await Book.getBook();
          expect(book).toEqual({
              id: '3',
              title: 'Book 3',
              author: 'Author 3',
              publisher: 'Publisher 3',
              description: 'Description 3',
              categories: ['Category 3'],
              cover: undefined,
              bookLikeCount: "0",
              reviews: []
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
              book_id: "5", 
              username: "u2"
          });
      });

      test("should fail if cannot find username", async function () {
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
