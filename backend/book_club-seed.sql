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


