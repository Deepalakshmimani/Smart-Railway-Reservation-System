// Notifications.jsx

import React from "react";
import "./Notifications.css";

const Notifications = () => {

  const notifications = [

    {
      id: 1,
      title: "Booking Confirmed",
      message:
        "Your Chennai Express ticket has been confirmed successfully.",
      time: "2 mins ago",
      type: "success"
    },

    {
      id: 2,
      title: "Train Delayed",
      message:
        "Vaigai Express is delayed by 25 minutes.",
      time: "15 mins ago",
      type: "warning"
    },

    {
      id: 3,
      title: "Refund Processed",
      message:
        "₹850 refund has been added to your wallet.",
      time: "1 hour ago",
      type: "info"
    },

    {
      id: 4,
      title: "Feedback Reward",
      message:
        "₹10 reward credits added for your feedback.",
      time: "Today",
      type: "reward"
    }

  ];

  return (

    <div className="notifications-page">

      <div className="notifications-card">

        <div className="notification-header">

          <h1>Notifications</h1>

          <span>
            {notifications.length}
            {" "}
            New
          </span>

        </div>

        <div className="notification-list">

          {notifications.map((item) => (

            <div
              key={item.id}
              className={`notification-item ${item.type}`}
            >

              <div className="notification-content">

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.message}
                </p>

              </div>

              <span className="time">
                {item.time}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default Notifications;