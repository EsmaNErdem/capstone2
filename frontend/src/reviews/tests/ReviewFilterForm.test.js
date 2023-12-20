import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import ReviewFilterForm from '../ReviewFilterForm';

const applyFilters = jest.fn();
jest.useFakeTimers();

afterEach(() => {
  jest.clearAllTimers();
})

test('renders without crashing', async () => {  
    await act(async () => {
      render(
        <MemoryRouter>
          <UserProvider>
            <ReviewFilterForm applyFilters={applyFilters} prompts={['title']} />
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
            <ReviewFilterForm applyFilters={applyFilters} prompts={['title']} />
          </UserProvider>
        </MemoryRouter>
      ));
    });

    expect(asFragment()).toMatchSnapshot();
});
  
test('search redirects to the correct route', async () => {
  await act(async () => {
    ({ getByPlaceholderText, getByTestId } = render(
      <MemoryRouter>
        <UserProvider>
          <ReviewFilterForm applyFilters={applyFilters} prompts={['title']}/>
        </UserProvider>
    </MemoryRouter>
  ));
  });

  const searchInput = getByPlaceholderText('Book title');
  fireEvent.change(searchInput, { target: { value: 'Harry' } });

  fireEvent.submit(searchInput);
 
  expect(applyFilters).toHaveBeenCalled();
  expect(applyFilters).toHaveBeenCalledWith({
    title: "Harry"
  });
});

// Mock the setTimeout function to control the passage of time in the tests
test('debounces the search input', async () => {

  await act(async () => {
    ({ getByPlaceholderText } = render(
      <MemoryRouter>
        <UserProvider>
          <ReviewFilterForm applyFilters={applyFilters} prompts={['title']}/>
        </UserProvider>
    </MemoryRouter>
  ));
  });

  const searchInput = getByPlaceholderText('Book title');
  await act(async () => {
    fireEvent.change(searchInput, { target: { value: 'Harry' } });
  });
  
  expect(applyFilters).not.toHaveBeenCalled();
  
  // Move time forward by 1200ms (the debounce time)
  act(() => {
    jest.advanceTimersByTime(1500);
  });
  
  expect(applyFilters).toHaveBeenCalled();
  await waitFor(() => {
    expect(applyFilters).toHaveBeenCalledWith({
        title: "Harry"
      });
  });
});  