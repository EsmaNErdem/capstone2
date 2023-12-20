import React from "react";
import UserContext from "./auth/UserContext";

const demoUser = {
  username: "testuser",
  firstNsme: "testfirst",
  lastName: "testlast",
  email: "test@test.net",
  img: null,
};

const UserProvider =
    ({ children, currentUser = demoUser, hasLikedReview = () => false, hasLikedBook = () => false, isUserReview = () => false, hasFollowing = () => false, setCurrentUser = u => u }) => (
    <UserContext.Provider value={{ currentUser, hasLikedReview, hasLikedBook, hasFollowing, setCurrentUser, isUserReview }}>
      {children}
    </UserContext.Provider>
);

const CurrUserProvider =
    ({ children, currentUser = demoUser, hasLikedReview = () => false, hasLikedBook = () => false, isUserReview = () => true, hasFollowing = () => false, setCurrentUser = u => u }) => (
    <UserContext.Provider value={{ currentUser, hasLikedReview, hasLikedBook, hasFollowing, setCurrentUser, isUserReview }}>
      {children}
    </UserContext.Provider>
);

const NonUserProvider =
    ({ children, currentUser = null, hasLikedReview = () => false, hasLikedBook = () => false, hasFollowing = () => false }) => (
    <UserContext.Provider value={{ currentUser, hasLikedReview, hasLikedBook, hasFollowing,}}>
      {children}
    </UserContext.Provider>
);

export { UserProvider, CurrUserProvider, NonUserProvider };
