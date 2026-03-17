import { useState, useEffect } from 'react';
import { fetchReviews, createReview, clearReviews } from '../data/reviews';

const useReviews = () => {
  const [reviews, setReviews] = useState([]);

  // Carica le recensioni al mount
  useEffect(() => {
    const loadReviews = async () => {
      const loaded = await fetchReviews();
      setReviews(loaded);
    };
    loadReviews();
  }, []);

  const handleAddReview = async ({ bookTitle, reviewText }) => {
    const newReview = await createReview({ bookTitle, reviewText });
    setReviews([...reviews, newReview]);
  };

  const handleClearReviews = async () => {
    await clearReviews();
    setReviews([]);
  };

  return { reviews, handleAddReview, handleClearReviews };
};

export default useReviews;
