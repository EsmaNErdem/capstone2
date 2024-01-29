import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, act } from '@testing-library/react';
import BookCard from '../BookCard';

const mockReviews = [
  {
    reviewId: '1',
    review: 'Great book!',
    username: 'JohnDoe',
    userImg: 'user1.jpg',
    date: '2023-05-16',
    reviewLikeCount: 10,
  },
];

jest.mock("../../api", () => ({
    __esModule: true,
    default: {
        getAllReviewsByBook: jest.fn(),
    },
}));
  
afterEach(() => {
jest.clearAllMocks();
});


const book = {
    id: '1',
    title: 'Book1',
    author: 'Author1',
    publisher: 'Publisher1',
    description: 'Description1',
    category: 'Category1',
    cover: 'Cover1',
    bookLikeCount: 5,
    reviews: ["Review1"]
}

test('render BookReviewDrawer and shows book detail', async () => {
    await act(async () => {
        ({ getByTestId } = render(
            <MemoryRouter>
                <UserProvider>
                    <BookCard
                          id={book.id}
                          title={book.title}
                          author={book.author}
                          description={book.description}
                          publisher={book.publisher}
                          category={book.category}
                          cover={book.cover}
                          bookLikeCount={book.bookLikeCount}
                          reviews={book.reviews} />
                </UserProvider>
            </MemoryRouter>
        ));
    });
    
    expect(getByTestId("drawer-book-title")).toHaveTextContent("Book1")
    const bookLink = getByTestId('drawer-book-link');
    expect(bookLink.getAttribute('href')).toBe('/books/1');
});

