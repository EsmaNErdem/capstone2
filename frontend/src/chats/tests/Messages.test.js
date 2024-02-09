import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import Messages from '../Messages';

  
test('renders without crashing', async () => {  
    await act(async () => {
      render(
        <MemoryRouter>
          <UserProvider>
            <Messages />
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
            <Messages />
          </UserProvider>
        </MemoryRouter>
      ));
    });
  
    expect(asFragment()).toMatchSnapshot();
});

test('it renders and matches with snapshot', async () => {  
    const date = new Date('2024-02-08T12:30:00');

    await act(async () => {
      ({ getByText } = render(
        <MemoryRouter>
          <UserProvider>
            <Messages text={"Hello"} username={"test"} date={date}/>
          </UserProvider>
        </MemoryRouter>
      ));
    });
  
    expect(getByText("12:30 PM")).toBeInTheDocument()
    expect(getByText("test:")).toBeInTheDocument()
    expect(getByText("Hello")).toBeInTheDocument()

});