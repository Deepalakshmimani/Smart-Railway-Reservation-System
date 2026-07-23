import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

import "./Ticket.css";

function Ticket() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useAppContext();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${backendUrl}/api/bookings/ticket/${bookingId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setTicket(response.data.ticket);
        } else {
          setError(response.data.message || "Failed to load ticket.");
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to load ticket."
        );
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchTicketDetails();
    }
  }, [bookingId, backendUrl]);

  const handleDownloadPDF = () => {
    window.open(`${backendUrl}/api/pdf/download/${bookingId}`, "_blank");
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="ticket-page">
        <div className="ticket-card" style={{ textAlign: "center", padding: "40px" }}>
          <h2>Loading ticket details...</h2>
        </div>
      </div>
    );
  }

  // 2. Error / Missing Ticket State
  if (error || !ticket) {
    return (
      <div className="ticket-page">
        <div className="ticket-card" style={{ textAlign: "center", padding: "40px" }}>
          <h2 style={{ color: "#d9534f" }}>{error || "Ticket not found."}</h2>
          <button
            className="back-btn"
            style={{ marginTop: "20px" }}
            onClick={() => navigate("/bookings")}
          >
            ← Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  // 3. Safe Property Extractions (Runs ONLY when ticket exists and loading is complete)
  const bookingCode = ticket.booking_code || ticket.bookingCode || "N/A";
  const trainName = ticket.train_name || ticket.trainName || "N/A";
  const trainNo = ticket.train_no || ticket.trainNo || "N/A";
  const source = ticket.source || "N/A";
  const destination = ticket.destination || "N/A";
  const status = ticket.status || "CONFIRMED";
  const coachType = ticket.coach_type || ticket.coachType || "GENERAL";
  const totalAmount = ticket.total_amount || ticket.totalAmount || 0;
  const passengers = ticket.passengers || [];
  const seats = ticket.seats || [];

  const rawDate = ticket.travel_date || ticket.travelDate;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  // 4. Main Component Render
  return (
    <div className="ticket-page">
      {/* Top Action Buttons */}
      <div className="ticket-top">
        <button className="back-btn" onClick={() => navigate("/bookings")}>
          ← Back to My Bookings
        </button>

        <button className="download-btn" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>

      {/* Ticket Card */}
      <div className="ticket-card">
        {/* Header */}
        <div className="ticket-header">
          <div>
            <h1>RailGo</h1>
            <p>Electronic Train Ticket</p>
          </div>
          <div className="ticket-status">{status}</div>
        </div>

        {/* Summary Details */}
        <div className="ticket-summary">
          <div className="summary-item">
            <label>Booking Code</label>
            <span>{bookingCode}</span>
          </div>

          <div className="summary-item">
            <label>Train</label>
            <span>
              {trainName} ({trainNo})
            </span>
          </div>

          <div className="summary-item">
            <label>Route</label>
            <span>
              {source} → {destination}
            </span>
          </div>

          <div className="summary-item">
            <label>Travel Date</label>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Passenger List */}
        <div className="ticket-passengers">
          <h2>Passenger Details</h2>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Seat</th>
              </tr>
            </thead>
            <tbody>
              {passengers.length > 0 ? (
                passengers.map((p, index) => {
                  const seat = seats[index];
                  const seatNumber = seat
                    ? `${seat.coach_name || seat.coachName || ""}-${
                        seat.seat_number || seat.seatNumber || ""
                      }`
                    : "Assigned";

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{p.passenger_name || p.name || "N/A"}</td>
                      <td>{p.age || "N/A"}</td>
                      <td>{p.gender || "N/A"}</td>
                      <td>{seatNumber}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5">No Passenger Information Available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="ticket-footer">
          <div>
            <strong>Coach Type: </strong>
            <span>{coachType}</span>
          </div>
          <div>
            <strong>Total Amount: </strong>
            <span className="ticket-price">
              ₹{Number(totalAmount).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ticket;