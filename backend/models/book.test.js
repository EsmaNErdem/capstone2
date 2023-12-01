const { ApiNotFoundError } = require("../expressError");
const Book = require("./book");
const BookApi = require('./bookApi'); 

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

  afterEach(() => {
    jest.clearAllMocks();
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
});
