import React, { useState } from "react";
import "./RecommendedTrainCard.css";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RecommendedTrainCard = ({ train }) => {

    const {
        user,
        navigate,
        setShowUserLogin
    } = useAppContext();

    const [showReason, setShowReason] = useState(false);

    return (

        <div className="recommended-train-card">

            {/* AI Header */}

            <div className="recommend-header">

                <span className="ai-tag">
                    🤖 AI Recommended
                </span>

            </div>

            {/* Train Name */}

            <div className="recommend-top">

                <h3>{train.train_name}</h3>

                <span className="rating">
                    ⭐ {train.rating}
                </span>

            </div>

            {/* Route */}

            <p className="route">

                {train.source_station}

                {" → "}

                {train.destination_station}

            </p>

            {/* Time */}

            <div className="recommend-time">

                <div>

                    <h4>{train.departure_time}</h4>

                    <span>Departure</span>

                </div>

                <div className="duration">

                    ⏱ {train.duration}

                </div>

                <div>

                    <h4>{train.arrival_time}</h4>

                    <span>Arrival</span>

                </div>

            </div>

            {/* Overall Reason */}

            <div className="overall-reason">

                🟢 {train.overall_reason}

            </div>

            {/* Dropdown */}

            <div className="why-section">

                <button

                    className="why-button"

                    onClick={() =>

                        setShowReason(

                            !showReason

                        )

                    }

                >

                    {showReason

                        ? "▲ Why this train?"

                        : "▼ Why this train?"}

                </button>

                {showReason && (

                    <ul className="reason-list">

                        {train.reason.map(

                            (reason, index) => (

                                <li key={index}>

                                    ✓ {reason}

                                </li>

                            )

                        )}

                    </ul>

                )}

            </div>

            {/* Footer */}

            <div className="recommend-footer">

                <h3>

                    ₹ {train.starting_price ?? "--"}

                </h3>

                <button

                    className="book-btn"

                    onClick={() => {

                        if (user) {

                            navigate(

                                `/coach-selection/${train.train_id}`

                            );

                        } else {

                            toast.error(

                                "Please login first"

                            );

                            setShowUserLogin(true);

                        }

                    }}

                >

                    View Details

                </button>

            </div>

        </div>

    );

};

export default RecommendedTrainCard;