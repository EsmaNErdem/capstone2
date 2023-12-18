import React, { useState } from 'react';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

/**
 * Displays input text area
 * 
 * - Send user review data to database. If fails, shows error on bookcard to user
 * 
 * - BookReviewDrawer ==> BookReviewAddForm
 */
const BookReviewAddForm = ({addReviews, rowCount=3, close=false, closeModal}) => {
    console.debug("BookReviewAddForm");

    const [formData, setFormData] = useState({ review: '' });

    // Send review to database
    const handleAddReview = async e => {
        e.preventDefault();
        await addReviews(formData);
        setFormData({ review: '' })
        if (close) closeModal();
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
                    rows={rowCount}
                    variant="outlined"
                    fullWidth
                    sx={{ width: '100%' }}
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

export default BookReviewAddForm;