import React from "react";
import "./CoachCard.css";

const CoachCard = ({ coach, onSelect }) => {

    return (

        <div className="coach-card">

            <div className="coach-header">

                <h2>{coach.coach_type.replaceAll("_", " ")}</h2>

                <span className="coach-count">
                    {coach.coaches} Coaches
                </span>

            </div>

            <div className="coach-price">

                ₹ {coach.base_price}

            </div>

            <div className="coach-seats">

                🎫 {coach.available_seats} Seats Available

            </div>

            <button
                className="coach-btn"
                onClick={() => onSelect(coach)}
            >
                Select Coach
            </button>

        </div>

    );

};

export default CoachCard;