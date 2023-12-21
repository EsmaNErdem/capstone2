"use strict";

const db = require("../db.js");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const User = require("./user.js")
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
  } = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** register */
describe("register", function () {
    const newUser = {
      username: "new",
      firstName: "Test",
      lastName: "Tester",
      email: "test@test.com",
      img: "testing"
    };
  
    test("works", async function () {
      let user = await User.register({
        ...newUser,
        password: "password"
      });
      expect(user).toEqual(newUser);
      const found = await db.query("SELECT * FROM users WHERE username = 'new'");
      expect(found.rows.length).toEqual(1);
      expect(found.rows[0].img).toEqual("testing");
      expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });
  
    test("bad request with dup data", async function () {
      try {
        await User.register({
          ...newUser,
          password: "password",
        });
        await User.register({
          ...newUser,
          password: "password",
        });
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
});
  

/************************************** authenticate */
describe("authenticate", function () {
    test("works", async function () {
      const user = await User.login({ username:"u1", password:"password1" });
      expect(user).toEqual({
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        img: "img1"
      });
    });
  
    test("unauth if no such user", async function () {
      try {
        await User.login({ username:"wrong", password:"password" });
        fail();
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      }
    });
  
    test("unauth if wrong password", async function () {
      try {
        await User.login({ username:"c1", password:"wrong" });
        fail();
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      }
    });
});

  /************************************** getUserReviews */
  describe("getUserReviews method", function () {
    test("should return list of reviews data of a user", async function () {
        const userReviews = await User.getUserReviews('u1', { sortBy: 'popular'});    
        expect(userReviews).toEqual([
          {
            reviewId: 20000,
            review: 'Review2',
            username: 'u1',
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

    test("should return list of reviews data of a user with partial filters", async function () {
      const userReviews = await User.getUserReviews('u1', { sortBy: "popular" });        
      expect(userReviews).toEqual(
      [
        {
          reviewId: 20000,
          review: 'Review2',
          username: 'u1',
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

    test("should return list of reviews data of a user with filters", async function () {
      const userReviews = await User.getUserReviews('u1', { title: "1", sortBy: "popular" });        
      expect(userReviews).toEqual(
      [
        {
            reviewId: 10000,
            review: 'Review1',
            username: 'u1',
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

    test("should return list of reviews data of a user", async function () {
        const userReviews = await User.getUserReviews('u2');     
        expect(userReviews).toEqual([]);
    });

    test("should fail if no user found with given username", async function () {
        try {
            await User.getUserReviews('nope'); 
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

  /************************************** getUserLikedBooks */
  describe("getUserLikedBooks method", function () {
    test("should return list of books data liked by user", async function () {
        const userLikedBooks = await User.getUserLikedBooks('u1', {sortBy: "title"});        
        expect(userLikedBooks).toEqual([
          {
            book_id: '1',
            title: 'Book 1',
            author: 'Author 1',
            publisher: 'Publisher 1',
            description: 'Description 1',
            category: 'Category 1',
            cover: 'Cover 1',
            bookLikeCount: '2'
          },
          {
            book_id: '2',
            title: 'Book 2',
            author: 'Author 2',
            publisher: 'Publisher 2',
            description: 'Description 2',
            category: 'Category 2',
            cover: 'Cover 2',
            bookLikeCount: '1'
          }
        ]);
    });

    test("should return list of books data liked by user with filters", async function () {
      const userLikedBooks = await User.getUserLikedBooks('u1', { title: "1", sortBy: "popular" });        
      expect(userLikedBooks).toEqual(      [
        {
          book_id: '1',
          title: 'Book 1',
          author: 'Author 1',
          publisher: 'Publisher 1',
          description: 'Description 1',
          category: 'Category 1',
          cover: 'Cover 1',
          bookLikeCount: '2'
        }
      ]);
    });

    test("should return list of books data liked by user with partial filters", async function () {
      const userLikedBooks = await User.getUserLikedBooks('u1', {  sortBy: "title" });
      expect(userLikedBooks).toEqual( [
        {
          book_id: '1',
          title: 'Book 1',
          author: 'Author 1',
          publisher: 'Publisher 1',
          description: 'Description 1',
          category: 'Category 1',
          cover: 'Cover 1',
          bookLikeCount: '2'
        },
        {
          book_id: '2',
          title: 'Book 2',
          author: 'Author 2',
          publisher: 'Publisher 2',
          description: 'Description 2',
          category: 'Category 2',
          cover: 'Cover 2',
          bookLikeCount: '1'
        }
      ]);
    });

    test("should return list of books data liked by user", async function () {
        const userLikedBooks = await User.getUserLikedBooks('u3');     
        expect(userLikedBooks).toEqual([]);
    });

    test("should fail if no user found with given username", async function () {
        try {
            await User.getUserLikedBooks('nope'); 
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

  /************************************** getUserLikedReviews */
  describe("getUserLikedReviews method", function () {
    test("should return list of reviews data liked user", async function () {
        const userLikedReviews = await User.getUserLikedReviews('u2');  
        expect(userLikedReviews).toEqual([
            {
                reviewId: 20000,
                review: 'Review2',
                username: 'u1',
                userImg: 'img1',
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

    test("should return list of reviews data liked by user with filters", async function () {
      const userLikedReviews = await User.getUserLikedReviews('u1', { title: "1" });        
      expect(userLikedReviews).toEqual([
          {
              reviewId: 10000,
              review: 'Review1',
              username: 'u1',
              userImg: 'img1',
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

    test("should return list of reviews data liked by user", async function () {
        const userLikedReviews = await User.getUserLikedReviews('u3');     
        expect(userLikedReviews).toEqual([]);
    });

    test("should fail if no user found with given username", async function () {
        try {
            await User.getUserLikedReviews('nope'); 
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});


    /************************************** getUserLikeCount */
    describe('getUserLikeCount method', () => {
      test("should return number of likes user recieved on their reviews", async function () {
          const reviewLikeCount = await User.getUserLikeCount('u1');
          expect(reviewLikeCount).toEqual([ { likeCount: '3' } ]);
      });

      test("should return [] review if user received no likes", async function () {
          const reviewLikeCount = await User.getUserLikeCount('u3');
          expect(reviewLikeCount).toEqual([]);
      });
});


/************************************** get */
describe("get", function () {
    test("works", async function () {
      let user = await User.get("u1");
      expect(user).toEqual({
        username: 'u1',
        firstName: 'U1F',
        lastName: 'U1L',
        img: 'img1',
        email: 'u1@email.com',
        reviews: [
          {
            reviewId: 10000,
            review: 'Review1',
            username: 'u1',
            date: expect.any(Date),
            book_id: '1',
            title: 'Book 1',
            cover: 'Cover 1',
            author: 'Author 1',
            category: 'Category 1',
            reviewLikeCount: '1'
          },
          {
            reviewId: 20000,
            review: 'Review2',
            username: 'u1',
            date: expect.any(Date),
            book_id: '2',
            title: 'Book 2',
            cover: 'Cover 2',
            author: 'Author 2',
            category: 'Category 2',
            reviewLikeCount: '2'
          }
        ],
        likedBooks: [
          {
            book_id: '1',
            title: 'Book 1',
            author: 'Author 1',
            publisher: 'Publisher 1',
            description: 'Description 1',
            category: 'Category 1',
            cover: 'Cover 1',
            bookLikeCount: '2'
          },
          {
            book_id: '2',
            title: 'Book 2',
            author: 'Author 2',
            publisher: 'Publisher 2',
            description: 'Description 2',
            category: 'Category 2',
            cover: 'Cover 2',
            bookLikeCount: '1'
          },
        ],
        likedReviews: [
          {
            reviewId: 10000,
            review: 'Review1',
            username: 'u1',
            userImg: 'img1',
            date: expect.any(Date),
            book_id: '1',
            title: 'Book 1',
            cover: 'Cover 1',
            author: 'Author 1',
            category: 'Category 1',
            reviewLikeCount: '1'
          },
          {
            reviewId: 20000,
            review: 'Review2',
            username: 'u1',
            userImg: 'img1',
            date: expect.any(Date),
            book_id: '2',
            title: 'Book 2',
            cover: 'Cover 2',
            author: 'Author 2',
            category: 'Category 2',
            reviewLikeCount: '2'
          }
        ],
        recievedLikeCount: [ { likeCount: '3' } ],
        followers: [],
        following: [{
          following: 'u2',
          userImg: 'img2',
        }]
      });
    });
  
    test("not found if no such user", async function () {
      try {
        await User.get("nope");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
});


/************************************** update */
describe("update", function () {
    const updateData = {
      firstName: "NewF",
      lastName: "NewF",
      email: "new@email.com",
      img: "New"
    };
  
    test("works", async function () {
      let user = await User.update("u1", updateData);
      expect(user).toEqual({
        username: "u1",
        ...updateData,
      });
    });
  
    test("works: set password", async function () {
      let user = await User.update("u1", {
        password: "new",
      });
      expect(user).toEqual({
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        img: "img1"
      });

      const updatedUser = await User.login({ username:"u1", password:"new" });
      expect(updatedUser).toEqual({
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com",
        img: "img1"
      });

    });
  
    test("not found if no such user", async function () {
      try {
        await User.update("nope", {
          firstName: "test",
        });
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  
    test("bad request if no data", async function () {
      expect.assertions(1);
      try {
        await User.update("c1", {});
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
});

/************************************** follow */
describe("follow", function () {
  test("works", async function () {
    let follow = await User.followUser("u1", "u2");
    expect(follow).toEqual({
      following: "u1",
      followedBy: "u2",
    });
  });

  test("fail if user is following already", async function () {
    try {
      await User.followUser("u2", "u1");
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
    }

  });

  test("not found if no such user", async function () {
    try {
      await User.followUser("nope", "u1");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("not found if no such user", async function () {
    try {
      await User.followUser("u2", "nope");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** unfollow */
describe("unfollow", function () {
  test("works", async function () {
    let unfollow = await User.unfollowUser("u2", "u1");
    expect(unfollow).toEqual({
      unfollowedBy: "u1",
    });
  });

  test("fails if it wasn't following before", async function () {
    try {
      await User.unfollowUser("u1", "u2");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("not found if no such user", async function () {
    try {
      await User.unfollowUser("nope", "u1");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("not found if no such user", async function () {
    try {
      await User.unfollowUser("u2", "nope");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** getUserFollowers */
describe("getUserFollowers", function () {
  test("works", async function () {
    let follower = await User.getUserFollowers( "u2");
    expect(follower).toEqual([
      {
        followedBy: "u1",
        userImg: 'img1'
      }
    ]);
  });

  test("works", async function () {
    let follower = await User.getUserFollowers( "u1");
    expect(follower).toEqual([]);
  });

  test("not found if no such user", async function () {
    try {
      await User.getUserFollowers("nope");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** getUserFollowing */
describe("getUserFollowing", function () {
  test("works", async function () {
    let following = await User.getUserFollowing( "u1");
    expect(following).toEqual([
      {
        following: "u2",
        userImg: 'img2'
      }
    ]);
  });

  test("works", async function () {
    let following = await User.getUserFollowing( "u2");
    expect(following).toEqual([]);
  });

  test("not found if no such user", async function () {
    try {
      await User.getUserFollowing("nope");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});