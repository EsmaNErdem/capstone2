-- all test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, img, email)
VALUES ('BookMasterFlex',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test1',
        'User1',
        COALESCE(null, '../static/user-profile.jpg'), 
        'testuser1@email.com'),
       ('TheeBookWorm',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test2',
        'User2',
        COALESCE(null, '../static/user-profile.jpg'), 
        'testuser2@email.com'),
        ('MoseBeetsBooks',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test3',
        'User3',
        COALESCE(null, '../static/user-profile.jpg'), 
        'testuser3@email.com'),
        ('TurningPejaStojakovic',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test4',
        'User4',
        COALESCE(null, '../static/user-profile.jpg'), 
        'testuser4@email.com');

INSERT INTO books (id, title, author, publisher, description, category, cover)
    VALUES ('U2ioPwAACAAJ', 'The Kite Runner', 'Khaled Hosseini', null, 'Traces the unlikely friendship of a wealthy Afghan youth and a servant''s son in a tale that spans the final days of Afghanistan''s monarchy through the atrocities of the present day.', 'Afghanistan', 'http://books.google.com/books/content?id=U2ioPwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'),
           ('MbW3_eSDGl4C', 'Interview with the Vampire', 'Anne Rice', 'Ballantine Books', 'The spellbinding classic that started it all, from the #1 New York Times bestselling author—the inspiration for the hit television series “A magnificent, compulsively readable thriller . . . Rice begins where Bram Stoker and the Hollywood ...', 'Fiction', 'http://books.google.com/books/content?id=MbW3_eSDGl4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'),
           ('0E1rAQAACAAJ', 'Holes', 'Louis Sachar', 'Bloomsbury Publishing', 'Stanley Yelnat''s family has a history of bad luck, so he is not too surprised when a miscarriage of justice sends him to a detention centre. As punishment the boys must dig a hole each day. The warden claims it''s character building but Stanley ...', 'Airplane crash survival', 'http://books.google.com/books/content?id=0E1rAQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'),
           ('iVCNDQAAQBAJ', 'Eragon', 'Christopher Paolini', 'Knopf Books for Young Readers', 'In Alagaèesia, a fifteen-year-old boy of unknown lineage called Eragon finds a mysterious stone that weaves his life into an intricate tapestry of destiny, magic, and power, peopled with dragons, elves, and monsters.', 'Fiction', 'http://books.google.com/books/content?id=iVCNDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'),
           ('hbZ0Yfz-NG8C', 'The Da Vinci Code', 'Dan Brown', 'Anchor', '#1 WORLDWIDE BESTSELLER • While in Paris, Harvard symbologist Robert Langdon is awakened by a phone call in the dead of the night. The elderly curator of the Louvre has been murdered inside the museum, his body covered in baffling symbols ...', 'Fiction', 'http://books.google.com/books/content?id=hbZ0Yfz-NG8C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_apier'),
           ('ibi2CwAAQBAJ', 'A Man Called Ove', 'Fredrik Backman', 'Noura Books', 'Sebelum terlibat lebih jauh dengannya, biar kuberi tahu. Lelaki bernama Ove ini mungkin bukan tipemu. Ove bukan tipe lelaki yang menuliskan puisi cinta atau menyanyikan lagu saat kencan pertama. Dia juga bukan tetangga yang akan menyambutmu di ...', 'cateJuvenile Fictiongory', 'http://books.google.com/books/content?id=ibi2CwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_apir'),
           ('O3PZCwAAQBAJ', 'The Secret Life of Bees', 'Sue Monk Kidd', 'Penguin Books', 'After her mother''s death, Lily Owens and her African-American maid seek refuge from the racism of their South Carolina hometown with eccentric beekeeping sisters in this coming of age story representing the letter “K” in a new series of twenty ...', 'Fiction', 'http://books.google.com/books/content?id=O3PZCwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'),
           ('cYCkmu5sq8EC', 'Frog and Toad Are Friends', 'Arnold Lobel', 'Harper Collins', 'One summer day Toad was unhappy. He had lost the white, fourholed, big, round, thick button from his jacket. Who helped him look for it? His best friend, Frog. Another day, Frog was unhappy. He was sick in bed and looking green. Who gave him some ...', 'Juvenile Fiction', 'http://books.google.com/books/content?id=cYCkmu5sq8EC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'),
           ('QxrGEAAAQBAJ', 'A Room with a View', 'E. M. Forster', 'Mustread Digital Books', '\"A Room with a View\" is a 1908 novel by English writer E. M. Forster, about a young woman in the restrained culture of Edwardian era England. The novel is both a romance and a humorous critique of English society at the beginning of the 20th century.', 'Fiction', 'http://books.google.com/books/content?id=QxrGEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'),
           ('80QVNQAACAAJ', 'Angela''s Ashes', 'Frank McCourt', 'SCHOLASTIC', 'Extensive reading improves fluency and there is a real need in the ELT classroom for motivating, contemporary graded material that will instantly appeal to students. Angela''s Ashes is based on the bestselling novel by Frank McCourt.', 'Children', 'http://books.google.com/books/content?id=p-2s2PWArTQC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'),
           ('p-2s2PWArTQC', 'The Boy in the Striped Pajamas', 'John Boyne', 'David Fickling Books', 'descTwo young boys encounter the best and worst of humanity during the Holocaust in this powerful read that USA Today called \"as memorable an introduction to the subject as The Diary of Anne Frank.” Berlin, 1942: When Bruno returns home from school ...ription', 'Young Adult Fiction', 'http://books.google.com/books/content?id=p-2s2PWArTQC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'),
           ('VdxNlZidgikC', 'I Know Why the Caged Bird Sings', 'Maya Angelou', 'Random House', 'Here is a book as joyous and painful, as mysterious and memorable, as childhood itself. I Know Why the Caged Bird Sings captures the longing of lonely children, the brute insult of bigotry, and the wonder of words that can make the world right ...', 'Biography & Autobiography', 'http://books.google.com/books/content?id=VdxNlZidgikC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api');
  
INSERT INTO reviews (id, username, book_id, review)
    VALUES (100000001, 'MoseBeetsBooks', 'U2ioPwAACAAJ', 'Excellent book from Khaled. It took me deep down to my childhood. How incicent we all once were. '),
           (100000002, 'BookMasterFlex', 'U2ioPwAACAAJ', 'Every page has a tear drop on it.'),
           (100000003, 'TheeBookWorm', 'MbW3_eSDGl4C', 'Very informative. One needs to think if you were a vampire, you would have done the same'),
           (100000004, 'TheeBookWorm', 'cYCkmu5sq8EC', 'A tale that really highlights the strength of friendship and love in spite of adversity and controversy. The fact that they could remain friends after all they know about and did to each other is inspiring, but somewhat disheartening. Toad needs to understand that Frog NEEDS water to survive, even if Frog''s attitude could use some adjusting. I''m still left feeling warm after that ending, though. '),
           (100000005, 'MoseBeetsBooks', '80QVNQAACAAJ', 'Under the pretext of receiving this under the festive Weihnachtsbaum from my cousin, I had believed this to be a biography of my cousin-in-law''s many cats past lives with the urns as character starting points. It wasn''t until farther than I''ll admit before realizing this was not a family historical account in the name of bonding. I''m no quiter, though. Proving to be a struggle at times, the book was well worth the read and made for a happy mistake that worked out great. I was inspired to ask about my cousin Angela''s cats, we''re closer than ever now!'),
           (100000006, 'TurningPejaStojakovic', '0E1rAQAACAAJ', 'It took forever once after the shovels were introduced. My arms kept getting to tired to read! Please invest in writing in excavators. '),
           (100000007, 'MoseBeetsBooks', '0E1rAQAACAAJ', 'Very comforting! I was missing the farm on vacation, so I picked this up at a library. Filled the void left from not planting beet seeds. '),
           (100000008, 'BookMasterFlex', '0E1rAQAACAAJ', 'Slightly less fun than roller blading. I give this book 9 packets of Taco Bell hot sauce out of 6 Shia LaBeoufs. '),
           (100000009, 'TheeBookWorm', '0E1rAQAACAAJ', 'A great inspiration and model to form lasting habits! I had a lawn once, but now I have SO many holes! Thank you, Sachar! I couldn''t have accomplished all this without you. '),
           (100000010, 'TurningPejaStojakovic', 'QxrGEAAAQBAJ', 'I thought this was about having friggin'' box seats for a b-ball game. I got a little culture, but still... GO SPORTS! '),
           (100000011, 'BookMasterFlex', 'iVCNDQAAQBAJ', 'Dragons are scary! Not as scary as the Loch Ness Monster. Got to the end of the book and wouldn''t you guess it? I was requisitioned to spare about $3.50. Obviously, the Loch Ness Monster uses the psuedonym Christopher Paolini. Stay vigilant, ya''ll. '),
           (100000012, 'TurningPejaStojakovic', 'hbZ0Yfz-NG8C', 'Just try and hide my gifts now! I''ll never be the other me, the me that played the fool! '),
           (100000013, 'TheeBookWorm', 'QxrGEAAAQBAJ', 'I once had a room with a view. I also once was a moose. Lucy is a character I think I could be friends with, who doesn''t just adore a juicy, sticky secret? '),
           (100000014, 'MoseBeetsBooks', 'QxrGEAAAQBAJ', 'Personally, a room with a window is too luxurious. I read this hoity-toity obsession with looking at mountains, or gardens or cemetaries or what have you. Not for me. '),
           (100000015, 'MoseBeetsBooks', 'O3PZCwAAQBAJ', 'As a beekeeper, my phone was overheard the bees buzzing and then suggested this book. Excellent read, pay attention. '),
           (100000016, 'MoseBeetsBooks', 'cYCkmu5sq8EC', 'Frog and Toad towed twenty-two tacos to twenty-two towns to trade ten tacos to tackle Tommy''s terrible tamborine troubles tomorrow. Toadally tubular, tome! '),
           (100000017, 'BookMasterFlex', 'cYCkmu5sq8EC', 'What a book! If this doesn''t get made into a AAA movie starring Tom Hanks as Frog and Matt Damon as Toad than a monumental opportunity has been missed! '),
           (100000018, 'TurningPejaStojakovic', 'VdxNlZidgikC', 'A powerful book that nobody should skip. Make your friends read this. '),
           (100000019, 'TheeBookWorm', '80QVNQAACAAJ', 'Quite a journey from beginning to end. You''re sucked into the drama and into the room with them everytime this literary classic decides to make you feel uncomfortable. I wouldn''t trade that discomfort if it meant trading the experience of this book. '),
        --    (100000020, 'TheeBookWorm', 'VdxNlZidgikC, 'Maya Angelou''s inner strength and perserverance are of the highest praise. What an incredible and incredibly difficult path. This book will surely move you.'),
           (100000021, 'TurningPejaStojakovic', 'ibi2CwAAQBAJ', 'Such a sad story... until it isn''t! Give this a read, see if it doesn''t change your outlook on life and the end of it. '),
           (100000022, 'BookMasterFlex', 'ibi2CwAAQBAJ', 'Loss isn''t easy. Having a strong circle can really make a difference when you''re trying to deal with life. '),
           (100000023, 'TheeBookWorm', 'ibi2CwAAQBAJ', 'There is always hope for a sunny, bright tomorrow! I sunk into this story like an Oreo into milk. I may end up reading this one again one day. '),
           (100000024, 'BookMasterFlex', 'p-2s2PWArTQC', 'Bruno sure had one unique perspective on life and friendship. Heartbreaking and eye-opening, keep the tissues within reach. '),
           (100000025, 'TurningPejaStojakovic', 'p-2s2PWArTQC', 'Bruno and Schmuel will keep a place in my heart all for themselves. '),
           (100000026, 'TheeBookWorm', 'p-2s2PWArTQC', 'After reading BookMasterFlex''s review and coincidentally coming across this book in a hotel, I cancelled my pool plans and finished this book in a single sitting, only looking up when my tissues had emptied to find more. Poor, innocent children. ');

INSERT INTO review_likes (username, review_id)
    VALUES ('MoseBeetsBooks', 100000001),
           ('MoseBeetsBooks', 100000002),
           ('TheeBookWorm', 100000002),
           ('MoseBeetsBooks', 100000005),
           ('BookMasterFlex', 100000021),
           ('TheeBookWorm', 100000009);
           
INSERT INTO book_likes (username, book_id)
    VALUES ('MoseBeetsBooks', 'U2ioPwAACAAJ'),
           ('MoseBeetsBooks', 'MbW3_eSDGl4C'),
           ('BookMasterFlex', 'U2ioPwAACAAJ'),
           ('TheeBookWorm', 'MbW3_eSDGl4C');

INSERT INTO followers (following, followed_by)
    VALUES ('MoseBeetsBooks', 'TheeBookWorm'),
           ('MoseBeetsBooks', 'TurningPejaStojakovic'),
           ('MoseBeetsBooks', 'BookMasterFlex'),
           ('BookMasterFlex', 'MoseBeetsBooks'),
           ('MoseBeetsBooks', 'MoseBeetsBooks'),
           ('TurningPejaStojakovic', 'TheeBookWorm');



  