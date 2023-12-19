import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import BookReviewAddForm from '../BookReviewAddForm';

const addReviews = jest.fn();
jest.useFakeTimers();

afterEach(() => {
  jest.clearAllTimers();
})

test('renders without crashing', async () => {  
    await act(async () => {
      render(
        <MemoryRouter>
          <UserProvider>
            <BookReviewAddForm addReviews={addReviews} closeModal={()=>{}} />
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
          <BookReviewAddForm addReviews={addReviews} closeModal={()=>{}} />
          </UserProvider>
        </MemoryRouter>
      ));
    });

    expect(asFragment()).toMatchSnapshot();
});

test('submit review input', async () => {  
    await act(async () => {
      ({ getByRole, getByLabelText } = render(
        <MemoryRouter>
          <UserProvider>
          <BookReviewAddForm addReviews={addReviews} closeModal={()=>{}} />
          </UserProvider>
        </MemoryRouter>
      ));
    });

    const reviewInput = getByLabelText('Add a Review');
    fireEvent.change(reviewInput, { target: { value: 'Review' } });
    const addButton = getByRole('button', { name: 'Add Review' });
    fireEvent.click(addButton);

    expect(addReviews).toHaveBeenCalledWith({ review: 'Review' });
});