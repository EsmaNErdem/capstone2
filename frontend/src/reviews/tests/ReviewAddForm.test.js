import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import ReviewAddForm from '../ReviewAddForm';
import BookClubApi from '../../api';

const addReviews = jest.fn();

jest.mock("../../api", () => ({
    __esModule: true,
    default: {
        getBooksFromDatabase: jest.fn(),
    },
}));

afterEach(() => {
  jest.clearAllMocks();
})

test('renders without crashing', async () => {  
    BookClubApi.getBooksFromDatabase.mockImplementationOnce(() => (mockReviews));

    await act(async () => {
      render(
        <MemoryRouter>
          <UserProvider>
            <ReviewAddForm addReviews={addReviews} closeModal={()=>{}} />
          </UserProvider>
        </MemoryRouter>
      );
    });
});

test('it renders and matches with snapshot', async () => {  
    BookClubApi.getBooksFromDatabase.mockImplementationOnce(() => (mockReviews));

    await act(async () => {
      ({ asFragment } = render(
        <MemoryRouter>
          <UserProvider>
          <ReviewAddForm addReviews={addReviews} closeModal={()=>{}} />
          </UserProvider>
        </MemoryRouter>
      ));
    });

    expect(asFragment()).toMatchSnapshot();
});

test('submit review input', async () => {  
    BookClubApi.getBooksFromDatabase.mockImplementationOnce(() => (mockReviews));

    await act(async () => {
      ({ getByRole, getByLabelText } = render(
        <MemoryRouter>
          <UserProvider>
          <ReviewAddForm addReviews={addReviews} closeModal={()=>{}} />
          </UserProvider>
        </MemoryRouter>
      ));
    });

    const reviewInput = getByLabelText('Add a Review');
    fireEvent.change(reviewInput, { target: { value: 'Review' } });
    const addButton = getByRole('button', { name: 'Add Review' });
    fireEvent.click(addButton);

    expect(addReviews).toHaveBeenCalledWith('Review', null);
});