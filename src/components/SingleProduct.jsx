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
      const response = await fetch(`http://localhost:3000/reviews/user/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const review = await response.json();
        setUserReview(review);
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
        // Check if user has purchased this product
        const purchased = orders.some(order => 
          order.items && order.items.some(item => item.bookId === parseInt(id))
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
    <>
      <h1>{product.title}</h1>
      <p>Description: {product.description}</p>
      <p>Price: ${product.price}</p>
      
      <div>
        {token && (
          <button onClick={handleInstantPurchase}>Purchase</button>
        )}
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: '40px' }}>
        {token && hasPurchased && (
          <div style={{ marginBottom: '30px' }}>
            {userReview && !showReviewForm ? (
              <div>
                <h3>Your Review</h3>
                <div style={{ 
                  border: '1px solid #ddd', 
                  padding: '15px', 
                  borderRadius: '5px',
                  backgroundColor: '#f8f9fa'
                }}>
                  <div>Rating: {userReview.rating} stars</div>
                  <div>Comment: {userReview.comment}</div>
                  <button 
                    onClick={() => handleEditReview(userReview)}
                    style={{ marginTop: '10px' }}
                  >
                    Edit Review
                  </button>
                </div>
              </div>
            ) : showReviewForm ? (
              <ReviewForm
                token={token}
                productId={id}
                existingReview={editingReview}
                onReviewSubmitted={handleReviewSubmitted}
              />
            ) : (
              <div>
                <button onClick={handleStartNewReview}>
                  Leave a Review
                </button>
              </div>
            )}
            
            {showReviewForm && (
              <button 
                onClick={() => setShowReviewForm(false)}
                style={{ marginLeft: '10px' }}
              >
                Cancel
              </button>
            )}
          </div>
        )}

        {token && !hasPurchased && (
          <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
            <p>Purchase this book to leave a review!</p>
          </div>
        )}

        {/* All Reviews */}
        <ReviewList
          productId={id}
          token={token}
          currentUserId={currentUser?.id}
          onEditReview={handleEditReview}
        />
      </div>
    </>
  );
}

export default SingleProduct;

