import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, act } from '@testing-library/react';
import BookCard from '../BookCard';

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

jest.mock("../../api", () => ({
    __esModule: true,
    default: {
        getAllReviewsByBook: jest.fn(),
    },
}));
  
  afterEach(() => {
    jest.clearAllMocks();
  });

test('renders without crashing', async () => {
    await act(async () => {
        render(
            <MemoryRouter>
                <UserProvider>
                    <BookCard />
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
        
    expect(asFragment()).toMatchSnapshot();
});

test('render book data and links to the correct book details page', async () => {
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
    
    expect(getByTestId("like-count")).toHaveTextContent("5")
    expect(getByTestId("review-count")).toHaveTextContent("1")
    expect(getByTestId("book-title")).toHaveTextContent("Book1")
    const titleLink = getByTestId('book-title-link');
    expect(titleLink.getAttribute('href')).toBe('/books/1');
});