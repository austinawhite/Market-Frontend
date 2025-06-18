import { useState } from "react";

//! Need to connect this to the backend 
//! Need to make sure that the user can not leave multiple reviews for the same product, should only be able to edit or remove the existing review 
//! When review is submitted, hide form or give option to edit existing review 

//This component is shown to users who have previously purchased the product, giving them the ability to leave a review. 


export default function ReviewForm() {

const [rating, setRating] = useState(0);
const [hoverRating, setHoverRating] = useState(0);
const [comment, setComment] = useState ('');

const handleSubmit = (e) => {
    e.preventDefault();

    // checking for rating selection 
    if (rating === 0) {
        alert ('Please select a rating');
        return;
    }
    
    // check for comment 
    if (comment.trim() === '') {
        alert ('Please leave a comment with your rating');
        return; 
    }

    console.log('Review successfully submitted!', {
        rating: rating,
        comment: comment.trim()
    });

    alert ('Thanks for your review!');

    setRating(0);
    setComment('');
};

// Star rating functionality 

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

// Review form 

return (
<div>
    <div> 
        <h2> Leave A Review </h2> 
        <p> Did your family enjoy this book? </p>
    </div>


    <form onSubmit={handleSubmit}> 
        <div id="rating">
            <label> Rating </label>
            {renderStars()}
            <p> {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'} </p>
        </div>

        <div> 
            <label htmlFor="comment"> Review </label> 
            <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)}  rows={4} /> 
        </div>

        <div>
            <button type="submit"> Submit Review </button>
            </div>
    </form>
    
</div>
);
}