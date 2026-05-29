// TrainList.jsx

import React from "react";

import "./TrainList.css";

import { useNavigate } from "react-router-dom";

const trains = [

  {
    id: 1,
    train: "Chennai Express",
    source: "Chennai",
    destination: "Bangalore",
    departure: "06:00 AM",
    arrival: "12:00 PM",
    coachTypes: "Sleeper, AC",
    coaches: 4,
    totalSeats: 240,
    availableSeats: 32,
    price: 450,
    status: "Available",
    runningDays: [
      "Mon",
      "Tue",
      "Wed",
      "Fri"
    ]
  },

  {
    id: 2,
    train: "Madurai Superfast",
    source: "Chennai",
    destination: "Madurai",
    departure: "09:30 PM",
    arrival: "06:00 AM",
    coachTypes: "Sleeper",
    coaches: 3,
    totalSeats: 180,
    availableSeats: 12,
    price: 620,
    status: "Delayed",
    runningDays: [
      "Mon",
      "Thu",
      "Sat"
    ]
  },

  {
    id: 3,
    train: "Coimbatore Intercity",
    source: "Salem",
    destination: "Coimbatore",
    departure: "08:15 AM",
    arrival: "11:45 AM",
    coachTypes: "Chair Car, AC",
    coaches: 5,
    totalSeats: 300,
    availableSeats: 95,
    price: 350,
    status: "Maintenance",
    runningDays: [
      "Tue",
      "Wed",
      "Sun"
    ]
  },

  {
    id: 3,
    train: "Coimbatore Intercity",
    source: "Salem",
    destination: "Coimbatore",
    departure: "08:15 AM",
    arrival: "11:45 AM",
    coachTypes: "Chair Car, AC",
    coaches: 5,
    totalSeats: 300,
    availableSeats: 95,
    price: 350,
    status: "Maintenance",
    runningDays: [
      "Tue",
      "Wed",
      "Sun"
    ]
  }

];

const TrainList = () => {

  const navigate = useNavigate();

  const getOccupancy = (
    total,
    available
  ) => {

    return Math.round(
      ((total - available) / total)
      * 100
    );
  };

  const getOccupancyClass = (
    occupancy
  ) => {

    if (occupancy >= 75) {
      return "high";
    }

    if (occupancy >= 40) {
      return "medium";
    }

    return "low";
  };

  const getStatusClass = (
    status
  ) => {

    if (status === "Available") {
      return "available";
    }

    if (status === "Delayed") {
      return "delayed";
    }

    if (status === "Cancelled") {
      return "cancelled";
    }

    return "maintenance";
  };

  return (

    <div className="train-list-page">

      <div className="train-top">

        <h1>
          Train List
        </h1>

      </div>

      {/* Grid Cards */}

      <div className="train-grid">

        {trains.map((item) => {

          const occupancy =
            getOccupancy(
              item.totalSeats,
              item.availableSeats
            );

          return (

            <div
              key={item.id}
              className="train-card"
            >

              {/* Top */}

              <div className="card-top">

                <div>

                  <h2>
                    {item.train}
                  </h2>

                  <p className="route">

                    {item.source}

                    {" → "}

                    {item.destination}

                  </p>

                </div>

                <span
                  className={`status-badge ${getStatusClass(
                    item.status
                  )}`}
                >

                  {item.status}

                </span>

              </div>

              {/* Timings */}

              <div className="time-section">

                <div>

                  <p className="label">
                    Departure
                  </p>

                  <span className="time departure">

                    {item.departure}

                  </span>

                </div>

                <div>

                  <p className="label">
                    Arrival
                  </p>

                  <span className="time arrival">

                    {item.arrival}

                  </span>

                </div>

              </div>

              {/* Running Days */}

              <div className="section">

                <p className="section-title">

                  Running Days

                </p>

                <div className="days-box">

                  {item.runningDays.map(
                    (day, index) => (

                      <span
                        key={index}
                        className="day-badge"
                      >

                        {day}

                      </span>

                    )
                  )}

                </div>

              </div>

              {/* Details */}

              <div className="details-grid">

                <div>

                  <p className="label">
                    Coaches
                  </p>

                  <h4>
                    {item.coaches}
                  </h4>

                </div>

                <div>

                  <p className="label">
                    Coach Types
                  </p>

                  <h4>
                    {item.coachTypes}
                  </h4>

                </div>

                <div>

                  <p className="label">
                    Total Seats
                  </p>

                  <h4>
                    {item.totalSeats}
                  </h4>

                </div>

                <div>

                  <p className="label">
                    Available
                  </p>

                  <h4>
                    {item.availableSeats}
                  </h4>

                </div>

              </div>

              {/* Occupancy */}

              <div className="occupancy-section">

                <div className="occupancy-top">

                  <p className="section-title">

                    Occupancy

                  </p>

                  <span>

                    {occupancy}%

                  </span>

                </div>

                <div className="progress-bar">

                  <div
                    className={`progress-fill ${getOccupancyClass(
                      occupancy
                    )}`}
                    style={{
                      width:
                        `${occupancy}%`
                    }}
                  />

                </div>

              </div>

              {/* Bottom */}

              <div className="card-bottom">

                <h3 className="price">

                  ₹ {item.price}

                </h3>

                <button
                  className="update-btn"
                  onClick={() =>
                    navigate(
                      `/admin/dashboard/update-train/${item.id}`
                    )
                  }
                >

                  Update

                </button>

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
};

export default TrainList;