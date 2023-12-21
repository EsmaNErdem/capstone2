import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import useBookLike from '../useBookLike';
import UserContext from '../../auth/UserContext';

let realUseContext;
let useContextMock;

beforeEach(() => {
    realUseContext = React.useContext;
    useContextMock = React.useContext = jest.fn();
});

afterEach(() => {
    React.useContext = realUseContext;
});

describe('useBookLike', () => {
  it('should handle book liking', async () => {
    const hasLikedBook = jest.fn();
    const likeBook = jest.fn();

    const bookId = 123;
    const initialLikes = 5;
    const bookData = { title: 'Test Book' };

    // Set up UserContext mock implementation
    useContextMock.mockReturnValue({
      hasLikedBook,
      likeBook,
    });
    
    // like book
    hasLikedBook.mockReturnValue(false);
    likeBook.mockResolvedValue(bookId);

    // Initialize the hook
    const { result } = renderHook(() =>
      useBookLike(bookId, initialLikes, bookData)
    );

    // Destructure the returned hook result
    const { liked, likes, error, handleLikeBook } = result.current;

    expect(liked).toBe(false);
    expect(likes).toBe(initialLikes);
    expect(error).toBeNull();


    await act(async () => {
      handleLikeBook();
    });
    
  //   await waitFor(() => {
  //     expect(liked).toBe(true);
  //     expect(likes).toBe(initialLikes + 1);
  //     expect(error).toBeNull();
  // }, {timeout: 3000});
  
  // await act(async () => {
  //     // dislike book
  //     hasLikedBook.mockReturnValue(true);
  //     likeBook.mockResolvedValue(bookId);
  //     handleLikeBook();
  //   });

  //   await waitFor(() => {
  //     expect(liked).toBe(false);
  //     expect(likes).toBe(initialLikes);
  //     expect(error).toBeNull();
  //   });
  });
});
