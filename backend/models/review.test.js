const { NotFoundError } = require("../expressError");
const Review = require("./review.js")
const Book = require("./book.js");
const db = require("../db.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon.js");

describe("Review class", () => {
  beforeAll(commonBeforeAll);
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);
  afterAll(commonAfterAll);

  /************************************** addReview */
  describe("addReview method", function () {
    test("should add review and return review data", async function () {
        const reviews = await Review.add('u1', {
                        id: '1',
                        title: 'Book 1',
                        author: 'Author 1',
                        publisher: 'Publisher 1',
                        description: 'Description 1',
                        category: 'Category 1',
                        cover: 'Cover 1',
                      }, 'Review');
        expect(reviews).toEqual({
            id: expect.any(Number), 
            username: 'u1',
            book_id: '1', 
            review: 'Review',
            date: expect.any(Date),
        });
    });

    test("should add review  and new book if book doesn't exist already", async function () {
        const book = await Book.getBookById("bookId");
        expect(book).toEqual([]);
        const reviews = await Review.add('u1', {
                        id: 'bookId',
                        title: 'Book',
                        author: 'Author ',
                        publisher: 'Publisher',
                        description: 'Description',
                        category: 'Category',
                        cover: 'Cover',
                      }, 'Review');
        expect(reviews).toEqual({
            id: expect.any(Number), 
            username: 'u1',
            book_id: 'bookId', 
            review: 'Review',
            date: expect.any(Date),
        });
        const newBook = await Book.getBookById("bookId");
        expect(newBook).toEqual([{ id: "bookId" }]);

    });

    test("should fail if no user found with given username", async function () {
        try {
            await Review.add('nope', {
                id: 'bookId',
                title: 'Book',
                author: 'Author ',
                publisher: 'Publisher',
                description: 'Description',
                category: 'Category',
                cover: 'Cover',
              }, 'Review');
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
  });

  /************************************** findAll */
  describe("findAll method", function () {
    test("should return all review data with filters popular", async function () {
      const reviews = await Review.findAll({ sortBy: "popular" });
      expect(reviews).toEqual([
          {
            reviewId: 20000,
            review: 'Review2',
            username: 'u1',
            userImg: "img1",
            date: expect.any(Date),
            book_id: '2',
            title: 'Book 2',
            cover: 'Cover 2',
            author: 'Author 2',
            category: 'Category 2',
            reviewLikeCount: '2'
          },
          {
            reviewId: 10000,
            review: 'Review1',
            username: 'u1',
            userImg: "img1",
            date: expect.any(Date),
            book_id: '1',
            title: 'Book 1',
            cover: 'Cover 1',
            author: 'Author 1',
            category: 'Category 1',
            reviewLikeCount: '1'
          },
        ]);
    });

    test("should return all review data with pagination", async function () {
      const reviews = await Review.findAll({ sortBy: "popular" }, 2, 1);
      expect(reviews).toEqual([
          {
            reviewId: 10000,
            review: 'Review1',
            username: 'u1',
            userImg: "img1",
            date: expect.any(Date),
            book_id: '1',
            title: 'Book 1',
            cover: 'Cover 1',
            author: 'Author 1',
            category: 'Category 1',
            reviewLikeCount: '1'
          }
      ]);
  });

  test("should return all review data with pagination", async function () {
    const reviews = await Review.findAll({sortBy: "popular"}, 1, 1);
    expect(reviews).toEqual([
      {
        reviewId: 20000,
        review: 'Review2',
        username: 'u1',
        userImg: "img1",
        date: expect.any(Date),
        book_id: '2',
        title: 'Book 2',
        cover: 'Cover 2',
        author: 'Author 2',
        category: 'Category 2',
        reviewLikeCount: '2'
      }
    ]);
});

    test("should return all review data with filters", async function () {
        const reviews = await Review.findAll({ title: "1" });
        expect(reviews).toEqual( [
            {
              reviewId: 10000,
              review: 'Review1',
              username: 'u1',
              userImg: "img1",
              date: expect.any(Date),
              book_id: '1',
              title: 'Book 1',
              cover: 'Cover 1',
              author: 'Author 1',
              category: 'Category 1',
              reviewLikeCount: '1'
            }
        ]);
    });

    test("should return all review data with filters", async function () {
        const reviews = await Review.findAll({ category: "1" });
        expect(reviews).toEqual( [
            {
              reviewId: 10000,
              review: 'Review1',
              username: 'u1',
              userImg: "img1",
              date: expect.any(Date),
              book_id: '1',
              title: 'Book 1',
              cover: 'Cover 1',
              author: 'Author 1',
              category: 'Category 1',
              reviewLikeCount: '1'
            }
        ]);
    });

  });

    /************************************** getReviewsByBook */
    describe("getReviewsByBook method", function () {
        test("should return reviews of a book by given bookId", async function () {
            const reviews = await Review.getReviewsByBook('1');
            expect(reviews).toEqual([
                {
                reviewId: 10000,
                review: 'Review1',
                username: 'u1',
                userImg: "img1",
                date: expect.any(Date),
                book_id: '1',
                reviewLikeCount: '1'
                }
            ]);
        });

        test("should return reviews of a book by given bookId with filters", async function () {
            const reviews = await Review.getReviewsByBook('1', { username: "u1"});
            expect(reviews).toEqual([
                {
                reviewId: 10000,
                review: 'Review1',
                username: 'u1',
                userImg: "img1",
                date: expect.any(Date),
                book_id: '1',
                reviewLikeCount: '1'
                }
            ]);
        });

        test("should return reviews of a book by given bookId with filters", async function () {
            const reviews = await Review.getReviewsByBook('1', { username: "u2"});
            expect(reviews).toEqual([]);
        });

        test("should return empty string if nook book id match", async function () {
          const reviews = await Review.getReviewsByBook('nope');
          expect(reviews).toEqual([]);
      });
    });
    
  /************************************** getReviewId */
  describe('getReviewId method', () => {
        test("should checkif review exist in database", async function () {
            const review = await Review.getReviewId(10000);
            expect(review).toEqual([ { id: 10000 } ]);
        });

        test("should return empty array if no book", async function () {
            const review = await Review.getReviewId(1000000000);
            expect(review).toEqual([]);
        });
  });

    /************************************** getReviewLikeCount */
    describe('getReviewLikeCount method', () => {
        test("should return number of likes of review given with id", async function () {
            const reviewLikeCount = await Review.getReviewLikeCount(10000);
            expect(reviewLikeCount).toEqual([ { reviewLikeCount: '1' } ]);
        });

        test("should return [] review given with id if no likes", async function () {
            const reviewLikeCount = await Review.getReviewLikeCount(0);
            expect(reviewLikeCount).toEqual([]);
        });
  });


/************************************** remove */
  describe('remove method', () => {
        test("should remove review from database", async function () {
            const review = await Review.getReviewId(10000);
            expect(review).toEqual([ { id: 10000 } ]);

            await Review.remove(10000, "u1");

            const reviewRemoved = await Review.getReviewId(10000);
            expect(reviewRemoved).toEqual([]);
        });

        test("should not remove review from database without correct user", async function () {
            const review = await Review.getReviewId(10000);
            expect(review).toEqual([ { id: 10000 } ]);

            await Review.remove(10000, "u2");

            const reviewRemoved = await Review.getReviewId(10000);
            expect(reviewRemoved).toEqual([ { id: 10000 } ]);
        });

        test("should fail if no user found with given username", async function () {
            try {
                await Review.remove(10000, 'nope'); 
            } catch (err) {
                expect(err instanceof NotFoundError).toBeTruthy();
            }
        });

        test("should fail if no user found with given review id", async function () {
            try {
                await Review.remove(0, 'u1'); 
            } catch (err) {
                expect(err instanceof NotFoundError).toBeTruthy();
            }
        });
        
    }); 

  /************************************** like review */
  describe('like review method', () => {
      test("should like review", async function () {
        const reviewLikeCount = await Review.getReviewLikeCount(10000);
        expect(reviewLikeCount).toEqual([ { reviewLikeCount: '1' } ]);

        const review = await Review.like(10000, "u2");
        expect(review).toEqual(10000);
        
        const newLikeCount = await Review.getReviewLikeCount(10000);
        expect(newLikeCount).toEqual([ { reviewLikeCount: '2' } ]);
      });

      test("should fail if cannot find review", async function () {
          try {
            await Review.like(0, "u2");
          }  catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
          }
      });

      test("should fail if cannot find username", async function () {
        try {
          await Review.like(10000, "nope");
        }  catch (err) {
          expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
  });

  /************************************** unlikeBook */
  describe('unlikeBook method', () => {
    test("should unlike review", async function () {
        const reviewLikeCount = await Review.getReviewLikeCount(10000);
        expect(reviewLikeCount).toEqual([ { reviewLikeCount: '1' } ]);

        const review = await Review.unlike(10000, "u1");
        expect(review).toEqual(10000);
        
        const newLikeCount = await Review.getReviewLikeCount(10000);
        expect(newLikeCount).toEqual([ { reviewLikeCount: '0' } ]);
    });

    test("should fail if cannot find review", async function () {
        try {
          await Review.unlike(0, "u1");
        }  catch (err) {
          expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("should fail if cannot find username", async function () {
        try {
            await Review.unlike(10000, "nope");
        }  catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

  });
});
