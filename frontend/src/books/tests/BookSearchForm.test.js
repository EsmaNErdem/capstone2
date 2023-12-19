import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import BookSearchForm from '../BookSearchForm';

const searchFor = jest.fn();
jest.useFakeTimers();

afterEach(() => {
  jest.clearAllTimers();
})

test('renders without crashing', async () => {  
    await act(async () => {
      render(
        <MemoryRouter>
          <UserProvider>
            <BookSearchForm />
          </UserProvider>
        </MemoryRouter>
      );
    });
});

test('it renders and matches with snapshot', async () => {  
    await act(async () => {
      ({ asFragment, getByTestId, queryByPlaceholderText } = render(
        <MemoryRouter>
          <UserProvider>
            <BookSearchForm />
          </UserProvider>
        </MemoryRouter>
      ));
    });

    expect(asFragment()).toMatchSnapshot();
    
    const filterToggle = getByTestId('filter-toggle');
    fireEvent.click(filterToggle);

    expect(queryByPlaceholderText('Book search')).toBeInTheDocument()

    // Wait for state to update
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });

});
  
test('search redirects to the correct route', async () => {
  await act(async () => {
    ({ getByPlaceholderText, getByTestId } = render(
      <MemoryRouter>
        <UserProvider>
          <BookSearchForm searchFor={searchFor}/>
        </UserProvider>
    </MemoryRouter>
  ));
  });

  const searchInput = getByPlaceholderText('Book search');
  fireEvent.change(searchInput, { target: { value: 'Harry' } });

  fireEvent.submit(searchInput);
 
  expect(searchFor).toHaveBeenCalled();
  expect(searchFor).toHaveBeenCalledWith({
    search: "Harry",
    terms: {
           author: undefined,
           publisher: undefined,
           subject: undefined,
           title: undefined,
         }
  });
});

test('toggle more search inputs', async () => {
  await act(async () => {
    ({ queryByPlaceholderText, getByTestId } = render(
      <MemoryRouter>
        <UserProvider>
          <BookSearchForm />
        </UserProvider>
    </MemoryRouter>
  ));
  });

  const filterToggle = getByTestId('filter-toggle');
  expect(queryByPlaceholderText('Book search')).toBeInTheDocument()
  expect(queryByPlaceholderText('Book author')).not.toBeInTheDocument()
  fireEvent.click(filterToggle);
  expect(queryByPlaceholderText('Book author')).toBeInTheDocument()
});

// Mock the setTimeout function to control the passage of time in the tests
test('debounces the search input', async () => {

  await act(async () => {
    ({ getByPlaceholderText } = render(
      <MemoryRouter>
        <UserProvider>
          <BookSearchForm searchFor={searchFor}/>
        </UserProvider>
    </MemoryRouter>
  ));
  });

  const searchInput = getByPlaceholderText('Book search');
  await act(async () => {
    fireEvent.change(searchInput, { target: { value: 'Harry' } });
  });
  
  expect(searchFor).not.toHaveBeenCalled();
  
  // Move time forward by 1200ms (the debounce time)
  act(() => {
    jest.advanceTimersByTime(1200);
  });
  
  expect(searchFor).toHaveBeenCalled();
  // await waitFor(() => {
  //   expect(searchFor).toHaveBeenCalledWith({
  //     search: 'Harry',
  //     terms: {
  //       author: undefined,
  //       publisher: undefined,
  //       subject: undefined,
  //       title: undefined,
  //     },
  //   });
  // });
});  