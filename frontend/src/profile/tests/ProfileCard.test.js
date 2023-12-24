import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import ProfileCard from '../ProfileCard';
import * as useFollowModule from '../../hooks/userFollowUser';

const user = {
    username: "Test2",
    userImg: "UserImg1",
}

beforeEach(() => {
    handleUserFollowMock = jest.fn();
  
    jest.spyOn(useFollowModule, 'default').mockImplementation(() => ({
      followed: false,
      error: null,
      handleFollowUser: handleUserFollowMock,
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
            <ProfileCard />
          </UserProvider>
        </MemoryRouter>
      );
    });
  
});

test('it renders and matches with snapshot', async () => {  
    await act(async () => {
      ({ asFragment, getByTestId } = render(
        <MemoryRouter>
          <UserProvider>
            <ProfileCard />
          </UserProvider>
        </MemoryRouter>
      ));
    });
  
    expect(asFragment()).toMatchSnapshot();
});

test('renders mock data', async () => {    
    await act(async () => {
        ({ getByText, getByTestId, queryByText } = render(
        <MemoryRouter>
          <UserProvider>
            <ProfileCard 
                username={user.username}
                userImg={user.userImg}
            />
          </UserProvider>
        </MemoryRouter>
      ));
    });
    
    expect(getByText("Test2")).toBeInTheDocument()
    expect(getByText("+ Follow")).toBeInTheDocument()
});

test('renders mock follow', async () => {
    // BookClubApi.getUser.mockImplementationOnce(() => (mockUser));
    // BookClubApi.followUser.mockImplementationOnce(() => (mockFollow));
    
    await act(async () => {
      ({ getByText } = render(
          <MemoryRouter>
          <UserProvider>
            <ProfileCard 
                username={user.username}
                userImg={user.userImg}
            />
          </UserProvider>
        </MemoryRouter>
      ));
    });

    const followUser = getByText("+ Follow")
    fireEvent.click(followUser);
    
    await waitFor(() => {
        expect(handleUserFollowMock).toHaveBeenCalled();
    });

});