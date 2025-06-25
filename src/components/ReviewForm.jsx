import { useState, useEffect } from "react";

export default function ReviewForm({ token, productId, existingReview, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // If there's an existing review, allow editing
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
      setIsEditing(true);
    } else {
      // Reset form when no existing review
      setRating(0);
      setComment('');
      setIsEditing(false);
    }
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
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
        product_id: parseInt(productId),
        rating: parseInt(rating),
        comment: comment.trim()
      };

      let response;
      let url;
      let method;

      if (isEditing && existingReview) {
        // Update existing review
        url = `http://localhost:3000/reviews/${existingReview.id}`;
        method = 'PUT';
      } else {
        // Create new review
        url = 'http://localhost:3000/reviews';
        method = 'POST';
      }

      console.log('Submitting review data:', reviewData); // Debug log

      response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData); // Debug log
        throw new Error(errorData.error || errorData.message || 'Failed to submit review');
      }

      const result = await response.json();
      
      // Form submitted
      alert(isEditing ? 'Review updated successfully!' : 'Thanks for your review!');
      
      // Reset form if creating new review
      if (!isEditing) {
        setRating(0);
        setComment('');
      }
      
      // Refresh reviews
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

  // Star display for dropdown options
  const getStarDisplay = (numStars) => {
    return '⭐️'.repeat(numStars);
  };

  return (
    <div>
      <div> 
        <h2>{isEditing ? 'Edit Your Review' : 'Leave A Review'}</h2> 
        <p>Did your family enjoy this book?</p>
      </div>

      <form onSubmit={handleSubmit}> 
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="rating" style={{ display: 'block', marginBottom: '5px' }}>
            Rating
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            style={{
              padding: '8px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              minWidth: '200px'
            }}
          >
            <option value={0}>Select a rating</option>
            <option value={1}>1 - ⭐️</option>
            <option value={2}>2 - ⭐️⭐️</option>
            <option value={3}>3 - ⭐️⭐️⭐️</option>
            <option value={4}>4 - ⭐️⭐️⭐️⭐️</option>
            <option value={5}>5 - ⭐️⭐️⭐️⭐️⭐️</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}> 
          <label htmlFor="comment" style={{ display: 'block', marginBottom: '5px' }}>
            Review
          </label> 
          <textarea 
            id="comment" 
            value={comment} 
            onChange={(e) => setComment(e.target.value)}  
            rows={4}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              resize: 'vertical'
            }}
            placeholder="Tell us about your experience with this book..."
          /> 
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Submitting...' : (isEditing ? 'Update Review' : 'Submit Review')}
          </button>
          
          <button 
            type="button" 
            onClick={handleCancel}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          
          {isEditing && (
            <button 
              type="button" 
              onClick={handleDelete} 
              style={{ 
                backgroundColor: '#dc3545', 
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Delete Review
            </button>
          )}
        </div>
      </form>
    </div>
  );
}