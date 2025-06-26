import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

function SingleProduct({ token, product, setProduct }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userReview, setUserReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      const res = await fetch(`http://localhost:3000/products/${id}`);
      const data = await res.json();
      setProduct(data);
    };

    getProduct();
  }, []);


  useEffect(() => {
    if (token) {
      getCurrentUser();
      checkUserReview();
      checkPurchaseHistory();
    }
  }, [token, id]);

  const getCurrentUser = async () => {
    try {
      const result = await fetch(`http://localhost:3000/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const userData = await result.json();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error loading user details: ", error);
    }
  };

  const checkUserReview = async () => {
  try {
    const response = await fetch(`http://localhost:3000/reviews/user-product/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const review = await response.json();
      setUserReview(review);
    } else if (response.status === 404) {
      setUserReview(null); // No review found
    }
  } catch (error) {
    console.error("Error checking user review:", error);
  }
};

  const checkPurchaseHistory = async () => {
  try {
    const response = await fetch(`http://localhost:3000/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const orders = await response.json();
      // Check if user has purchased this product by looking in the note
      const purchased = orders.some(order => 
        order.note && order.note.includes(product.title)
      );
      setHasPurchased(purchased);
    }
  } catch (error) {
    console.error("Error checking purchase history:", error);
  }
};



  async function handleInstantPurchase() {
  try {
    const res = await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: currentUser?.id,
        date: new Date().toISOString(),
        note: `Purchased ${product.title}`,
      }),
    });


    const text = await res.text();
    console.log("Server response:", text);

    if (res.ok) {
      navigate("/orders");
    } else {
      alert("Failed to place order.");
    }
  } catch (err) {
    console.error("Error placing order:", err);
    alert("Error placing order.");
  }
}

  const handleReviewSubmitted = (reviewData, action) => {
    if (action === 'deleted') {
      setUserReview(null);
      setEditingReview(null);
      setShowReviewForm(false);
    } else {
      setUserReview(reviewData);
      setEditingReview(null);
      setShowReviewForm(false);
    }
    

  };

  const handleEditReview = (review) => {

    if (currentUser && review.user_id === currentUser.id) {
      setEditingReview(review);
      setShowReviewForm(true);
    }
  };

  const handleStartNewReview = () => {
    setEditingReview(null);
    setShowReviewForm(true);
  };

  return (
  <div className="single-product">
    <h1 className="product-title">{product.title}</h1>
    <p className="product-description">Description: {product.description}</p>
    <p className="product-price">Price: ${product.price}</p>

    {token && (
      <button className="purchase-button" onClick={handleInstantPurchase}>
        Purchase
      </button>
    )}

    <div className="review-section">
      {token && hasPurchased && (
        <div className="user-review">
          {userReview && !showReviewForm ? (
            <>
              <h3>Your Review</h3>
              <div className="review-card">
                <div>Rating: {userReview.rating} stars</div>
                <div>Comment: {userReview.comment}</div>
                <button onClick={() => handleEditReview(userReview)}>
                  Edit Review
                </button>
              </div>
            </>
          ) : showReviewForm ? (
            <ReviewForm
              token={token}
              productId={id}
              existingReview={editingReview}
              onReviewSubmitted={handleReviewSubmitted}
            />
          ) : (
            <button onClick={handleStartNewReview}>Leave a Review</button>
          )}

          {showReviewForm && (
            <button onClick={() => setShowReviewForm(false)}>
              Cancel
            </button>
          )}
        </div>
      )}

      {token && !hasPurchased && (
        <div className="not-purchased-message">
          <p>Purchase this book to leave a review!</p>
        </div>
      )}

      <ReviewList
        productId={id}
        token={token}
        currentUserId={currentUser?.id}
        onEditReview={handleEditReview}
      />
    </div>
  </div>
);
}

export default SingleProduct;

