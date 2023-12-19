import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import BookDetail from '../BookDetail';
import BookClubApi from '../../api';

const mockBook = {
    id: '1',
    title: 'Book1',
    author: 'Author1',
    publisher: 'Publisher1',
    description: 'Description1',
    category: 'Category1',
    cover: 'Cover1',
    bookLikeCount: 5,
}

const mockReviews = [{
        reviewId: 1,
        review: "Review1",
        username: "Test1", 
        userImg: "UserImg1",
        date: "12/18/2023"
    }, 
    {
        reviewId: 2,
        review: "Review2",
        username: "Test2", 
        userImg: "UserImg2",
        date: "12/18/2023"
    }]

jest.mock("../../api", () => ({
    __esModule: true,
    default: {
        getBook: jest.fn(),
        getAllReviewsByBook: jest.fn(),
    },
}));

afterEach(() => {
jest.clearAllMocks();
});

  
test('renders without crashing', async () => {
    BookClubApi.getBook.mockImplementationOnce(() => (mockBook));
    BookClubApi.getAllReviewsByBook.mockImplementationOnce(() => (mockReviews));
  
    await act(async () => {
      render(
        <MemoryRouter>
          <UserProvider>
            <BookDetail />
          </UserProvider>
        </MemoryRouter>
      );
    });
  
  });
  
  test('it renders and matches with snapshot', async () => {
    BookClubApi.getBook.mockImplementationOnce(() => (mockBook));
    BookClubApi.getAllReviewsByBook.mockImplementationOnce(() => (mockReviews));

    await act(async () => {
      ({ asFragment, getByTestId } = render(
        <MemoryRouter>
          <UserProvider>
            <BookDetail />
          </UserProvider>
        </MemoryRouter>
      ));
    });
  
    expect(asFragment()).toMatchSnapshot();

    const reviewAdd = getByTestId("add-review-toggle")
    fireEvent.click(reviewAdd);
    
    await waitFor(() => {
        expect(asFragment()).toMatchSnapshot();
    });
    
});

test('displays book details and reviews', async () => {
    BookClubApi.getBook.mockImplementationOnce(() => (mockBook));
    BookClubApi.getAllReviewsByBook.mockImplementationOnce(() => (mockReviews));
    
    await act(async () => {
        ({ getByText, getByTestId, getAllByTestId, getByLabelText, queryByLabelText, getByPlaceholderText } = render(
            <MemoryRouter>
          <UserProvider>
            <BookDetail />
          </UserProvider>
        </MemoryRouter>
      ));
    });
    
    expect(getByText('Book1')).toBeInTheDocument();
    expect(getByText('Review1')).toBeInTheDocument();
    expect(getAllByTestId('like-button')[0]).toBeInTheDocument();
    expect(queryByLabelText('Add a Review')).not.toBeInTheDocument();
    
    const reviewAdd = getByTestId("add-review-toggle")
    fireEvent.click(reviewAdd);
    
    await waitFor(() => {
        expect(getByLabelText('Add a Review')).toBeInTheDocument();
    });
  
    expect(getByPlaceholderText('Review Owner')).toBeInTheDocument();
});
  
  