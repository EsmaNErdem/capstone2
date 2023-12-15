import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../testUtilities";
import { render, cleanup, act, waitFor } from '@testing-library/react';
import BookList from './BookList';
import BookClubApi from '../api';

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

jest.mock("../api", () => ({
  __esModule: true,
  default: {
    getBookList:(() => (mockBooks)),
  },
}));

// jest.mock("../api");

afterEach(() => {
  jest.clearAllMocks();
});

test('renders without crashing', async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <BookList />
        </UserProvider>
      </MemoryRouter>
    );
  });

});

test('it renders and matches with snapshot', async () => {

  let asFragment;

  await act(async () => {
    ({ asFragment } = render(
      <MemoryRouter>
        <UserProvider>
          <BookList />
        </UserProvider>
      </MemoryRouter>
    ));
  });

  expect(asFragment()).toMatchSnapshot();
});


test('renders mock data', async () => {
  
    await act(async () => {
        ({ getByText } = render(
          <MemoryRouter>
            <UserProvider>
              <BookList />
            </UserProvider>
        </MemoryRouter>
      ));
    });
    
    expect(getByText("Description 1")).toBeInTheDocument()
  });
