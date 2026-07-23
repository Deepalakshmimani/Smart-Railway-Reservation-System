//Booking

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import BookingCard from "../components/BookingCard";

import "./Booking.css"


function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Access backend URL or Token from your AppContext
  const { backendUrl } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Retrieve token either from AppContext or directly from localStorage
        const response = await axios.get(
            `${backendUrl}/api/bookings/my-bookings`,
            {
                withCredentials: true,
            }
        );

        

        if (response.data.success) {
          setBookings(response.data.bookings || []);
        } else {
          setError(response.data.message || "Failed to load bookings.");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(
          err.response?.data?.message || 
          "Failed to connect to the server. Check your backend terminal or network console."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [backendUrl]);

  return (
  <div className="bookings-page">

    <h1>My Bookings</h1>

    {loading && (
      <p>Loading your bookings...</p>
    )}

    {!loading && error && (
      <p>{error}</p>
    )}

    {!loading && !error && bookings.length === 0 && (
      <div className="empty-bookings">
        <h2>No bookings found</h2>

        <p>You haven't booked any train tickets yet.</p>

        <button
          className="search-btn"
          onClick={() => navigate("/")}
        >
          Search Trains
        </button>
      </div>
    )}

    {!loading && !error && bookings.length > 0 && (
      <div className="bookings-container">

        {bookings.map((booking) => (
          <BookingCard
            key={booking.bookingId}
            booking={booking}
          />
        ))}

      </div>
    )}

  </div>
);
}

export default Bookings;