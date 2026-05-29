// MyBookings.jsx

import React from "react";
import "./MyBookings.css";
import { bookings } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const MyBookings = () => {
   
  const {navigate}=useAppContext();
  const ticketFun=(item)=>
  {
    navigate(`/viewticket/${item.id}`);
    
  }
 

  return (

    <div className="bookings-page">

      <h1>My Bookings</h1>

      <div className="bookings-container">

        {bookings.map((item) => (

          <div key={item.id} className="booking-card">

            <div className="top-section">

              <h2>
                {item.train} ⭐
              </h2>

              <span className="status">
                {item.status}
              </span>

            </div>

            <p className="route">
              {item.from} → {item.to}
            </p>

            <div className="booking-info">

              <p>📅 {item.date}</p>

              <p>
                ⏰ {item.departure} → {item.arrival}
              </p>

              <p>
                👤 Passenger: {item.passenger}
              </p>

              <p>
                🎫 Seats: {item.seats}
              </p>

              <p>
                💳 ₹ {item.amount}
              </p>

            </div>

            <div className="booking-buttons">

              <button onClick={()=>ticketFun(item)}className="view-btn">
                View Ticket
              </button>

              {/* <button className="download-btn">
                Download Ticket
              </button> */}

              {item.status==='Confirmed' && <button onClick={()=>navigate('/cancelbooking')} className="cancel-btn">
                Cancel Ticket
              </button>}

              {item.status==='Confirmed' &&<button onClick={()=>navigate('/feedback')} className="feedback-btn">
                Feedback
              </button>}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default MyBookings;