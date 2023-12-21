import { render, cleanup } from "@testing-library/react";
import BookRoutes from "./BookRoutes";
import { MemoryRouter } from "react-router";
import { UserProvider, NonUserProvider } from "../testUtilities";


jest.mock("../api", () => ({
  __esModule: true,
  default: {
    getUser: jest.fn(),
    registerUser: jest.fn(),
    loginUser: jest.fn(),
    unlikeReview: jest.fn(),
    likeReview: jest.fn(),
    sendBookReview: jest.fn(),
    deleteBookReview: jest.fn(),
    unlikeBook: jest.fn(),
    likeBook: jest.fn(),
    unfollowUser: jest.fn(),
    followUser: jest.fn(),
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

test("renders without crashing", function () {
  render(
      <MemoryRouter>
        <UserProvider>
          <BookRoutes />
        </UserProvider>
      </MemoryRouter>,
  );
});

test("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <UserProvider>
          <BookRoutes />
        </UserProvider>
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

test("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <NonUserProvider>
          <BookRoutes />
        </NonUserProvider>
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
