import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import BookSearchList from '../BookSearchList';
import BookClubApi from '../../api';
import * as router from 'react-router'

const navigate = jest.fn()

const mockBooks = [
  {
    id: 1,
    title: 'Book 1',
    author: 'Author 1',
    description: 'Description 1',
    publisher: 'Publisher 1',
    category: 'Category 1',
    cover: 'Cover 1',
    bookLikeCount: 5,
    reviews: [],
  },
  {
    id: 2,
    title: 'Book 2',
    author: 'Author 2',
    description: 'Description 2',
    publisher: 'Publisher 2',
    category: 'Category 2',
    cover: 'Cover 2',
    bookLikeCount: 10,
    reviews: [],
  },
];

beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

jest.mock("../../api", () => ({
  __esModule: true,
  default: {
    getSearchedBookResult: jest.fn(),
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

test('renders without crashing', async () => {
  BookClubApi.getSearchedBookResult.mockImplementationOnce(() => (mockBooks));

  await act(async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <BookSearchList />
        </UserProvider>
      </MemoryRouter>
    );
  });

});

test('it renders and matches with snapshot', async () => {
  BookClubApi.getSearchedBookResult.mockImplementationOnce(() => (mockBooks));

  await act(async () => {
    ({ asFragment } = render(
      <MemoryRouter>
        <UserProvider>
          <BookSearchList />
        </UserProvider>
      </MemoryRouter>
    ));
  });

  expect(asFragment()).toMatchSnapshot();
});

test('renders mock data', async () => {
  BookClubApi.getSearchedBookResult.mockImplementationOnce(() => (mockBooks));

  await act(async () => {
      ({ getByText } = render(
        <MemoryRouter>
          <UserProvider>
            <BookSearchList />
          </UserProvider>
      </MemoryRouter>
    ));
  });
  
  expect(getByText("Description 1")).toBeInTheDocument()
});

test('search redirects to the correct route', async () => {
  BookClubApi.getSearchedBookResult.mockImplementationOnce(() => (mockBooks));

  await act(async () => {
    ({ getByPlaceholderText } = render(
      <MemoryRouter>
        <UserProvider>
          <BookSearchList />
        </UserProvider>
    </MemoryRouter>
  ));
  });

  const searchInput = getByPlaceholderText('Book search');
  fireEvent.change(searchInput, { target: { value: 'Harry' } });
  fireEvent.submit(searchInput);
  expect(navigate).toHaveBeenCalledWith('/books/search?search=Harry');
  fireEvent.change(searchInput, { target: { value: 'Books' } });
  fireEvent.submit(searchInput);
  expect(navigate).toHaveBeenCalledWith('/books/search?search=Books');
});

test('when Api call throws error, handles error', async () => {
  BookClubApi.getSearchedBookResult.mockImplementationOnce(() => {
    throw new Error("API error");
  })
  jest.spyOn(console, 'error').mockImplementation(() => {}); // Mocking console.error to avoid error message in test output

  await act(async () => {
    ({ getByText } = render(
      <MemoryRouter>
        <UserProvider>
          <BookSearchList />
        </UserProvider>
      </MemoryRouter>
    ));
  });

  await waitFor(() => {});
  expect(getByText("Sorry, no results were found!")).toBeInTheDocument()
  console.error.mockRestore(); 
});
