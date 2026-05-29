import React from 'react'
import "./RecommendedTrains.css"

import { useAppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';
import toast from "react-hot-toast";

const Recommended = ({trains}) => {

  const {user,selectedDate,navigate,setShowUserLogin}=useAppContext();

  return (
    <div className="recommended">

      <h2>{trains.length==3?"Recommended":trains.length===1?"Details":"All"} Trains</h2>

      <div className="train-container">

        {trains.map((train) => {

          
           

          const availability = train.bookings?.find(
            item => item.date === selectedDate
           
          );
          

          return (

            <div key={train.id} className="train-card">

              <div className="train-info">

                <div className="top-row">
                  <h3>{train.name}</h3>
                  <span className="rating">⭐ {train.rating}</span>
                </div>

                <p className="route">{train.route}</p>

                <div className="timing">

                  <div>
                    <h4>{train.departure}</h4>
                    <span>Departure</span>
                  </div>

                  <div className="duration">
                    ⏱ {train.duration}
                  </div>

                  <div>
                    <h4>{train.arrival}</h4>
                    <span>Arrival</span>
                  </div>

                </div>

                <div className="bottom-row">

                  <div>
                    <p className="type">{train.type}</p>

                    {trains.length === 1 && (
                      <p className="seats">
                        🎫 {availability?.availableSeats || 0} Seats Available
                      </p>
                    )}
                  </div>

                  <div className="price-section">
                    <h3 className="price">₹ {train.price}</h3>

                    {train.reason && (
                      <p className="reason">{train.reason}</p>
                    )}
                  </div>

                </div>

               <button
                onClick={() => {
                  if (user) {
                    navigate(`/book/${train.id}`);
                  } else {
                    toast.error("Please login first");
                    setShowUserLogin(true);
                  }
                }}
                className="book-btn"
              >
                Book Now
              </button>

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
};

export default Recommended;