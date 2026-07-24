import React from "react";
import {
    FaTrain,
    FaMoneyBillWave,
    FaUndo,
    FaStar,
    FaCheckCircle
} from "react-icons/fa";

const getIcon = (type) => {

    switch (type) {

        case "BOOKING":
            return <FaTrain />;

        case "PAYMENT":
            return <FaMoneyBillWave />;

        case "REFUND":
            return <FaUndo />;

        case "FEEDBACK":
            return <FaStar />;

        default:
            return <FaCheckCircle />;
    }

};

const ActivityTimeline = ({ activities = [] }) => {

    return (

        <div className="dashboard-card">

            <h2 className="card-title">

                Recent Activity

            </h2>

            <p className="card-subtitle">

                Your latest railway activities

            </p>

            <div className="activity-timeline">

                {

                    activities.length === 0 ?

                        (

                            <p className="card-subtitle">

                                No recent activities available.

                            </p>

                        )

                        :

                        (

                            activities.map((activity, index) => (

                                <div
                                    key={index}
                                    className="activity-item"
                                >

                                    <div className="icon-circle">

                                        {getIcon(activity.type)}

                                    </div>

                                    <div
                                        style={{
                                            flex: 1
                                        }}
                                    >

                                        <h4
                                            style={{
                                                margin: 0
                                            }}
                                        >

                                            {activity.title}

                                        </h4>

                                        <p
                                            style={{
                                                margin: "6px 0",
                                                color: "#6B7280"
                                            }}
                                        >

                                            {activity.description}

                                        </p>

                                    </div>

                                    <span
                                        style={{
                                            color: "#9CA3AF",
                                            fontSize: "14px"
                                        }}
                                    >

                                        {activity.time}

                                    </span>

                                </div>

                            ))

                        )

                }

            </div>

        </div>

    );

};

export default ActivityTimeline;