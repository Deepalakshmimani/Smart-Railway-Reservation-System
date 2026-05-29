// AdminBookings.jsx

import React from "react";

import "./Bookings.css";

const bookings = [

  {
    id: "BK1021",
    passenger: "Deepa",
    train: "Chennai Express",
    route: "Chennai → Bangalore",
    coach: "S1",
    seats: "24, 25",
    amount: 900,
    status: "Confirmed",
    date: "15 May 2026"
  },

  {
    id: "BK1022",
    passenger: "Rahul",
    train: "Madurai Superfast",
    route: "Chennai → Madurai",
    coach: "A1",
    seats: "12",
    amount: 1200,
    status: "Cancelled",
    date: "16 May 2026"
  },

  {
    id: "BK1023",
    passenger: "Priya",
    train: "Coimbatore Intercity",
    route: "Salem → Coimbatore",
    coach: "C1",
    seats: "18, 19",
    amount: 700,
    status: "Pending",
    date: "17 May 2026"
  }

];

const Bookings = () => {

  const getStatusClass = (
    status
  ) => {

    if (status === "Confirmed") {
      return "confirmed";
    }

    if (status === "Cancelled") {
      return "cancelled";
    }

    return "pending";
  };

  return (

    <div className="admin-bookings-page">

      {/* Top */}

      <div className="booking-top">

        <div>

          <h1>
            Bookings
          </h1>

          <p>
            Manage passenger bookings
          </p>

        </div>

      </div>

      {/* Grid */}

      <div className="booking-grid">

        {bookings.map((item) => (

          <div
            key={item.id}
            className="booking-card"
          >

            {/* Header */}

            <div className="booking-header">

              <div>

                <h2>
                  {item.passenger}
                </h2>

                <span>
                  {item.id}
                </span>

              </div>

              <div
                className={`status-badge ${getStatusClass(
                  item.status
                )}`}
              >

                {item.status}

              </div>

            </div>

            {/* Train */}

            <div className="train-box">

              <h3>
                {item.train}
              </h3>

              <p>
                {item.route}
              </p>

            </div>

            {/* Details */}

            <div className="details-grid">

              <div>

                <p>
                  Coach
                </p>

                <h4>
                  {item.coach}
                </h4>

              </div>

              <div>

                <p>
                  Seats
                </p>

                <h4>
                  {item.seats}
                </h4>

              </div>

              <div>

                <p>
                  Amount
                </p>

                <h4>
                  ₹ {item.amount}
                </h4>

              </div>

              <div>

                <p>
                  Journey Date
                </p>

                <h4>
                  {item.date}
                </h4>

              </div>

            </div>

            {/* Footer */}

            <div className="booking-footer">

              <button className="view-btn">

                View Ticket

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Bookings;