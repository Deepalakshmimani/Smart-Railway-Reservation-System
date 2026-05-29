// CancelBooking.jsx

import React, { useState } from "react";
import "./CancelBooking.css";

import toast from "react-hot-toast";

import { useAppContext } from "../context/AppContext";

const CancelBooking = () => {

  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [cancelled, setCancelled] =
    useState(false);

  const { navigate } = useAppContext();

  const handleCancel = () => {

    setCancelled(true);

    toast.success(
      "✅ Ticket Cancelled Successfully"
    );
  };

  return (

    <div className="cancel-page">

      <div className="cancel-card">

        <h1>Cancel Ticket</h1>

        <p className="cancel-subtitle">
          Help us improve by sharing the
          reason for cancellation.
        </p>

        {/* After Cancellation */}

        {cancelled ? (

          <div className="cancelled-box">

            <h2>
              ❌ Ticket Cancelled
            </h2>

            <p>
              ₹850 refund will be added
              to your wallet within
              24 hours.
            </p>

            <button
              className="back-btn"
              onClick={() =>
                navigate("/bookings")
              }
            >
              Back To My Bookings
            </button>

          </div>

        ) : (

          <>

            {/* Reason */}

            <div className="form-group">

              <label>
                Cancellation Reason
              </label>

              <select
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
              >

                <option value="">
                  Select Reason
                </option>

                <option>
                  Change of plans
                </option>

                <option>
                  Found another train
                </option>

                <option>
                  Ticket booked by mistake
                </option>

                <option>
                  Travel postponed
                </option>

                <option>
                  Price issue
                </option>

                <option>
                  Personal emergency
                </option>

                <option>
                  Other
                </option>

              </select>

            </div>

            {/* Comment */}

            <div className="form-group">

              <label>
                Additional Comments
              </label>

              <textarea
                rows="4"
                placeholder="Tell us more..."
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
              />

            </div>

            {/* Smart Suggestion */}

            <div className="reschedule-box">

              <h3>
                🚆 Would you like to
                reschedule instead?
              </h3>

              <p>
                You can explore
                alternative trains before
                cancelling.
              </p>

              <div className="reschedule-buttons">

                <button
                  onClick={() =>
                    navigate("/trains")
                  }
                  className="view-btn"
                >
                  View Other Trains
                </button>

                <button
                  className="continue-btn"
                  onClick={() =>
                    setShowConfirm(true)
                  }
                >
                  Continue Cancellation
                </button>

              </div>

            </div>

            {/* Confirmation */}

            {showConfirm && (

              <div className="confirm-box">

                <h3>
                  Refund Summary
                </h3>

                <p>
                  Ticket Amount:
                  <span> ₹900</span>
                </p>

                <p>
                  Cancellation Charge:
                  <span> ₹50</span>
                </p>

                <p className="refund">

                  Refund Amount:

                  <span> ₹850</span>

                </p>

                <button
                  className="final-cancel-btn"
                  onClick={handleCancel}
                >
                  Confirm Cancellation
                </button>

              </div>

            )}

          </>

        )}

      </div>

    </div>
  );
};

export default CancelBooking;