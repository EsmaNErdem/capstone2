import React, { useState } from 'react';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

/**
 * Displays input text area
 * 
 * - Send user review data to database. If fails, shows error on bookcard to user
 * 
 * - BookReviewDrawer ==> BookReview
 */
const BookReviewAdd = ({addReviews}) => {
    console.debug("BookReviewAdd");

    const [formData, setFormData] = useState({ review: '' });

    // Send review to database
    const handleAddReview = async e => {
        e.preventDefault();
        await addReviews(formData);
        setFormData({ review: '' })
    }

    const handleReviewChange = e => {
        setFormData(data => ({
            ...data,
            review: e.target.value || undefined
        }))
    }

    return (
        <>
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
        </>
    )
}

export default BookReviewAdd;