-- all test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, img, email)
VALUES ('testuser1',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test1',
        'User1',
        'testimg1',
        'testuser1@email.com'),
       ('testuser2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test2',
        'User2',
        'testimg2',
        'testuser2@email.com'),
        ('testuser3',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test3',
        'User3',
        'testimg3',
        'testuser3@email.com'),
        ('testuser4',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test4',
        'User4',
        'testimg4',
        'testuser4@email.com');

-- need insert some book data, book likes, book reviews, review likes, bookself, booklist

INSERT INTO books (id, title, author, publisher, description, category, cover)
    VALUES ('1', 'Book1', 'Author1', 'Publisher1', 'Description1', 'Category1', 'Cover1'),
           ('2', 'Book2', 'Author2', 'Publisher2', 'Description2', 'Category2', 'Cover2');
  
INSERT INTO reviews (id, username, book_id, review)
    VALUES (1, 'testuser3', '1', 'Review1'),
           (2, 'testuser1', '2', 'Review2'),
           (3, 'testuser2', '1', 'Review3');

             
INSERT INTO review_likes (username, review_id)
    VALUES ('testuser1', 1),
           ('testuser1', 2),
           ('testuser2', 2),
           ('testuser3', 2),
           ('testuser4', 2),
           ('testuser2', 1);
           
INSERT INTO book_likes (username, book_id)
    VALUES ('testuser1', '1'),
           ('testuser1', '2'),
           ('testuser3', '2'),
           ('testuser2', '2');

  