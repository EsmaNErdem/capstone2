import { render, cleanup } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";
import { MemoryRouter } from "react-router";
import { UserProvider, NonUserProvider } from "../testUtilities";

jest.mock('../api');
afterEach(cleanup);

test("renders without crashing", function () {
  render(
      <MemoryRouter>
        <UserProvider>
          <ProtectedRoute />
        </UserProvider>
      </MemoryRouter>,
  );
});

test("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <UserProvider>
          <ProtectedRoute />
        </UserProvider>
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

test("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <NonUserProvider>
          <ProtectedRoute />
        </NonUserProvider>
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

