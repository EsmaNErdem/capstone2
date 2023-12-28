# Book Chat App

## Introduction

Welcome to the documentation of the Book Chat App. This project consists of a Node.js, Express, and PostgreSQL-based RESTful API for the backend and a React-based frontend. The application serves as a feature-rich book discussion platform, allowing users to explore, discuss, and engage with library of books from Google Book API.


## Key Features

- **External API Integration:** Utilize Axios to load book data from the Google Book API, enabling users to search and explore a vast library of books.

- **Relational Database and Validation:** Design a robust PostgreSQL database schema with JSON Schema validation for seamless data storage and retrieval.

- **User Authentication and Authorization:** Implement user registration, login, and JWT token-based authentication to secure routes and protect user data. For frontend validation, Formik is utilized to guide users through the login and signup processes, ensuring data integrity.

- **Browsing and Filtering Books:** Allow users to browse and filter books, view detailed information, like books, add reviews, and like reviews for user engagement. In the frontend, debouncing is implemented for book filter forms to enhance user experience and prevent unnecessary API calls.

- **Browsing and Filtering Book Reviews:** Enable users to browse book reviews, filter by various criteria, like reviews, and add their own book reviews. In the frontend, debouncing is implemented for book review filter forms to enhance user experience and prevent unnecessary API calls.

- **User Follow System:** Implement a user-follow system to enhance social interaction, allowing users to follow each other and view their followers and following lists.

- **App Flow:** To provide seamless follow, in the frontend, infinite scrolling is implemented to provide users with a seamless data browsing experience, allowing them to explore a vast library of books effortlessly.

- **Modularization and Code Reusability:** Use object classes to enhance code reusability, maintainability, and flexibility in adding new features.

- **Testing and Error Handling:** Thoroughly test each route and model method to ensure a bug-free user experience, and implement robust error handling mechanisms.


## Tech Stack

- Node.js/Express: The backend server is built using Node.js and the Express framework.

- PostgreSQL: PostgreSQL is used as a relational database to store and manage data efficiently.

- React: The frontend is built using the React library for building user interfaces.


## Getting Started

1. Clone the Project: Navigate to the directory where you want to clone the project and run:

```
git clone https://github.com/EsmaNErdem/BookChat-Backend.git
```

2. Install Backend Dependencies: Install the project dependencies using npm:

```
npm install
```

3. Creating book_club database and test database while seeding initial data:

```
psql
\i book_club.sql
```

4. Start the server by running:

```
node server.js
```
    
5. Run Backend Tests: To run the tests and ensure everything is working correctly, use Jest:

```
jest -i
```

6. Connecting frontend:
```
git clone https://github.com/EsmaNErdem/BookChat-Frontend.git
```

7. Install Frontend Dependencies: Install the project dependencies using npm:

```
npm install
```

8. Run Frontend Tests: To run the tests and ensure everything is working correctly:

```
npm test
```


## Database Schema:

![Database Schema](/static/bookclub-db.png)

### Entities

- **Users:** Registered users with a unique username, including additional details such as first name, last name, email, and profile image.

- **Books:** Information about available books, including title, author, publisher, description, category, and cover image.

- **BookLikes:** Tracks user likes for specific books, establishing preferences.

- **Reviews:** User-generated reviews for books, capturing review text, reviewer's username, book ID, and timestamp.

- **ReviewLikes:** Records user likes for individual reviews, creating connections between users and their liked reviews.

- **Followers:** Represents follower-followee relationships between users, indicating who is being followed by whom.

### Relationships

- **BookLikes:** Establishes a many-to-many relationship between users and books, indicating users' liked books.

- **Reviews:** Connects users, books, and reviews, linking each review to a specific user and book.

- **ReviewLikes:** Forms a many-to-many relationship between users and reviews, showing which users liked which reviews.

- **Followers:** Captures the follower-followee relationship between users, indicating who follows whom.