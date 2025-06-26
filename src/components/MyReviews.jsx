import { useState, useEffect } from 'react';

export default function MyReviews ({ token }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!token) return;

    async function fetchUserReviews() {
      try {
        const response = await fetch('http://localhost:3000/reviews/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      }
    }

    fetchUserReviews();
  }, [token]);

  if (reviews.length === 0) {
    return <p>You haven't left any reviews yet.</p>;
  }

  return (
    <div className="myreviews">
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {reviews.map((review, index) => (
            <li key={review.id} className="myreview-card">
              <strong>Your Review #{index + 1}</strong><br />
              <p>Product: {review.product_title || `Product ID: ${review.product_id}`}</p>
              <p>Rating: {'⭐️'.repeat(review.rating)}</p>
              <p>Review: {review.comment}</p>
            </li>
          ))}
        </ul>
      )}
      <p>Total reviews: {reviews.length}</p>
    </div>
  );
}