import React from "react";
import {
    FaTrain,
    FaWallet,
    FaGift,
    FaMoneyBillWave,
    FaStar,
    FaCalendarCheck
} from "react-icons/fa";

const StatsCards = ({ stats }) => {

    const cards = [
        {
            title: "Bookings",
            value: stats?.totalBookings ?? 0,
            icon: <FaTrain />
        },
        {
            title: "Money Spent",
            value: `₹${stats?.totalSpent ?? 0}`,
            icon: <FaWallet />
        },
        {
            title: "Reward Wallet",
            value: `₹${stats?.rewardWallet ?? 0}`,
            icon: <FaGift />
        },
        {
            title: "Refunds",
            value: `₹${stats?.refundAmount ?? 0}`,
            icon: <FaMoneyBillWave />
        },
        {
            title: "Feedback",
            value: stats?.feedbackCount ?? 0,
            icon: <FaStar />
        },
        {
            title: "Upcoming Trips",
            value: stats?.upcomingTrips ?? 0,
            icon: <FaCalendarCheck />
        }
    ];

    return (

        <div className="stats-grid">

            {
                cards.map((card, index) => (

                    <div
                        key={index}
                        className="dashboard-card stats-card"
                    >

                        <div className="icon-circle">
                            {card.icon}
                        </div>

                        <h2>
                            {card.value}
                        </h2>

                        <p className="card-subtitle">
                            {card.title}
                        </p>

                    </div>

                ))
            }

        </div>

    );

};

export default StatsCards;