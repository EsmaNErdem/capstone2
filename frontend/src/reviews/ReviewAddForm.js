import React, { useState, useEffect, useRef } from 'react';
import BookClubApi from '../api';
import Alert from "../utilities/Alert";
import { ListItem, TextField, Button, Autocomplete } from '@mui/material';

/**
 * Displays autocomplete for book entry and input text area for review
 * 
 * - Shows Book book suggestions pulled from database if not mathched from external Google Book API search API call
 * - Send user review data to database. If fails, shows error on bookcard to user
 * 
 * - ReviewList, ReviewFilterList ==> BookReview
 */
const ReviewAddForm = ({addReviews, rowCount=3, close=false, closeModal, addBook=false}) => {
    console.debug("BookReviewAdd");

    const [formData, setFormData] = useState({ review: '', book: '' });
    const [loading, setLoading] = useState(true)
    const [bookSuggestions, setBookSuggestions] = useState([])
    const [book, setBook] = useState(null)
    const [error, setError] = useState(null);
    const timerId = useRef();

    /**
     * Loads book suggestion from database first, if no matching data make external API call
     */
    const getBookData = async () => {
        setError(null);
        try {
            const bookData = await BookClubApi.getBooksFromDatabase(5, {search: formData.book}); 

            if (bookData.length === 0 && !book) {
            // If no matching books from the database, fetch from external API
            const externalBooks = await BookClubApi.getSearchedBookResult(5, { search: formData.book });
            setBookSuggestions(externalBooks);
        } else {
            setBookSuggestions(bookData);
        }

        } catch (e) {
          console.error("Review Add Form useEffect API call data loading error:", e);
          setError("An error occurred while fetching book data.");
        }
    
        setLoading(false);
      };

    // when formData.book changes, it updates suggestions
    useEffect(() => {
        if (timerId.current) {
            clearTimeout(timerId.current);
            timerId.current = null
        }
        
        timerId.current = setTimeout(() => {
            setLoading(true)
            getBookData();
        }, 300);

        return () => {
        if (timerId.current) {
            clearTimeout(timerId.current);
            timerId.current = null
        }
        };
    }, [formData.book]);

    // Send review and book data to database
    const handleAddReview = async e => {
        e.preventDefault();
        await addReviews(formData.review, book);
        if (close) closeModal();
    };

    // handles review input change
    const handleChangeReview = (e) => {
        setFormData((data) => ({
          ...data,
          review: e.target.value || undefined,
        }));
    };

    // handles book text input change, it kicks start timer
    const handleChangeBook = (e) => {
        setFormData((data) => ({
          ...data,
          book: e.target.value || undefined,
        }));

        if (timerId.current) {
            clearTimeout(timerId.current);
        }
    };

    // handles user book selection from autocomplete option
    const handleChange = (e) => {
        setBook({...e.target.value});
        setFormData((data) => ({
            ...data,
            book: e.target.value || undefined,
          }));
    };


    return (
        <>
            <ListItem disablePadding sx={{ marginBottom: 2, display: "flex", flexDirection: "column"}}>
                {addBook && (
                    <Autocomplete
                        sx={{ marginBottom: 1, width: '100%' }}
                        disablePortal
                        options={bookSuggestions}
                        getOptionLabel={(option) => `${option.title} by ${option.author}`}
                        onChange={(e, value) => handleChange({ target: { value } })}
                        onInputChange={(e, value) => handleChangeBook({ target: { value } })}
                        renderInput={(params) => <TextField {...params} label="Book Title by Author" />}
                    />
                )}
                <TextField
                    label="Add a Review"
                    multiline
                    rows={rowCount}
                    variant="outlined"
                    fullWidth
                    sx={{ width: '100%' }}
                    value={formData.review}
                    onChange={(e) => handleChangeReview(e)}
                />
            </ListItem>
            <ListItem disablePadding>
                <Button 
                    variant="contained" 
                    onClick={handleAddReview}
                    style={{ backgroundColor: '#a074f3', color: 'white' }}
                >
                    Add Review
                </Button>
            </ListItem>
            {error ? <Alert type="danger" messages={error} />: null}
        </>
    )
}

export default ReviewAddForm;