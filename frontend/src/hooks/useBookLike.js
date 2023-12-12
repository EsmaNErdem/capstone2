import { useState, useEffect, useContext } from 'react';
import UserContext from '../auth/UserContext';

/** */
const useBookLike = (bookId, initialLikes, bookData={}) => {
  const { hasLikedBook, likeBook } = useContext(UserContext);
  const [liked, setLiked] = useState();
  const [likes, setLikes] = useState();
  const [error, setError] = useState(null);

  
  useEffect(() => {
      setLiked(hasLikedBook(bookId));
      setLikes(initialLikes)
    }, [bookId, hasLikedBook, initialLikes]);
    
    const handleLikeBook = async () => {
        try {
            setError(null);
            if (liked) {
                const unlikedBookId = await likeBook(bookId);
                if (unlikedBookId === bookId) {
                    setLikes((likes) => likes - 1);
                    setLiked(false);
                }
            } else {
                const likedBookId = await likeBook(bookId, bookData);
                if (likedBookId === bookId) {
                    setLikes((likes) => likes + 1);
                    setLiked(true);
                }
            }
        } catch (error) {
            setError('Error liking book.');
            console.error('Error handling book like:', error);
    }
  };

  return { liked, likes, error, handleLikeBook };
};

export default useBookLike;
