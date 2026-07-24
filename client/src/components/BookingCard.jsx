import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // 1. Import context
import "./BookingPage.css";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "--:--";

  const [hour, minute] = timeString.split(":");

  return new Date(
    2000,
    0,
    1,
    Number(hour),
    Number(minute)
  ).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};




const canCancelTicket = (travelDate, departureTime, status) => {
  if (status !== "CONFIRMED") {
    return false;
  }

  const departure = new Date(travelDate);
  const [hour, minute] = departureTime.split(":");

  departure.setHours(
    Number(hour),
    Number(minute),
    0,
    0
  );

  return new Date() < departure;
};


const canGiveFeedback = (
  travelDate,
  arrivalTime,
  status
) => {

  if (status !== "CONFIRMED") {
    return false;
  }

  const arrival = new Date(travelDate);

  const [hour, minute] =
    arrivalTime.split(":");

  arrival.setHours(
    Number(hour),
    Number(minute),
    0,
    0
  );

  return new Date() > arrival;

};


const BookingCard = ({ booking }) => {
  const navigate = useNavigate();
  const { backendUrl } = useAppContext(); // 2. Extract backendUrl from context

  const {
    bookingId,
    bookingCode,
    trainName,
    trainNo,
    source,
    destination,
    travelDate,
    departureTime,
    arrivalTime,
    coachType,
    status,
    passengerName,
    passengerCount,
    totalAmount,
  } = booking;

  const passengerDisplay =
    passengerCount > 1
      ? `${passengerName || "Passenger"} (+${passengerCount - 1})`
      : passengerName || "Passenger";

  const handleViewTicket = () => {
    navigate(`/ticket/${bookingId}`);
  };

  const handleCancelTicket = () => {
    navigate(`/cancel-ticket/${bookingId}`);
  };


  const handleGiveFeedback = () => {

    navigate("/feedback", {

      state: {

        bookingId

      }

    });

  };


  // Optional: If you decide to keep or use download anywhere else
  const handleDownloadPDF = () => {
    window.open(
      `${backendUrl}/api/pdf/download/${bookingId}`, // 3. Used backendUrl here instead of import.meta.env
      "_blank"
    );
  };


  const getStatusClass = (status) => {

    switch (status) {

      case "CONFIRMED":
        return "status-confirmed";

      case "CANCELLED":
        return "status-cancelled";

      case "PENDING":
        return "status-pending";

      case "EXPIRED":
        return "status-expired";

      case "COMPLETED":
        return "status-completed";

      default:
        return "";
    }

  };

  return (
    <div className="booking-card">
      {/* Top Section */}
      <div className="top-section">
        <div>
          <h2>{trainName}</h2>
          <p className="train-details">
            Train No: <b>{trainNo}</b> |{" "}
            Booking Code:
            <span className="booking-code">
              {bookingCode}
            </span>
          </p>
        </div>

        <div className={`status ${getStatusClass(status)}`}>
          {status}
        </div>
      </div>

      {/* Route */}
      <div className="route">
        {source} &rarr; {destination}
      </div>

      {/* Booking Details */}
      <div className="booking-info">
        <p>
          <strong>Date</strong>
          <span>{formatDate(travelDate)}</span>
        </p>

        <p>
          <strong>Time</strong>
          <span>
            {formatTime(departureTime)} - {formatTime(arrivalTime)}
          </span>
        </p>

        <p>
          <strong>Coach</strong>
          <span>{coachType}</span>
        </p>

        <p>
          <strong>Passenger</strong>
          <span>{passengerDisplay}</span>
        </p>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="price">
          ₹{Number(totalAmount || 0).toFixed(2)}
        </div>

        <div className="booking-buttons">

          <button
            className="view-btn"
            onClick={handleViewTicket}
          >
            View Ticket
          </button>

          {
            status === "CANCELLED" ? (

                <button
                    className="cancel-btn disabled-btn"
                    disabled
                >
                    Ticket Cancelled
                </button>

            ) : canCancelTicket(
                travelDate,
                departureTime,
                status
            ) ? (

                <button
                    className="cancel-btn"
                    onClick={handleCancelTicket}
                >
                    Cancel Ticket
                </button>

            ) : (

                <button
                    className="cancel-btn disabled-btn"
                    disabled
                >
                    Journey Started
                </button>

            )
        }

          {
            booking.feedbackSubmitted ? (

              <button
                className="feedback-btn submitted"
                disabled
              >
                ✓ Feedback Submitted
              </button>

            ) : (

              canGiveFeedback(
                travelDate,
                arrivalTime,
                status
              ) && (

                <button
                  className="feedback-btn"
                  onClick={handleGiveFeedback}
                >
                  Give Feedback
                </button>

              )

            )
          }

        </div>
      </div>
    </div>
  );
};

export default BookingCard;