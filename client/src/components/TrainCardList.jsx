import React from 'react'
import "./TrainCardList.css"

import { useAppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import toast from "react-hot-toast";

const TrainCardList = ({
    title,
    trains
}) => {

  const {user,selectedDate,navigate,setShowUserLogin}=useAppContext();

  return (
    <div className="recommended">

      <h2>{title}</h2>

      <div className="train-container">

        {trains.map((train) => {

          
          const availability = train.bookings?.find(
            item => item.date === selectedDate
           
          );
          

          return (

            <div key={train.train_id} className="train-card">

              <div className="train-info">

                <div className="top-row">
                  <h3>{train.train_name}</h3>
                  <span className="rating">⭐ {train.rating}</span>
                </div>

                <p className="route">
                    {train.source_station}
                    {" → "}
                    {train.destination_station}
                </p>

                <div className="timing">

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

                <div className="bottom-row">

                  <div>
                    <p className="type">{train.train_no}</p>

                    
                  </div>

                  <div className="price-section">
                    <h3 className="price">₹ {train.starting_price}</h3>

                    {train.reason && (
                      <p className="reason">{train.reason}</p>
                    )}
                  </div>

                </div>

                

               <button
                onClick={() => {
                  if (user) {
                    console.log("Clicked Train:", train);
                    navigate(`/coach-selection/${train.train_id}`)
                  } else {
                    toast.error("Please login first");
                    setShowUserLogin(true);
                  }
                }}
                className="book-btn"
              >
                View Details
              </button>

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
};

export default TrainCardList;