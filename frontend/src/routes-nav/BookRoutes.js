// Routes.js
import React from "react";
import { Route, Routes, Navigate  } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../homepage/Home";
import BookList from "../books/BookList";
import BookSearchList from "../books/BookSearchList";
import BookDetail from "../books/BookDetail";
import ReviewList from "../reviews/ReviewList";
import ReviewFilterList from "../reviews/ReviewFilterList";
import Profile from "../profile/Profile";
import LoginForm from "../profile/LoginForm";
import SignupForm from "../profile/SignupForm";

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
        <Route element={<ProtectedRoute/>}>
          <Route path="/books" element={<BookList />} />
          <Route path="/books/search" element={<BookSearchList />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/reviews" element={<ReviewList />} />
          <Route path="/reviews/filter" element={<ReviewFilterList />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>
        <Route path="/login" element={<LoginForm login={login} />} />
        <Route path="/signup" element={<SignupForm signup={signup} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default BookRoutes;
