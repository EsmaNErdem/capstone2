-- all test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, img, email)
VALUES ('testuser1',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test1',
        'User1',
        COALESCE(null, '../static/user-profile.jpg'), 
        'testuser1@email.com'),
       ('testuser2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test2',
        'User2',
        COALESCE(null, '../static/user-profile.jpg'), 
        'testuser2@email.com'),
        ('testuser3',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test3',
        'User3',
        COALESCE(null, '../static/user-profile.jpg'), 
        'testuser3@email.com'),
        ('testuser4',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test4',
        'User4',
        COALESCE(null, '../static/user-profile.jpg'), 
        'testuser4@email.com');

-- need insert some book data, book likes, book reviews, review likes, bookself, booklist

INSERT INTO books (id, title, author, publisher, description, category, cover)
    VALUES ('U2ioPwAACAAJ', 'The Kite Runner', 'Khaled Hosseini', null, 'Traces the unlikely friendship of a wealthy Afghan youth and a servant''s son in a tale that spans the final days of Afghanistan''s monarchy through the atrocities of the present day.', 'Afghanistan', 'http://books.google.com/books/content?id=U2ioPwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'),
           ('MbW3_eSDGl4C', 'Interview with the Vampire', 'Anne Rice', 'Ballantine Books', 'The spellbinding classic that started it all, from the #1 New York Times bestselling author—the inspiration for the hit television series “A magnificent, compulsively readable thriller . . . Rice begins where Bram Stoker and the Hollywood ...', 'Fiction', 'http://books.google.com/books/content?id=MbW3_eSDGl4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api');
  
INSERT INTO reviews (id, username, book_id, review)
    VALUES (1, 'testuser3', 'U2ioPwAACAAJ', 'Excellent book from Khaled. It took me deep down to my childhood. How incicent we all once were. '),
           (2, 'testuser1', 'U2ioPwAACAAJ', 'Every page has a tear drop on it.'),
           (3, 'testuser2', 'MbW3_eSDGl4C', 'Very informative. One needs to think if you were a vampire, you would have done the same');

             
INSERT INTO review_likes (username, review_id)
    VALUES ('testuser1', 1),
           ('testuser1', 2),
           ('testuser2', 2),
           ('testuser3', 2),
           ('testuser4', 2),
           ('testuser2', 1);
           
INSERT INTO book_likes (username, book_id)
    VALUES ('testuser1', 'U2ioPwAACAAJ'),
           ('testuser1', 'MbW3_eSDGl4C'),
           ('testuser3', 'U2ioPwAACAAJ'),
           ('testuser2', 'MbW3_eSDGl4C');

INSERT INTO followers (following, followed_by)
    VALUES ('testuser1', 'testuser2'),
           ('testuser1', 'testuser3'),
           ('testuser1', 'testuser4'),
           ('testuser2', 'testuser1'),
           ('testuser3', 'testuser1'),
           ('testuser3', 'testuser2');



  