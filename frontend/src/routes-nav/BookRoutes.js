// Routes.js
import React from "react";
import { Route, Routes, Navigate  } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../homepage/Home";
import BookList from "../books/BookList";
import BookSearchList from "../books/BookSearchList";
import BookDetail from "../books/BookDetail";
import ReviewList from "../reviews/ReviewList";
// import LoginForm from "../auth/LoginForm";
// import SignUpFormForm from "../auth/SignUpForm";
// import ProfileForm from "../profile/ProfileForm";

/** App routes.
 *
 * Parts of site should only be visitable when logged in. Those routes are
 * wrapped by <ProtectedRoute>, which is an authorization component.
 *
 * Visiting a non-existant route redirects to the homepage.
 */
const BookRoutes = ({ login, signup }) => {
  console.debug(
    "Routes",
    `login=${typeof login}`,
    `signup=${typeof signup}`,
  );

  return (
    <>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books" element={<BookList />} />
      <Route path="/books/search" element={<BookSearchList />} />
      <Route path="/books/:id" element={<BookDetail />} />
      <Route path="/reviews" element={<ReviewList />} />
      <Route path="/reviews/filter" element={<ReviewList />} />
      {/* <Route path="/login" element={<Home />} />
      <Route path="/signup" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} /> */}

      </Routes>
      {/* <ProtectedRoute element={<Home />} path="/reviews"/>
      <ProtectedRoute element={<BookList />} path="/books"/>
      <ProtectedRoute element={<BookSearchList />} path="/books/search"/>
      <ProtectedRoute element={<BookDetail />} path="/books/:id"/>
      <ProtectedRoute element={<Home />} path="/profile"/>
      <Navigate  to="/" /> */}
    </>
  );
};

export default BookRoutes;
