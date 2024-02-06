import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider, CurrUserProvider } from "../../testUtilities";
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import ReviewCard from '../ReviewCard';
import * as useReviewLikeModule from '../../hooks/useReviewLike';
import * as useReviewDeleteModule from '../../hooks/useReviewDelete';

const review = {
    reviewId: 1,
    review: "Review 1",
    date: "12/18/2023",
    username: "Test1", 
    userImg: "UserImg1",
    book_id: "1",
    reviewLikeCount: 2

}

jest.mock("../../api", () => ({
    __esModule: true,
    default: {
        likeReview: jest.fn(),
        deleteBookReview: jest.fn(),
    },
}));

let handleLikeReviewMock;
let handleDeleteReviewMock;

beforeEach(() => {
  handleLikeReviewMock = jest.fn();
  handleDeleteReviewMock = jest.fn();

  jest.spyOn(useReviewLikeModule, 'default').mockImplementation(() => ({
    liked: false,
    likes: 2,
    error: null,
    handleLikeReview: handleLikeReviewMock,
  }));

  jest.spyOn(useReviewDeleteModule, 'default').mockImplementation(() => ({
    error: null,
    handleDeleteReviewMock: handleDeleteReviewMock,
  }));
});
  
afterEach(() => {
    jest.clearAllMocks();
});

test('renders without crashing', async () => {
    await act(async () => {
        render(
            <MemoryRouter>
                <UserProvider>
                    <ReviewCard />
                </UserProvider>
            </MemoryRouter>
        );
    });

});

test('it renders and matches with snapshot', async () => {
    await act(async () => {
            ({ asFragment } = render(
                <MemoryRouter>
                    <UserProvider>
                        <ReviewCard
                              reviewId={review.id}
                              review={review.review}
                              date={review.date}
                              username={review.username} 
                              userImg={review.userImg}
                              bookId={review.book_id}
                              reviewLikeCount={review.reviewLikeCount}
                        />
                    </UserProvider>
                </MemoryRouter>
            ));
        });
        
    expect(asFragment()).toMatchSnapshot();
});

test('render review and links to the correct book details page', async () => {
    await act(async () => {
        ({ getByTestId, getByText } = render(
            <MemoryRouter>
                <UserProvider>
                    <ReviewCard
                        reviewId={review.id}
                        review={review.review}
                        date={review.date}
                        username={review.username} 
                        userImg={review.userImg}
                        bookId={review.book_id}
                        title={review.title}
                        reviewLikeCount={review.reviewLikeCount}
                    />
                </UserProvider>
            </MemoryRouter>
        ));
    });
    
    expect(getByText("Review 1")).toBeInTheDocument()
    const profileLink = getByTestId('review-card-profile-link');
    expect(profileLink.getAttribute('href')).toBe('/profile/Test1');
});

test('implement review like functionality', async () => {
    await act(async () => {
        ({ getByTestId, getByText } = render(
            <MemoryRouter>
                <UserProvider>
                    <ReviewCard
                        reviewId={review.id}
                        review={review.review}
                        date={review.date}
                        username={review.username} 
                        userImg={review.userImg}
                        bookId={review.book_id}
                        reviewLikeCount={review.reviewLikeCount}
                    />
                </UserProvider>
            </MemoryRouter>
        ));
    });
    
    const reviewLikeButton = getByTestId('review-card-review-like');
    fireEvent.click(reviewLikeButton);
    
    await waitFor(() => {
        expect(handleLikeReviewMock).toHaveBeenCalled();
    });
});

test('implement review like functionality', async () => {
    await act(async () => {
        ({ getByTestId, getByText } = render(
            <MemoryRouter>
                <CurrUserProvider>
                    <ReviewCard
                        reviewId={review.id}
                        review={review.review}
                        date={review.date}
                        username={review.username} 
                        userImg={review.userImg}
                        bookId={review.book_id}
                        reviewLikeCount={review.reviewLikeCount}
                    />
                </CurrUserProvider>
            </MemoryRouter>
        ));
    });
    
    const reviewDeleteButton = getByTestId('review-card-review-delete');
    fireEvent.click(reviewDeleteButton);
    
    await waitFor(() => {
        expect(getByText("Error deleting review.")).toBeInTheDocument()
    });
});