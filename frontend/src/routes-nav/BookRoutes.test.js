import { render, cleanup } from "@testing-library/react";
import BookRoutes from "./BookRoutes";
import { MemoryRouter } from "react-router";
import { UserProvider, NonUserProvider } from "../testUtils";

jest.mock('../api');
afterEach(cleanup);

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
