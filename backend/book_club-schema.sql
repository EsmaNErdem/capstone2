CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  img TEXT DEFAULT '../static/user-profile.jpg',
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

CREATE TABLE followers (
  following TEXT REFERENCES users(username) ON DELETE CASCADE,
  followed_by TEXT REFERENCES users(username) ON DELETE CASCADE,
  PRIMARY KEY (following, followed_by)
);

CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE room_members (
  room INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
  username TEXT REFERENCES users(username) ON DELETE CASCADE,
  PRIMARY KEY (room, username),
  UNIQUE (room, username)

);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  room INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
  username TEXT REFERENCES users(username) ON DELETE CASCADE,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- Users
-- -
-- Username  PK string
-- FirstName string
-- LastName string
-- Email string
-- Img string
-- Password

-- Books
-- ------------
-- BookID PK int
-- Title string
-- Author string
-- Publisher string
-- Description string
-- Category string
-- Cover string

-- BookLikes
-- ----
-- Username string FK >- Users.Username PK
-- BookID int FK >- Books.BookID PK

-- Reviews
-- ----
-- ReviewID PK int
-- Username string FK >- Users.Username
-- BookID int FK >- Books.BookID
-- Review text 
-- Created_At time

-- ReviewLikes
-- ----
-- Username string FK >- Users.Username PK
-- ReviewsID int FK >- Reviews.ReviewID PK

-- Followerr
-- ----
-- Following string FK >- Users.Username PK
-- Followed_By string FK >- Users.Username PK