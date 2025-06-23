import { useState, useEffect } from "react";

export default function ReviewForm({ token, productId, existingReview, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // If there's an existing review, allow editing
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
      setIsEditing(true);
    }
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation - same as your original
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (comment.trim() === '') {
      alert('Please leave a comment with your rating');
      return; 
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        productId: parseInt(productId),
        rating,
        comment: comment.trim()
      };

      let response;
      let url;
      let method;

      if (isEditing && existingReview) {
        // Update existing review - following your URL pattern
        url = `http://localhost:3000/reviews/${existingReview.id}`;
        method = 'PUT';
      } else {
        // Create new review - following your URL pattern
        url = 'http://localhost:3000/reviews';
        method = 'POST';
      }

      response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Following your auth pattern
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const result = await response.json();
      
      // Success feedback
      alert(isEditing ? 'Review updated successfully!' : 'Thanks for your review!');
      
      // Reset form if creating new review
      if (!isEditing) {
        setRating(0);
        setComment('');
      }
      
      // Notify parent component to refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted(result);
      }

    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete this review?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/reviews/${existingReview.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      alert('Review deleted successfully!');
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted(null, 'deleted');
      }

    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      // Reset to original values
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    } else {
      // Clear form
      setRating(0);
      setComment('');
    }
  };

  // Star rating functionality - same as your original
  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue) => {
    setHoverRating(starValue);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`text-3xl transition-colors duration-200 ${
            i <= (hoverRating || rating) 
              ? 'text-yellow-400' 
              : 'text-gray-300'
          } hover:text-yellow-400 focus:outline-none focus:text-yellow-400`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
          aria-label={`Rate ${i} star${i !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  return (
    <div>
      <div> 
        <h2>{isEditing ? 'Edit Your Review' : 'Leave A Review'}</h2> 
        <p>Did your family enjoy this book?</p>
      </div>

      <form onSubmit={handleSubmit}> 
        <div id="rating">
          <label>Rating</label>
          {renderStars()}
          <p>{rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}</p>
        </div>

        <div> 
          <label htmlFor="comment">Review</label> 
          <textarea 
            id="comment" 
            value={comment} 
            onChange={(e) => setComment(e.target.value)}  
            rows={4} 
          /> 
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : (isEditing ? 'Update Review' : 'Submit Review')}
          </button>
          
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
          
          {isEditing && (
            <button type="button" onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white' }}>
              Delete Review
            </button>
          )}
        </div>
      </form>
    </div>
  );
}