import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from "../../testUtilities";
import { render, act } from '@testing-library/react';
import ChatList from '../ChatList';
import BookClubApi from '../../api';

const mockChatRooms =  [{
    message: {
            username: 'TestUser',
            message: 'TestMessage', 
            messageDate: "02/07/2023",
            messageId: 1,
        },
    room: {
            id: 1,
            roomDate: "02/07/2023",
        },
    user: {
        username: 'TestUser',
        userImg: 'UserImg'
    }
},
{
    message: {
            username: 'TestUser2',
            message: 'TestMessage2', 
            messageDate: "02/07/2023",
            messageId: 2,
        },
    room: {
            id: 3,
            roomDate: "02/07/2023",
        },
    user: {
        username: 'TestUser2',
        userImg: 'UserImg2'
    }
}]

jest.mock("../../api", () => ({
    __esModule: true,
    default: {
        getUserPreviousMessages: jest.fn(),
    },
}));

afterEach(() => {
    jest.clearAllMocks();
});

  
test('renders without crashing', async () => {
    BookClubApi.getUserPreviousMessages.mockImplementationOnce(() => (mockChatRooms));
  
    await act(async () => {
      render(
        <MemoryRouter>
          <UserProvider>
            <ChatList />
          </UserProvider>
        </MemoryRouter>
      );
    });
  
});

test('it renders and matches with snapshot', async () => {
    BookClubApi.getUserPreviousMessages.mockImplementationOnce(() => (mockChatRooms));
  
    await act(async () => {
      ({ asFragment } = render(
        <MemoryRouter>
          <UserProvider>
            <ChatList />
          </UserProvider>
        </MemoryRouter>
      ));
    });
  
    expect(asFragment()).toMatchSnapshot();
});
  
test('renders mock data', async () => {
    BookClubApi.getUserPreviousMessages.mockImplementationOnce(() => (mockChatRooms));
  
    await act(async () => {
      ({ getByText, getAllByText } = render(
        <MemoryRouter>
          <UserProvider>
            <ChatList />
          </UserProvider>
        </MemoryRouter>
      ));
    });   
     const testUserElements = getAllByText("TestUser");
  
    expect(testUserElements.length).toBeGreaterThan(1);
    expect(getByText("TestMessage • Feb 7, 12:00 AM")).toBeInTheDocument()
    expect(getByText("TestUser2")).toBeInTheDocument()
    expect(getByText("TestMessage2 • Feb 7, 12:00 AM")).toBeInTheDocument()
});
