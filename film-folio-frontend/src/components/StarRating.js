import {useState} from "react";

const StarRating = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="star-rating">
            {[...Array(10)].map((_, i) => (
                <span
                    key={i}
                    className={i < (hoverRating || rating) ? 'filled' : ''}
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                >
          ★
        </span>
            ))}
        </div>
    );
};

export default StarRating;