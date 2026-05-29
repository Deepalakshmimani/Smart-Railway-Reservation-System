// BookingPage.jsx

import React, { useState } from "react";
import "./BookingPage.css";

import { allTrains } from "../assets/assets";

import { useParams } from "react-router-dom";

import { useAppContext } from "../context/AppContext";

import toast from "react-hot-toast";

function BookingPage() {

  const { id } = useParams();

  const { navigate } = useAppContext();

  const train = allTrains.find(
    item => item.id === Number(id)
  );

  const [showPayment, setShowPayment] =
    useState(false);

  const [paymentDone, setPaymentDone] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    date: "",
    seats: 1
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const availability = train.bookings?.find(
    item => item.date === formData.date
  );

  // Booking Validation

  const handleBooking = () => {

    if (
      !formData.name ||
      !formData.age ||
      !formData.gender ||
      !formData.date
    ) {

      toast.error(
        "Please fill all fields"
      );

      return;
    }

    if (
      availability?.availableSeats >=
      formData.seats
    ) {

      setShowPayment(true);

    } else {

      toast.error(
        "No seats available for selected date"
      );
    }
  };

  // Fake Payment

  const handlePayment = () => {

    setPaymentDone(true);

    toast.success(
      "🎉 Payment Successful"
    );
  };

  return (

    <div className="booking-page">

      <div className="booking-card">

        {!paymentDone ? (

          <>

            <h1>Train Booking</h1>

            {/* Train Summary */}

            <div className="train-summary">

              <h2>{train.name}</h2>

              <p>
                {train.from}
                {" → "}
                {train.to}
              </p>

              <div className="booking-info">

                <span>
                  📅
                  {" "}
                  {formData.date ||
                    "Select Date"}
                </span>

                <span>
                  🎫
                  {" "}
                  {availability
                    ?.availableSeats || 0}
                  {" "}
                  Seats Available
                </span>

                <span>
                  {train.type}
                </span>

              </div>

              <h3 className="price">

                ₹
                {" "}
                {formData.seats *
                  train.price}

              </h3>

            </div>

            {/* Form */}

            {!showPayment ? (

              <div className="booking-form">

                <input
                  type="text"
                  name="name"
                  placeholder="Passenger Name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                />

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Gender
                  </option>

                  <option>
                    Male
                  </option>

                  <option>
                    Female
                  </option>

                  <option>
                    Other
                  </option>

                </select>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />

                <input
                  type="number"
                  name="seats"
                  placeholder="Number of Seats"
                  value={formData.seats}
                  onChange={handleChange}
                  min="1"
                />

                <button
                  onClick={handleBooking}
                >
                  Proceed To Payment
                </button>

              </div>

            ) : (

              // Payment Section

              <div className="payment-section">

                <h2>
                  Payment Details
                </h2>

                <div className="payment-box">

                  <p>
                    Passenger:
                    <span>
                      {formData.name}
                    </span>
                  </p>

                  <p>
                    Seats:
                    <span>
                      {formData.seats}
                    </span>
                  </p>

                  <p>
                    Journey Date:
                    <span>
                      {formData.date}
                    </span>
                  </p>

                  <p className="payment-total">

                    Total Amount:

                    <span>
                      ₹
                      {" "}
                      {formData.seats *
                        train.price}
                    </span>

                  </p>

                </div>

                <button
                  className="pay-btn"
                  onClick={handlePayment}
                >
                  Pay Now
                </button>

              </div>

            )}

          </>

        ) : (

          // Success Page

          <div className="booking-success">

            <h1>
              🎉 Booking Confirmed
            </h1>

            <p>
              Your ticket has been booked
              successfully.
            </p>

            <div className="success-box">

              <p>
                Train:
                <span>
                  {train.name}
                </span>
              </p>

              <p>
                Route:
                <span>
                  {train.from}
                  {" → "}
                  {train.to}
                </span>
              </p>

              <p>
                Journey Date:
                <span>
                  {formData.date}
                </span>
              </p>

              <p>
                Seats:
                <span>
                  {formData.seats}
                </span>
              </p>

            </div>

            <button
              className="my-booking-btn"
              onClick={() =>
                navigate("/bookings")
              }
            >
              Go To My Bookings
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default BookingPage;