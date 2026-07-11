// TrainList.jsx
import React, { useEffect, useState } from "react";
import "./TrainList.css";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";



const TrainList = () => {
  const navigate = useNavigate();
  const { axios, backendUrl } = useAppContext();
  const [trains, setTrains] = useState([]);
  const [showDeleted, setShowDeleted] =
  useState(false);

  const fetchTrains = async () => {
    try {
      const { data } = await axios.get(

          `${backendUrl}/api/trains/list`,
          {
              params: {
                  is_active: !showDeleted
              }
          }
      );

      if (data.success) {
        setTrains(data.trains);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, [showDeleted]);

  const getStatusClass = (status) => {
    if (status === "Available") return "available";
    if (status === "Delayed") return "delayed";
    if (status === "Cancelled") return "cancelled";
    return "maintenance";
  };



const deleteTrain = async (trainId) => {

    try {

        const confirmDelete = window.confirm(

            "Are you sure you want to delete this train?"

        );

        if (!confirmDelete) return;

        const { data } = await axios.put(

            `${backendUrl}/api/trains/delete/${trainId}`,

            {},

            {
                withCredentials: true
            }

        );

        if (data.success) {

            toast.success(data.message);

            fetchTrains();

        } else {

            toast.error(data.message);

        }

    } catch (error) {

        console.error(error);

        toast.error("Something went wrong");

    }

};


const restoreTrain = async (trainId) => {

  try {

    const { data } = await axios.put(

      `${backendUrl}/api/trains/restore/${trainId}`,

      {},

      {
        withCredentials: true
      }

    );

    if (data.success) {

      toast.success(data.message);

      fetchTrains();

    } else {

      toast.error(data.message);

    }

  } catch (error) {

    console.error(error);

    toast.error("Something went wrong");

  }

};

  return (
    <div className="train-list-page">
      <div className="train-top">

      <button

          className="toggle-btn"

          onClick={() =>

              setShowDeleted(

                  !showDeleted

              )

          }

      >

          {

              showDeleted

              ?

              "Show Active"

              :

              "Show Deleted"

          }

      </button>
      
        <h1>  Train List</h1>
      </div>

      {/* Grid Cards */}
      <div className="train-grid">
        {trains.map((item) => {
          return (
            <div key={item.train_id} className="train-card">
              {/* Top */}
              <div className="card-top">
                <div>
                  <h2>{item.train}</h2>
                  <p className="route">
                    {item.source} {" → "} {item.destination}
                  </p>
                </div>
                <span className={`status-badge ${getStatusClass(item.status)}`}>
                  {item.status}
                </span>
              </div>

              {/* Timings */}
              <div className="time-section">
                <div>
                  <p className="label">Departure</p>
                  <span className="time departure">{item.departure}</span>
                </div>
                <div>
                  <p className="label">Arrival</p>
                  <span className="time arrival">{item.arrival}</span>
                </div>
              </div>

              {/* Running Days */}
              <div className="section">
                <p className="section-title">Running Days</p>
                <div className="days-box">
                  {item.runningDays?.map((day, index) => (
                    <span key={index} className="day-badge">
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="details-grid">
                <div>
                  <p className="label">Coaches</p>
                  <h4>{item.coaches}</h4>
                </div>
                <div>
                  <p className="label">Coach Types</p>
                  <h4>{item.coachTypes}</h4>
                </div>
                <div>
                  <p className="label">Total Seats</p>
                  <h4>{item.totalSeats}</h4>
                </div>
                <div>
                  <p className="label">Starting Fare</p>
                  <h4>₹ {item.price}</h4>
                </div>
              </div>

              {/* Bottom */}

              <div className="card-bottom">

                <button
                  className="update-btn"
                  onClick={() =>
                    navigate(`/admin/dashboard/update-train/${item.train_id}`)
                  }
                >
                  Update
                </button>

                {showDeleted ? (

                  <button
                    className="restore-btn"
                    onClick={() => restoreTrain(item.train_id)}
                  >
                    Restore
                  </button>

                ) : (

                  <button
                    className="delete-btn"
                    onClick={() => deleteTrain(item.train_id)}
                  >
                    Delete
                  </button>

                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainList;