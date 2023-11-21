# CAPSTONE 2 PROPOSAL - THE BOOK CLUB
<!-- ## READ, DREAM, LOVE -->

### Goal:

The Book Club is a full-stack web app designed for book lovers of all ages. Addressing the struggle of discovering new books and engaging in meaningful discussions, this platform not only provides book details but also fosters interactions among users based on their reading preferences. Users can explore a vast collection of books, categorize them into 'wish-to-read' and 'read' lists, write reviews, and receive AI-generated book recommendations.

### Tech Stack:

- Database: PostgreSQL for data storage and execution of SQL queries.
- Backend: Node.js and Express for server-side development.
- Frontend: React for building the user interface.
- Documentation and Testing: Detailed documentation and extensive testing in both frontend and backend.

This website is evenly focused full-stack application. 

### Data Collection:

***The Book Club*** utilizes data from [Google Books API](https://developers.google.com/books) and [Open Library API](https://openlibrary.org/developers/api). APIs offer data about authors, books and book details. 

For AI-generated book recommendations, the OpenAI API is employed.

User-related data is stored in database using PostgreSQL. 

### Database Schema:

![Database Schema](/static/bookclub-db.png)

User data is securely stored in the database, with sensitive information like passwords hashed using Bcrypt and user tokens hashed using JSON Web Token. JSON Schema is used for validating incoming API data, ensuring data integrity while minimizing the risk of database errors.

### Protection against potential data flow issues:

Error handling is implemented throughout the web app using try and catch methods. High-quality, organized data is crucial, especially for an app relying on external API data. 

The Book Club database is designed to be normalized and organized, and incoming API data is validated to maintain data integrity.

### User Flow and Functionality:


![User Flow](/static/bookclub-userflow.png)

Users are welcomed with a friendly homepage encouraging sign-up or login. They can browse book lists, create their lists, comment on books, like comments, and view detailed book information, including reviews and ratings. User pages, profiles, and an explore page for AI-recommended books enhance the overall user experience.

User profile show user data, their book reviews and user made booklists. User can also view other users' profiles. 

### Strecth Goals:

- Adding a 'like' feature for comments.
- Implementing a user chat system.

## Further Ideas:

- Geographical filtering for book clubs. 
- Author pages showcasing author details and their books.
- Book-related fun activities, games, and story writing.

