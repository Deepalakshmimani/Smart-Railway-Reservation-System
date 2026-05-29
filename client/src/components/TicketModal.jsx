// TicketModal.jsx

import React, { useRef } from "react";
import "./TicketModal.css";

import { QRCodeCanvas } from "qrcode.react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { useAppContext } from "../context/AppContext";
import { ticketData } from "../assets/assets";

const TicketModal = ({ ticketId }) => {

  const ticketRef = useRef();

  const { navigate } = useAppContext();

  const booking = ticketData.find(
    item => item.id === Number(ticketId)
  );

  if (!booking) {
    return null;
  }

  // Better PDF Download
  const downloadTicket = async () => {

    const canvas = await html2canvas(
      ticketRef.current,
      {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff"
      }
    );

    const imgData = canvas.toDataURL(
      "image/png"
    );

    const pdf = new jsPDF(
      "p",
      "mm",
      "a4"
    );

    const pdfWidth =
      pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (canvas.height * pdfWidth) /
      canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save(
      `${booking.train}-Ticket.pdf`
    );
  };

  return (

    <div className="ticket-overlay">

      <div
        className="ticket-modal"
        ref={ticketRef}
      >

        <h1>Train Ticket</h1>

        <h2>{booking.train}</h2>

        <p className="train-number">
          Train No: {booking.trainNo}
        </p>

        <p className="route">
          {booking.from} → {booking.to}
        </p>

        <div className="ticket-info">

          <p>
            <span>📅 Journey Date</span>
            <span>{booking.journeyDate}</span>
          </p>

          <p>
            <span>⏰ Timing</span>

            <span>
              {booking.departure}
              {" → "}
              {booking.arrival}
            </span>
          </p>

          <p>
            <span>👤 Passenger</span>
            <span>{booking.passenger}</span>
          </p>

          <p>
            <span>🎫 Seats</span>
            <span>{booking.seats}</span>
          </p>

          <p>
            <span>🚆 Coach</span>
            <span>{booking.coach}</span>
          </p>

          <p>
            <span>💺 Seat Numbers</span>

            <span>
              {booking.seatNumbers.join(", ")}
            </span>
          </p>

          <p>
            <span>🆔 Booking ID</span>

            <span>
              {booking.bookingId}
            </span>
          </p>

          <p>
            <span>💳 Amount</span>

            <span>
              ₹ {booking.amount}
            </span>
          </p>

          <p>
            <span>🟢 Status</span>

            <span>
              {booking.status}
            </span>
          </p>

        </div>

        <div className="qr-section">

          <QRCodeCanvas
            value={`
Train: ${booking.train}
Passenger: ${booking.passenger}
Date: ${booking.journeyDate}
Seats: ${booking.seats}
Booking ID: ${booking.bookingId}
            `}
            size={150}
          />

        </div>

        <div className="ticket-buttons">

          <button
            className="download-btn"
            onClick={downloadTicket}
          >
            Download Ticket
          </button>

          <button
            className="close-btn"
            onClick={() => navigate("/bookings")}
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};

export default TicketModal;