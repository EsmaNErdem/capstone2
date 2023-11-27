\echo 'Delete and recreate book_club db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE book_club;
CREATE DATABASE book_club;
\connect book_club

\i book_club-schema.sql
\i book_club-seed.sql

\echo 'Delete and recreate book_club_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE book_club_test;
CREATE DATABASE book_club_test;
\connect book_club_test

\i book_club-schema.sql