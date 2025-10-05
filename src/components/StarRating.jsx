import React, { useState } from 'react';

const StarRating = ({ onRate }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const starStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    fontSize: '2.5rem',
    padding: '2px',
    transition: 'transform 0.1s ease-in-out',
  };

  const starOnStyle = {
    color: '#fdd835', // Yellow color for a selected star
  };

  const starOffStyle = {
    color: '#e0e0e0', // Grey color for an unselected star
  };

  return (
    <div>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            style={starStyle}
            onClick={() => {
                setRating(ratingValue);
                if (onRate) {
                    onRate(ratingValue);
                }
            }}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            <span style={ratingValue <= (hover || rating) ? starOnStyle : starOffStyle}>
              &#9733;
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;

