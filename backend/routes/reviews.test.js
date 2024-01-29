/** Review Routes Tests with API call mocking*/
"use strict";

const request = require("supertest");
const app = require("../app");
const Book = require("../models/book")
const Review = require("../models/review")

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

    /************************************** POST /reviews/add/users/:username */
    describe("POST /reviews/add/users/:username ", function () {
        test("should add review", async function () {
            const resp = await request(app)
            .post("/reviews/add/users/u2")
                .send({
                    book: {
                        id: '1',
                        title: 'Book1',
                        author: 'Author1',
                        publisher: 'Publisher1',
                        description: 'Description1',
                        category: 'Category1',
                        cover: 'Cover1',
                    },
                    review: "Review"
                })
                .set("authorization", `User Token ${u2Token}`);
            expect(resp.body).toEqual({
                    review: {
                        id: expect.any(Number), 
                        username: 'u2',
                        book_id: '1', 
                        review: 'Review',
                        date: expect.any(String),
                    }
            });
        });

        test("should add review and book data if the book is not in db already", async function () {
            let book = await Book.getBookById('New Book')
            expect(book.length).toEqual(0)
            const resp = await request(app)
            .post("/reviews/add/users/u2")
                .send({
                    book: {
                        id: 'New Book',
                        title: 'Book',
                        author: 'Author',
                        publisher: 'Publisher',
                        description: 'Description',
                        category: 'Category',
                        cover: 'Cover',
                    },
                    review: "Review"
                })
                .set("authorization", `User Token ${u2Token}`);
            expect(resp.body).toEqual({
                    review: {
                        id: expect.any(Number), 
                        username: 'u2',
                        book_id: 'New Book', 
                        review: 'Review',
                        date: expect.any(String),
                    }
            });
            book = await Book.getBookById('New Book')
            expect(book[0].id).toEqual('New Book')
        });
        
        test("should fail without correct username", async function () {
          const resp = await request(app)
          .post("/reviews/add/users/u2")
            .send({
                book: {
                    id: '1',
                    title: 'Book1',
                    author: 'Author1',
                    publisher: 'Publisher1',
                    description: 'Description1',
                    category: 'Category1',
                    cover: 'Cover1',
                },
                review: "Review"
            })
          .set("authorization", `User Token ${u1Token}`);
          expect(resp.statusCode).toEqual(401);
        });

        test("should fail without neccessary review data", async function () {
            const resp = await request(app)
            .post("/reviews/add/users/u2")
                .send({
                    book: {
                        id: '1',
                        title: 'Book1',
                        author: 'Author1',
                        publisher: 'Publisher1',
                        description: 'Description1',
                        category: 'Category1',
                        cover: 'Cover1',
                    }
                })
                .set("authorization", `User Token ${u2Token}`);
            expect(resp.statusCode).toEqual(400);
        });
        
        test("should fail without neccessary book data", async function () {
          const resp = await request(app)
          .post("/reviews/add/users/u2")
            .send({
                book: {
                    id: '1',
                    author: 'Author1',
                    publisher: 'Publisher1',
                    description: 'Description1',
                    category: 'Category1',
                    cover: 'Cover1',
                  },
                review: "Review"
            })
            .set("authorization", `User Token ${u2Token}`);
          expect(resp.statusCode).toEqual(400);
        });
        
        test("should fail for anon", async function () {
          const resp = await request(app)
          .post("/reviews/add/users/u2")
            .send({
                book: {
                    id: '1',
                    title: 'Book1',
                    author: 'Author1',
                    publisher: 'Publisher1',
                    description: 'Description1',
                    category: 'Category1',
                    cover: 'Cover1',
                },
                review: "Review"
          })
          expect(resp.statusCode).toEqual(401);
        });
    });
    
    /************************************** DELETE /reviews/:id/users/:username */
    describe("DELETE /reviews/:id/users/:username", function () {
        test("should delete review", async function () {
            const resp = await request(app)
            .delete(`/reviews/${review1}/users/u1`)
             .set("authorization", `User Token ${u1Token}`);
            expect(resp.body).toEqual({
                    deleted: `${review1}`
            });
        });
        
        test("should fail without correct username", async function () {
          const resp = await request(app)
            .delete(`/reviews/${review1}/users/nope`)
            .set("authorization", `User Token ${u1Token}`);
          expect(resp.statusCode).toEqual(401);
        });
        
        test("should fail without auth", async function () {
            const resp = await request(app)
              .delete(`/reviews/${review1}/users/u2`)
              .set("authorization", `User Token ${u1Token}`);
            expect(resp.statusCode).toEqual(401);
        });
          
        test("should fail without correct review id", async function () {
          const resp = await request(app)
            .delete(`/reviews/nope/books/nope/users/u1`)
            .set("authorization", `User Token ${u1Token}`);
          expect(resp.statusCode).toEqual(404);
        });
        
        test("should fail for anon", async function () {
          const resp = await request(app)
            .delete(`/reviews/${review1}/users/u1`);
          expect(resp.statusCode).toEqual(401);
        });
    });

    /************************************** GET /reviews */
    describe("GET /reviews", function () {
        test("should return all reviews", async function () {
            const resp = await request(app)
            .get(`/reviews/1`)
                .set("authorization", `User Token ${u1Token}`);
            expect(resp.body).toEqual({
                  reviews: [
                    {
                      reviewId: expect.any(Number), 
                      review: 'Review3',
                      username: 'u1',
                      userImg: "img1",
                      date: expect.any(String),
                      book_id: '2',
                      title: 'Book2',
                      cover: 'Cover2',
                      author: 'Author2',
                      category: 'Category 2',
                      reviewLikeCount: '0'
                    },
                    {
                      reviewId: expect.any(Number),
                      review: 'Review2',
                      username: 'u2',
                      userImg: "img2",
                      date: expect.any(String),
                      book_id: '1',
                      title: 'Book1',
                      cover: 'Cover1',
                      author: 'Author1',
                      category: 'Category 1',
                      reviewLikeCount: '1'
                    },
                    {
                      reviewId: expect.any(Number),
                      review: 'Review1',
                      username: 'u1',
                      userImg: "img1",
                      date: expect.any(String),
                      book_id: '1',
                      title: 'Book1',
                      cover: 'Cover1',
                      author: 'Author1',
                      category: 'Category 1',
                      reviewLikeCount: '2'
                    }
                  ]
            });
        });
        
        test("should filter reviews and sorts", async function () {
            const resp = await request(app)
                .get(`/reviews/1`)
                    .query({
                        title: "1",
                        author: "1",
                        category: "1",
                        sortBy: "popular"
                    })
                    .set("authorization", `User Token ${u1Token}`);
            expect(resp.body).toEqual({
                reviews: [
                    {
                        reviewId: expect.any(Number),
                        review: 'Review1',
                        username: 'u1',
                        userImg: "img1",
                        date: expect.any(String),
                        book_id: '1',
                        title: 'Book1',
                        cover: 'Cover1',
                        author: 'Author1',
                        category: 'Category 1',
                        reviewLikeCount: '2'
                    },
                    {
                    reviewId: expect.any(Number),
                    review: 'Review2',
                    username: 'u2',
                    userImg: "img2",
                    date: expect.any(String),
                    book_id: '1',
                    title: 'Book1',
                    cover: 'Cover1',
                    author: 'Author1',
                    category: 'Category 1',
                    reviewLikeCount: '1'
                    }
                ]
            });
        });

        test("can only filter valid criterias", async function () {
            const resp = await request(app)
                .get(`/reviews/1`)
                    .query({
                        nope: 1
                    })
                    .set("authorization", `User Token ${u1Token}`);
            expect(resp.statusCode).toEqual(400);
        });
        
        test("should fail without auth", async function () {
            const resp = await request(app)
                .get(`/reviews/1`)
            expect(resp.statusCode).toEqual(401);
        });
    });

     /************************************** GET /reviews/books/:id */
     describe("GET /reviews/books/:id", function () {
        test("should return all reviews on a given book", async function () {
            const resp = await request(app)
            .get(`/reviews/books/1`)
                .set("authorization", `User Token ${u1Token}`);
            expect(resp.body).toEqual({
                reviews: [
                    {
                      reviewId: expect.any(Number),
                      review: 'Review1',
                      username: 'u1',
                      userImg: "img1",
                      date: expect.any(String),
                      book_id: '1',
                      reviewLikeCount: '2'
                    },
                    {
                      reviewId: expect.any(Number),
                      review: 'Review2',
                      username: 'u2',
                      userImg: "img2",
                      date: expect.any(String),
                      book_id: '1',
                      reviewLikeCount: '1'
                    }
                  ]
            });
        });

        test("should return all reviews on a given book with sorting", async function () {
            const resp = await request(app)
            .get(`/reviews/books/1`)
                .query({
                    sortBy: "popular"
                })
                .set("authorization", `User Token ${u1Token}`);
            expect(resp.body).toEqual({
                reviews: [
                    {
                      reviewId: expect.any(Number),
                      review: 'Review1',
                      username: 'u1',
                      date: expect.any(String),
                      book_id: '1',
                      userImg: "img1",
                      reviewLikeCount: '2'
                    },
                    {
                      reviewId: expect.any(Number),
                      review: 'Review2',
                      username: 'u2',
                      date: expect.any(String),
                      book_id: '1',
                      userImg: "img2",
                      reviewLikeCount: '1'
                    },
                  ]
            });
        });
        
        test("should return all reviews on a given book with filters", async function () {
            const resp = await request(app)
            .get(`/reviews/books/1`)
                .query({
                    username: "u1"
                })
                .set("authorization", `User Token ${u1Token}`);
            expect(resp.body).toEqual({
                reviews: [
                    {
                      reviewId: expect.any(Number),
                      review: 'Review1',
                      username: 'u1',
                      date: expect.any(String),
                      book_id: '1',
                      userImg: "img1",
                      reviewLikeCount: '2'
                    }
                  ]
            });
        });

        test("can only filter valid key", async function () {
            const resp = await request(app)
                .get(`/reviews/books/1`)
                    .query({
                        nope: 1
                    })
                    .set("authorization", `User Token ${u1Token}`);
            expect(resp.statusCode).toEqual(400);
        });
        
        test("should fail without auth", async function () {
            const resp = await request(app)
                .get(`/reviews/books/1`)
            expect(resp.statusCode).toEqual(401);
        });
    });

    /************************************** POST /reviews/like/:id/users/:username */
    describe("POST /reviews/like/:id/users/:username", function () {
        test("should add like to review", async function () {
            let reviewLikeCount = await Review.getReviewLikeCount(review2);
            expect(reviewLikeCount).toEqual([{ reviewLikeCount: '1' }])
            const resp = await request(app)
            .post(`/reviews/like/${review2}/users/u2`)
              .set("authorization", `User Token ${u2Token}`);
            expect(resp.body).toEqual({
                    likedReview: expect.any(Number),
            });
            reviewLikeCount = await Review.getReviewLikeCount(review2);
            expect(reviewLikeCount).toEqual([{ reviewLikeCount: '2' }])
        });
        
        test("should fail without correct username", async function () {
          const resp = await request(app)
            .post(`/reviews/like/${review2}/users/nope`)
              .set("authorization", `User Token ${u2Token}`);
          expect(resp.statusCode).toEqual(401);
        });
        
        test("should fail without a valid review id", async function () {
          const resp = await request(app)
            .post(`/reviews/like/0/users/u2`)
              .set("authorization", `User Token ${u2Token}`);
          expect(resp.statusCode).toEqual(404);
        });
        
        test("should fail for anon", async function () {
          const resp = await request(app)
            .post(`/reviews/like/${review2}/users/u1`)
          expect(resp.statusCode).toEqual(401);
        });

        test("should fail for incorrect", async function () {
          const resp = await request(app)
            .post(`/reviews/like/${review2}/users/u2`)
              .set("authorization", `User Token ${u1Token}`);
          expect(resp.statusCode).toEqual(401);
        });
    });
    
    /************************************** DELETE /reviews/like/:id/users/:username */
    describe("DELETE /reviews/like/:id/users/:username", function () {
        test("should remove book from user's liked list", async function () {
            let reviewLikeCount = await Review.getReviewLikeCount(review2);
            expect(reviewLikeCount).toEqual([{ reviewLikeCount: '1' }])
            const resp = await request(app)
            .delete(`/reviews/like/${review2}/users/u1`)
              .set("authorization", `User Token ${u1Token}`);
            expect(resp.body).toEqual({
                    unlikedReview: review2
            });
            reviewLikeCount = await Review.getReviewLikeCount(review2);
            expect(reviewLikeCount).toEqual([{ reviewLikeCount: '0' }])
        });
        
        test("should fail without correct username", async function () {
          const resp = await request(app)
            .delete("/reviews/like/${review2}/users/nope")
             .set("authorization", `User Token ${u1Token}`);
          expect(resp.statusCode).toEqual(401);
        });
        
        test("should fail without a valid review id", async function () {
            const resp = await request(app)
              .delete(`/reviews/like/0/users/u1`)
               .set("authorization", `User Token ${u1Token}`);
            expect(resp.statusCode).toEqual(404);
        });
          
        test("should fail for anon", async function () {
          const resp = await request(app)
            .delete(`/reviews/like/${review2}/users/u1`)
          expect(resp.statusCode).toEqual(401);
        });
        
        test("should fail for incorrect", async function () {
          const resp = await request(app)
            .delete(`/reviews/like/${review2}/users/u1`)
             .set("authorization", `User Token ${u2Token}`);
          expect(resp.statusCode).toEqual(401);
        });
    });
});
