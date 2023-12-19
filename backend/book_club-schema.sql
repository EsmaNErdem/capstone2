CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  img TEXT NOT NULL DEFAULT '../static/user-profile.jpg',
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1)
  -- email TEXT NOT NULL
  --   CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$')  -- Standard email validation regex
);

CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  publisher TEXT,
  description TEXT,
  category TEXT,
  cover TEXT
);

CREATE TABLE book_shelves (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users(username) ON DELETE CASCADE,
  title TEXT NOT NULL
);

CREATE TABLE book_lists (
  book_shelf_id INTEGER REFERENCES book_shelves(id) ON DELETE CASCADE,
  book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
  PRIMARY KEY (book_shelf_id, book_id)
);

CREATE TABLE book_likes (
  username TEXT REFERENCES users(username) ON DELETE CASCADE,
  book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
  PRIMARY KEY (username, book_id)
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users(username) ON DELETE CASCADE,
  book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
  review TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE review_likes (
  username TEXT REFERENCES users(username) ON DELETE CASCADE,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  PRIMARY KEY (username, review_id)
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