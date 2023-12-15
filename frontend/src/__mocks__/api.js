
const mockBooks = [
    {
      id: 1,
      title: 'Book 1',
      author: 'Author 1',
      description: 'Description 1',
      publisher: 'Publisher 1',
      category: 'Category 1',
      cover: 'Cover 1',
      bookLikeCount: 5,
      reviews: [],
    },
    {
      id: 2,
      title: 'Book 2',
      author: 'Author 2',
      description: 'Description 2',
      publisher: 'Publisher 2',
      category: 'Category 2',
      cover: 'Cover 2',
      bookLikeCount: 10,
      reviews: [],
    },
  ];

const BookClubApi = {
    getUser: jest.fn(() => Promise.resolve({})),
    registerUser: jest.fn(() => Promise.resolve({})),
    loginUser: jest.fn(() => Promise.resolve({})),
    unlikeReview: jest.fn(() => Promise.resolve("")),
    likeReview: jest.fn(() => Promise.resolve("")),
    sendBookReview: jest.fn(() => Promise.resolve({})),
    deleteBookReview: jest.fn(() => Promise.resolve("")),
    unlikeBook: jest.fn(() => Promise.resolve("")),
    likeBook: jest.fn(() => Promise.resolve("")),
    unfollowUser: jest.fn(() => Promise.resolve("")),
    followedUsfollowUsererId: jest.fn(() => Promise.resolve("")),
    likeBook: jest.fn(() => Promise.resolve("")),
    getBookList: jest.fn(() => (mockBooks)),
}