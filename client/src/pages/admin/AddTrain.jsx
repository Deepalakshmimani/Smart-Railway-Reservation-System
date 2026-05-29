// AddTrain.jsx

import React, {
  useEffect,
  useState
} from "react";

import "./AddTrain.css";

import toast from "react-hot-toast";

import { useParams } from "react-router-dom";

import { useAppContext } from "../../context/AppContext";

/* Dummy Train Data */

const trains = [

  {
    id: 1,
    trainName: "Chennai Express",
    trainNumber: "12601",
    source: "Chennai",
    destination: "Bangalore",
    departure: "06:00",
    arrival: "12:00",
    acSleeperCoaches: 1,
    sleeperCoaches: 2,
    chairCoaches: 1,
    generalCoaches: 1,
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
    trainName: "Madurai Superfast",
    trainNumber: "12622",
    source: "Chennai",
    destination: "Madurai",
    departure: "21:30",
    arrival: "06:00",
    acSleeperCoaches: 0,
    sleeperCoaches: 3,
    chairCoaches: 0,
    generalCoaches: 2,
    price: 620,
    status: "Delayed",
    runningDays: [
      "Mon",
      "Thu",
      "Sat"
    ]
  }

];

const AddTrain = () => {

  const { id } = useParams();

  const { navigate } =
    useAppContext();

  const [trainData, setTrainData] =
    useState({

      trainName: "",
      trainNumber: "",
      source: "",
      destination: "",
      departure: "",
      arrival: "",

      acSleeperCoaches: 0,
      sleeperCoaches: 0,
      chairCoaches: 0,
      generalCoaches: 0,

      price: "",

      status: "Available",

      runningDays: []

    });

  /* Prefill Data */

  useEffect(() => {

    if (id) {

      const train =
        trains.find(
          item =>
            item.id === Number(id)
        );

      if (train) {

        setTrainData(train);

      }
    }

  }, [id]);

  /* Handle Change */

  const handleChange = (e) => {

    setTrainData({
      ...trainData,
      [e.target.name]:
        e.target.value
    });
  };

  /* Running Days */

  const handleDayChange = (day) => {

    if (
      trainData.runningDays.includes(day)
    ) {

      setTrainData({
        ...trainData,
        runningDays:
          trainData.runningDays.filter(
            item => item !== day
          )
      });

    } else {

      setTrainData({
        ...trainData,
        runningDays: [
          ...trainData.runningDays,
          day
        ]
      });
    }
  };

  /* Submit */

  const handleSubmit = (e) => {

    e.preventDefault();

    if (id) {

      toast.success(
        "Train Updated Successfully 🚆"
      );

    } else {

      toast.success(
        "Train Added Successfully 🚆"
      );
    }

    console.log(trainData);

    navigate(
      "/admin/dashboard/trains"
    );
  };

  const days = [

    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"

  ];

  return (

    <div className="add-train-page">

      <div className="add-train-card">

        {/* Heading */}

        <div className="top-section">

          <div>

            <h1>

              {id
                ? "Update Train"
                : "Add Train"}

            </h1>

            <p className="subtitle">

              {id
                ? "Modify train details"
                : "Add new railway service"}

            </p>

          </div>

          <div className="train-badge">

            🚆 Railway Admin

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Train Details */}

          <div className="form-section">

            <h3>
              Train Details
            </h3>

            <div className="row">

              <div className="form-group">

                <label>
                  Train Name
                </label>

                <input
                  type="text"
                  name="trainName"
                  placeholder="Enter train name"
                  value={trainData.trainName}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Train Number
                </label>

                <input
                  type="text"
                  name="trainNumber"
                  placeholder="Enter train number"
                  value={trainData.trainNumber}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </div>

          {/* Route */}

          <div className="form-section">

            <h3>
              Route Information
            </h3>

            <div className="row">

              <div className="form-group">

                <label>
                  Source
                </label>

                <input
                  type="text"
                  name="source"
                  placeholder="Starting city"
                  value={trainData.source}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Destination
                </label>

                <input
                  type="text"
                  name="destination"
                  placeholder="Destination city"
                  value={trainData.destination}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </div>

          {/* Timings */}

          <div className="form-section">

            <h3>
              Timings
            </h3>

            <div className="row">

              <div className="form-group">

                <label>
                  Departure
                </label>

                <input
                  type="time"
                  name="departure"
                  value={trainData.departure}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Arrival
                </label>

                <input
                  type="time"
                  name="arrival"
                  value={trainData.arrival}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </div>

          {/* Coach Configuration */}

          <div className="coach-section">

            <h3>
              Coach Configuration
            </h3>

            <div className="coach-grid">

              <div className="coach-box">

                <p>
                  AC Sleeper
                </p>

                <input
                  type="number"
                  name="acSleeperCoaches"
                  value={
                    trainData.acSleeperCoaches
                  }
                  onChange={handleChange}
                  min="0"
                />

              </div>

              <div className="coach-box">

                <p>
                  Sleeper
                </p>

                <input
                  type="number"
                  name="sleeperCoaches"
                  value={
                    trainData.sleeperCoaches
                  }
                  onChange={handleChange}
                  min="0"
                />

              </div>

              <div className="coach-box">

                <p>
                  Chair Car
                </p>

                <input
                  type="number"
                  name="chairCoaches"
                  value={
                    trainData.chairCoaches
                  }
                  onChange={handleChange}
                  min="0"
                />

              </div>

              <div className="coach-box">

                <p>
                  General
                </p>

                <input
                  type="number"
                  name="generalCoaches"
                  value={
                    trainData.generalCoaches
                  }
                  onChange={handleChange}
                  min="0"
                />

              </div>

            </div>

          </div>

          {/* Price & Status */}

          <div className="form-section">

            <h3>
              Pricing & Status
            </h3>

            <div className="row">

              <div className="form-group">

                <label>
                  Base Price
                </label>

                <input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={trainData.price}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Train Status
                </label>

                <select
                  name="status"
                  value={trainData.status}
                  onChange={handleChange}
                >

                  <option>
                    Available
                  </option>

                  <option>
                    Delayed
                  </option>

                  <option>
                    Cancelled
                  </option>

                  <option>
                    Maintenance
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* Running Days */}

          <div className="days-section">

            <label>
              Running Days
            </label>

            <div className="days-container">

              {days.map((day) => (

                <button
                  type="button"
                  key={day}
                  className={
                    trainData.runningDays.includes(
                      day
                    )
                      ? "day-btn active"
                      : "day-btn"
                  }
                  onClick={() =>
                    handleDayChange(day)
                  }
                >

                  {day}

                </button>

              ))}

            </div>

          </div>

          {/* Submit */}

          <button
            type="submit"
            className="submit-btn"
          >

            {id
              ? "Save Changes"
              : "Add Train"}

          </button>

        </form>

      </div>

    </div>
  );
};

export default AddTrain;