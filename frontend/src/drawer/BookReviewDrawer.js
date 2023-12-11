import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import BookReview from './BookReview';
import BookReviewAdd from './BookReviewAdd';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import './BookReviewDrawer.css';

/**
 * BookReviewDrawer Component
 * 
 * Displays a Material UI pop-up drawer for book details, reviews, and adding new reviews.
 * 
 * - Displays book details with links to related routes.
 * - Lists existing book reviews along with like counts.
 * - Provides an input area for submitting new reviews.
 * 
 * - BookCard ==> BookReviewDrawer ==> BookReview, BookReviewAdd
 */
const BookReviewDrawer = ({ isOpen, onClose, reviews, addReviews, deleteReview, bookData }) => {
    console.debug("BookReviewDrawer");

    const drawerRef = useRef();

    return (
        <SwipeableDrawer
            ref={drawerRef} 
            anchor="right"
            open={isOpen}
            onClose={onClose}
            onOpen={() => {}}
            onClick={(e) => {
                if (!drawerRef.current.contains(e.target)) {
                    onClose();
                }
            }}
        >
            <Box
                sx={{
                    width: 500,
                    padding: '10px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: "center"
                }}
                role="presentation"
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        onClose();
                    }
                }}
            >
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: 0, right: 460 }}>
                    <CloseIcon />
                </IconButton>

                <List sx={{ marginTop: '10px'}}>
                    <ListItem style={{ display: 'flex', flexDirection: 'column', justifyContent: "center" }}>
                        <Link to={`/books/${bookData.id}`} className="drawer-heading">
                            <ListItemText primary={bookData.title} primaryTypographyProps={{fontSize: '2rem', fontWeight: "bold"}} />
                        </Link>
                    </ListItem>
                    <ListItem style={{ display: 'flex', flexDirection: 'column', justifyContent: "center" }}>
                        <Link to={`/books/${bookData.id}`} className="author-info">
                            <ListItemText primary={`By ${bookData.author}`} />
                        </Link>
                    </ListItem>
                    <ListItem style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', justifyContent: "center" }}>
                        <img
                            alt={bookData.title}
                            src={bookData.cover}
                            className="drawer-image"
                        />
                    </ListItem>
                </List>
                <Divider />
                
                <List>
                    {reviews.map(({ reviewId, review, username, userImg, date, reviewLikeCount }) => 
                            <BookReview 
                                key={reviewId}
                                reviewId={reviewId}
                                review={review}
                                username={username}
                                userImg={userImg}
                                date={date}
                                reviewLikeCount={+reviewLikeCount}
                                deleteReview={deleteReview}
                            />
                        )}
                </List>

                <List>
                    <BookReviewAdd addReviews={addReviews} />
                </List>
            </Box>
        </SwipeableDrawer>
    );
};

export default BookReviewDrawer;