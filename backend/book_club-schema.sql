CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  img TEXT,
  email TEXT NOT NULL
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$')  -- Standard email validation regex
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  img_url TEXT NOT NULL,
  book_api_id TEXT NOT NULL UNIQUE
);

CREATE TABLE book_shelves (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
  title TEXT NOT NULL
);

CREATE TABLE book_lists (
  id SERIAL PRIMARY KEY,
  book_shelf_id INTEGER REFERENCES book_shelves(id) ON DELETE CASCADE,
  book_id INTEGER REFERENCES books(id) ON DELETE CASCADE
);

CREATE TABLE book_likes (
  username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
  book_id INTEGER REFERENCES books(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
  book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
  review TEXT NOT NULL
);
 
CREATE TABLE review_likes (
  username VARCHAR(25) REFERENCES users(username) ON DELETE CASCADE,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE
);


-- Users
-- -
-- Username  PK string
-- FirstName string
-- LastName string
-- Email string
-- Password

-- BookShelves
-- -
-- BookShelfID PK int
-- Username string FK >- Users.Username
-- Title string

-- BookLists
-- ----
-- BookListID PK int
-- BookShelfID int FK >- BookShelves.BookShelfID
-- BookID int FK >- Books.BookID

-- Books
-- ------------
-- BookID PK int
-- Title string
-- Author string
-- Img string

-- BookLikes
-- ----
-- Username string FK >- Users.Username
-- BookID int FK >- Books.BookID

-- ReviewLikes
-- ----
-- Username string FK >- Users.Username
-- ReviewsID int FK >- Reviews.ReviewID

-- Reviews
-- ----
-- ReviewID PK int
-- Review text 
-- Username string FK >- Users.Username
-- BookID int FK >- Books.BookID