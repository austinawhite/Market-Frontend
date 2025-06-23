import { useState, useEffect } from "react";

// Enhanced ReviewList that fetches reviews from your backend
// Shows all reviews for a product and allows users to edit their own reviews

export default function ReviewList({ productId, currentUserId, onEditReview }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch reviews for this product - following your URL pattern
      const response = await fetch(`http://localhost:3000/reviews/product/${productId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (review) => {
    if (onEditReview) {
      onEditReview(review);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  if (error) {
    return <div>Error loading reviews: {error}</div>;
  }

  return (
    <div>
      <div>
        <h2>Verified Reviews</h2>
        <p>Each review has been submitted by a verified product owner.</p>
      </div>

      {reviews.length === 0 ? (
        <div>
          <p>There are currently no verified reviews</p>
        </div>
      ) : (
        <div>
          {reviews.map((review) => (
            <div 
              key={review.id} 
              style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                margin: '10px 0',
                borderRadius: '5px'
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{review.username || 'Anonymous'}</strong>
                    <div>{renderStars(review.rating)}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9em', color: '#666' }}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                    {/* Show edit button only for user's own reviews */}
                    {currentUserId && review.user_id === currentUserId && (
                      <button 
                        onClick={() => handleEditClick(review)}
                        style={{ 
                          marginLeft: '10px', 
                          padding: '5px 10px',
                          fontSize: '0.8em',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '10px' }}>
                {review.comment}
              </div>

              {review.updated_at !== review.created_at && (
                <div style={{ fontSize: '0.8em', color: '#888', marginTop: '5px' }}>
                  Edited: {new Date(review.updated_at).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}