import { render } from '@testing-library/react';
import App from './App';

jest.mock("./api", () => ({
  __esModule: true,
  default: {
    getUser: jest.fn(),
    registerUser: jest.fn(),
    loginUser: jest.fn(),
    unlikeReview: jest.fn(),
    likeReview: jest.fn(),
    sendBookReview: jest.fn(),
    deleteBookReview: jest.fn(),
    unlikeBook: jest.fn(),
    likeBook: jest.fn(),
    unfollowUser: jest.fn(),
    followUser: jest.fn(),
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

test('renders without crashing', () => {
  render(<App />);
});

test("it renders and matches with snaphot", () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
});