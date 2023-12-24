import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import Profile from '../Profile';
import BookClubApi from '../../api';
import * as useFollowModule from '../../hooks/userFollowUser';

const mockUser = {
    username: "Test1",
    firstName: "TestFirs1",
    lastName: "TestLast1",
    img: "UserImg1",
    email: "u1@email.com",
    reviews: [{
        reviewId: 1,
        review: "Review 1",
        date: "12/18/2023",
        username: "Test1", 
        userImg: "UserImg1",
        book_id: 1,
        title: 'Book 1',
        cover: 'Cover 1',
        author: 'Author 1',
        category: 'Category 1',
        reviewLikeCount: 2
    }],
    likedBooks: [{
        book_id: '1',
        title: 'Book1',
        author: 'Author1',
        publisher: 'Publisher1',
        description: 'Description1',
        category: 'Category1',
        cover: 'Cover1',
        bookLikeCount: 5,
    }],
    likedReviews: [{
        reviewId: 2,
        review: "Review 2",
        date: "12/18/2023",
        username: "Test2", 
        userImg: "UserImg2",
        book_id: 1,
        title: 'Book 1',
        cover: 'Cover 1',
        author: 'Author 1',
        category: 'Category 1',
        reviewLikeCount: 2
    }],
    followers:[{
        followedBy: "Test2",
        userImg: 'UserImg2'
      }],
    following: [{
        following: 'Test2',
        userImg: 'UserImg2',
      }]
}

const mockFollow = {
    following: "Test1",
    followedBy: "Test4",
}

jest.mock("../../api", () => ({
    __esModule: true,
    default: {
        getUser: jest.fn(),
        followUser: jest.fn(),
    },
}));

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
    BookClubApi.getUser.mockImplementationOnce(() => (mockUser));
  
    await act(async () => {
      render(
        <MemoryRouter>
          <UserProvider>
            <Profile />
          </UserProvider>
        </MemoryRouter>
      );
    });
  
});

test('it renders and matches with snapshot', async () => {
    BookClubApi.getUser.mockImplementationOnce(() => (mockUser));
  
    await act(async () => {
      ({ asFragment, getByTestId } = render(
        <MemoryRouter>
          <UserProvider>
            <Profile />
          </UserProvider>
        </MemoryRouter>
      ));
    });
  
    expect(asFragment()).toMatchSnapshot();
});

test('renders mock data', async () => {
    BookClubApi.getUser.mockImplementationOnce(() => (mockUser));
    
    await act(async () => {
        ({ getByText, getByTestId, queryByText } = render(
        <MemoryRouter>
          <UserProvider>
            <Profile />
          </UserProvider>
        </MemoryRouter>
      ));
    });
    
    expect(getByText("1 User Reviews")).toBeInTheDocument()
    expect(getByText("+ Follow")).toBeInTheDocument()
    expect(queryByText("Edit")).not.toBeInTheDocument()
    expect(queryByText("1 User Reviews")).toBeInTheDocument()  
});

test('renders mock follow', async () => {
    BookClubApi.getUser.mockImplementationOnce(() => (mockUser));
    BookClubApi.followUser.mockImplementationOnce(() => (mockFollow));
    
    await act(async () => {
      ({ getByTestId } = render(
          <MemoryRouter>
          <UserProvider>
            <Profile />
          </UserProvider>
        </MemoryRouter>
      ));
    });

    const followUser = getByTestId("follow-profile-button")
    fireEvent.click(followUser);
    
    await waitFor(() => {
        expect(handleUserFollowMock).toHaveBeenCalled();
    });

});