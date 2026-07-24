import React from "react";
import { useNavigate } from "react-router-dom";

import {
    FaSearch,
    FaHistory,
    FaTicketAlt,
    FaStar,
    FaWallet,
    FaUser
} from "react-icons/fa";

const QuickActions = () => {

    const navigate = useNavigate();

    const actions = [

        {
            title: "Book Ticket",
            icon: <FaSearch />,
            path: "/search-trains"
        },

        {
            title: "My Bookings",
            icon: <FaHistory />,
            path: "/bookings"
        },

        {
            title: "My Tickets",
            icon: <FaTicketAlt />,
            path: "/tickets"
        },

        {
            title: "Feedback",
            icon: <FaStar />,
            path: "/feedback"
        },

        {
            title: "Rewards",
            icon: <FaWallet />,
            path: "/rewards"
        },

        {
            title: "Profile",
            icon: <FaUser />,
            path: "/profile"
        }

    ];

    return (

        <div className="dashboard-card">

            <h2 className="card-title">

                Quick Actions

            </h2>

            <p className="card-subtitle">

                Frequently used shortcuts

            </p>

            <div className="quick-actions-grid">

                {

                    actions.map((action, index) => (

                        <button

                            key={index}

                            className="quick-action-btn"

                            onClick={() => navigate(action.path)}

                        >

                            <div className="icon-circle">

                                {action.icon}

                            </div>

                            <span>

                                {action.title}

                            </span>

                        </button>

                    ))

                }

            </div>

        </div>

    );

};

export default QuickActions;