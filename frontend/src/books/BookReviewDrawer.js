import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import BookReview from './BookReview';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


// npm install @mui/icons-material
const BookReviewDrawer = ({ isOpen, onClose, reviews, addReviews, bookData }) => {
    console.debug("BookReviewDrawer");

    const drawerRef = useRef();
    
    const [formData, setFormData] = useState({ review: '' });

    const handleAddReview = async e => {
        console.log("WWWWWWWWWw", formData)
        e.preventDefault();
        await addReviews(formData);
    }

    const handleReviewChange = e => {
        const { name, value} = e.target
        console.log('Review Change:', name);
        setFormData(data => ({
            ...data,
            review: value || undefined
        }))
    }


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
                    <ListItem sx={{ display: 'flex', flexDirection: 'column', justifyContent: "center" }} >
                        <Link to={`/books/${bookData.id}`}>
                        <ListItemText
                            primary={bookData.title}
                            sx={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}
                        />
                        </Link>
                    </ListItem>
                    <ListItem sx={{ display: 'flex', flexDirection: 'column', justifyContent: "center" }} >
                        <Link to={`/books/${bookData.id}`}>
                            <ListItemText
                            primary={`By ${bookData.author}`}
                            sx={{
                                fontStyle: 'italic',
                                color: 'gray', 
                                textAlign: 'center'
                            }}
                            />
                        </Link>
                    </ListItem>
                    <ListItem sx={{ marginTop: '16px', display: 'flex', flexDirection: 'column', justifyContent: "center" }}>
                        <img
                            alt={bookData.title}
                            src={bookData.cover}
                            className="CardImage"
                            style={{
                                width: '175px', 
                                height: 'auto',
                                borderRadius: '8px', 
                            }}
                        />
                    </ListItem>
                </List>
                <Divider />

                
                <List>
                    {reviews.map(({ reviewId, review, username, userImg, date, reviewLikeCount }) => 
                            <BookReview 
                                key={reviewId}
                                reviewiD={reviewId}
                                review={review}
                                username={username}
                                userImg={userImg}
                                date={date}
                                reviewLikeCount={+reviewLikeCount}
                            />
                        )}
                </List>

                <List>
                    <ListItem disablePadding sx={{ marginBottom: 2 }}>
                        <TextField
                            label="Add a Review"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            value={formData.review}
                            onChange={handleReviewChange}
                        />
                    </ListItem>
                    <ListItem disablePadding>
                        <Button variant="contained" onClick={handleAddReview}>
                            Add Review
                        </Button>
                    </ListItem>
                </List>
            </Box>
        </SwipeableDrawer>
    );
};

export default BookReviewDrawer;


