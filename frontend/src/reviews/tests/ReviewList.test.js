import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import ReviewList from '../ReviewList';
import BookClubApi from '../../api';
import * as router from 'react-router'

const navigate = jest.fn()

const mockReviews = [{
    reviewId: 1,
    review: "Review 1",
    date: "12/18/2023",
    username: "Test1", 
    userImg: "UserImg1",
    book_id: 1,
    title: 'Book 1',
    cover: 'Cover 1',
    author: 'Author 1',
    category: 'Category 1',
    reviewLikeCount: 2
}, 
{
    reviewId: 2,
    review: "Review 2",
    date: "12/18/2023",
    username: "Test2", 
    userImg: "UserImg2",
    book_id: 1,
    title: 'Book 1',
    cover: 'Cover 1',
    author: 'Author 1',
    category: 'Category 1',
    reviewLikeCount: 2
}]

beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
})

jest.mock("../../api", () => ({
    __esModule: true,
    default: {
        getAllReviews: jest.fn(),
    },
}));

afterEach(() => {
    jest.clearAllMocks();
});

test('renders without crashing', async () => {
    BookClubApi.getAllReviews.mockImplementationOnce(() => (mockReviews));
  
    await act(async () => {
      render(
        <MemoryRouter>
          <UserProvider>
            <ReviewList />
          </UserProvider>
        </MemoryRouter>
      );
    });
  
});

test('it renders and matches with snapshot', async () => {
    BookClubApi.getAllReviews.mockImplementationOnce(() => (mockReviews));
  
    await act(async () => {
      ({ asFragment, getByTestId } = render(
        <MemoryRouter>
          <UserProvider>
            <ReviewList />
          </UserProvider>
        </MemoryRouter>
      ));
    });
  
    expect(asFragment()).toMatchSnapshot();
    
    const reviewAdd = getByTestId("add-review-button")
    fireEvent.click(reviewAdd);
    
    await waitFor(() => {
        expect(asFragment()).toMatchSnapshot();
    });
});
  
test('renders mock data', async () => {
    BookClubApi.getAllReviews.mockImplementationOnce(() => (mockReviews));
  
    await act(async () => {
      ({ getByText, getByTestId, queryByLabelText } = render(
        <MemoryRouter>
          <UserProvider>
            <ReviewList />
          </UserProvider>
        </MemoryRouter>
      ));
    });
  
    expect(getByText("Review 1")).toBeInTheDocument()
    expect(getByTestId("add-review-button")).toBeInTheDocument()
    expect(queryByLabelText("Add a Review")).not.toBeInTheDocument()

    const reviewAdd = getByTestId("add-review-button")
    fireEvent.click(reviewAdd);
    
    // await waitFor(() => {
    //     expect(queryByLabelText("Add a Review")).toBeInTheDocument()
    // });

});

test('search redirects to the correct route', async () => {
    BookClubApi.getAllReviews.mockImplementationOnce(() => (mockReviews));
  
    await act(async () => {
      ({ getByPlaceholderText } = render(
        <MemoryRouter>
          <UserProvider>
            <ReviewList />
          </UserProvider>
        </MemoryRouter>
      ));
    });
  
    const filterInput = getByPlaceholderText('Book title');
    fireEvent.change(filterInput, { target: { value: 'Harry' } });
    fireEvent.submit(filterInput);
    expect(navigate).toHaveBeenCalledWith('/reviews/filter?&title=Harry');
});
 
test('when Api call throws error, handles error', async () => {
    BookClubApi.getAllReviews.mockImplementationOnce(() => {
      throw new Error("API error");
    })
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mocking console.error to avoid error message in test output
  
    await act(async () => {
        ({ getByText } = render(
          <MemoryRouter>
            <UserProvider>
              <ReviewList />
            </UserProvider>
          </MemoryRouter>
        ));
      });  
  
    await waitFor(() => {});
    expect(getByText("An error occurred while fetching reviews.")).toBeInTheDocument()
    console.error.mockRestore(); 
  });
  