import React from "react";
import {
    FaTrain,
    FaMapMarkerAlt,
    FaChair,
    FaCalendarAlt,
    FaClock
} from "react-icons/fa";

const UpcomingJourney = ({ journey }) => {

    if (!journey) {

        return (

            <div className="dashboard-card upcoming-card">

                <h2 className="card-title">
                    Upcoming Journey
                </h2>

                <p className="card-subtitle">
                    No upcoming journey available.
                </p>

            </div>

        );

    }

    return (

        <div className="dashboard-card upcoming-card">

            {/* Train Banner */}

            <div className="train-banner">

                <div className="train-icon">

                    <FaTrain />

                </div>

                <div>

                    <h2>
                        {journey.trainName}
                    </h2>

                    <p>
                        Train No : {journey.trainNo}
                    </p>

                </div>

            </div>

            {/* Route */}

            <div className="route-container">

                <h3>{journey.source}</h3>

                <FaTrain />

                <h3>{journey.destination}</h3>

            </div>

            {/* Journey Details */}

            <div className="journey-details">

                <div className="detail-box">

                    <FaCalendarAlt />

                    <div>

                        <span>Travel Date</span>

                        <h4>{journey.travelDate}</h4>

                    </div>

                </div>

                <div className="detail-box">

                    <FaChair />

                    <div>

                        <span>Coach / Seat</span>

                        <h4>

                            {journey.coach} / {journey.seatNumber}

                        </h4>

                    </div>

                </div>

                <div className="detail-box">

                    <FaMapMarkerAlt />

                    <div>

                        <span>Booking Code</span>

                        <h4>{journey.bookingCode}</h4>

                    </div>

                </div>

            </div>

            {/* Countdown */}

            <div className="countdown-box">

                <h2>

                    {journey.daysRemaining}

                </h2>

                <span>

                    <FaClock />

                    {" "}Days Remaining

                </span>

            </div>

        </div>

    );

};

export default UpcomingJourney;