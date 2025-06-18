import { useState } from "react";

// This component will be used to show the user the product reviews that they previously submitted. It also gives them the ability to edit and delete the product review. 

//! Show the product reviews in order by date submitted. 

const BookReviews = ({ reviews = [] }) => {

  return (
    <div>
      <div>
{/* Header Section  */}
        <h2> Verified Reviews </h2>
        <p>
          Each review has been submitted by a verified product owner. 
        </p>
      </div>

      {reviews.length === 0 ? (
        <div>
          <p> There are currently no verified reviews </p>
        </div>
      ) : (

        <div>
          {reviews.map((review, index) => (
            <div key={index}>
              <div>
                <span>
                  {review.date}
                </span>
              </div>
              
              <div>
                {review.comment}
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default BookReviews; 