// // CancelBooking.jsx

// import React, { useState } from "react";
// import "./CancelBooking.css";

// import toast from "react-hot-toast";

// import { useAppContext } from "../context/AppContext";

// const CancelBooking = () => {

//   const [reason, setReason] = useState("");
//   const [comment, setComment] = useState("");

//   const [showConfirm, setShowConfirm] =
//     useState(false);

//   const [cancelled, setCancelled] =
//     useState(false);

//   const { navigate } = useAppContext();

//   const handleCancel = () => {

//     setCancelled(true);

//     toast.success(
//       "✅ Ticket Cancelled Successfully"
//     );
//   };

//   return (

//     <div className="cancel-page">

//       <div className="cancel-card">

//         <h1>Cancel Ticket</h1>

//         <p className="cancel-subtitle">
//           Help us improve by sharing the
//           reason for cancellation.
//         </p>

//         {/* After Cancellation */}

//         {cancelled ? (

//           <div className="cancelled-box">

//             <h2>
//               ❌ Ticket Cancelled
//             </h2>

//             <p>
//               ₹850 refund will be added
//               to your wallet within
//               24 hours.
//             </p>

//             <button
//               className="back-btn"
//               onClick={() =>
//                 navigate("/bookings")
//               }
//             >
//               Back To My Bookings
//             </button>

//           </div>

//         ) : (

//           <>

//             {/* Reason */}

//             <div className="form-group">

//               <label>
//                 Cancellation Reason
//               </label>

//               <select
//                 value={reason}
//                 onChange={(e) =>
//                   setReason(e.target.value)
//                 }
//               >

//                 <option value="">
//                   Select Reason
//                 </option>

//                 <option>
//                   Change of plans
//                 </option>

//                 <option>
//                   Found another train
//                 </option>

//                 <option>
//                   Ticket booked by mistake
//                 </option>

//                 <option>
//                   Travel postponed
//                 </option>

//                 <option>
//                   Price issue
//                 </option>

//                 <option>
//                   Personal emergency
//                 </option>

//                 <option>
//                   Other
//                 </option>

//               </select>

//             </div>

//             {/* Comment */}

//             <div className="form-group">

//               <label>
//                 Additional Comments
//               </label>

//               <textarea
//                 rows="4"
//                 placeholder="Tell us more..."
//                 value={comment}
//                 onChange={(e) =>
//                   setComment(e.target.value)
//                 }
//               />

//             </div>

//             {/* Smart Suggestion */}

//             <div className="reschedule-box">

//               <h3>
//                 🚆 Would you like to
//                 reschedule instead?
//               </h3>

//               <p>
//                 You can explore
//                 alternative trains before
//                 cancelling.
//               </p>

//               <div className="reschedule-buttons">

//                 <button
//                   onClick={() =>
//                     navigate("/trains")
//                   }
//                   className="view-btn"
//                 >
//                   View Other Trains
//                 </button>

//                 <button
//                   className="continue-btn"
//                   onClick={() =>
//                     setShowConfirm(true)
//                   }
//                 >
//                   Continue Cancellation
//                 </button>

//               </div>

//             </div>

//             {/* Confirmation */}

//             {showConfirm && (

//               <div className="confirm-box">

//                 <h3>
//                   Refund Summary
//                 </h3>

//                 <p>
//                   Ticket Amount:
//                   <span> ₹900</span>
//                 </p>

//                 <p>
//                   Cancellation Charge:
//                   <span> ₹50</span>
//                 </p>

//                 <p className="refund">

//                   Refund Amount:

//                   <span> ₹850</span>

//                 </p>

//                 <button
//                   className="final-cancel-btn"
//                   onClick={handleCancel}
//                 >
//                   Confirm Cancellation
//                 </button>

//               </div>

//             )}

//           </>

//         )}

//       </div>

//     </div>
//   );
// };

// export default CancelBooking;


import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import "./CancelBooking.css";

const CancelBooking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useAppContext();

  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancelledData, setCancelledData] = useState(null);

  const handleContinue = () => {
    if (!reason) {
      toast.error("Please select a cancellation reason");
      return;
    }
    setShowConfirm(true);
  };

  const handleCancel = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/bookings/cancel/${bookingId}`,
        { reason, comment },
        { withCredentials: true }
      );

      if (response.data.success) {
        setCancelledData(response.data);
        toast.success("✅ Ticket Cancelled Successfully");
      } else {
        toast.error(response.data.message || "Failed to cancel ticket.");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "An error occurred during cancellation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cancel-page">
      <div className="cancel-card">
        <h1>Cancel Ticket</h1>
        <p className="cancel-subtitle">
          Help us improve by sharing the reason for cancellation.
        </p>

        {/* After Successful Cancellation */}
        {cancelledData ? (
          <div className="cancelled-box">
            <h2>❌ Ticket Cancelled</h2>
            <p>
              ₹{cancelledData.refundAmount || 0} refund will be added to your
              wallet within 24 hours.
            </p>

            <button
              className="back-btn"
              onClick={() => navigate("/bookings")}
            >
              Back To My Bookings
            </button>
          </div>
        ) : (
          <>
            {/* Reason Selection */}
            <div className="form-group">
              <label>Cancellation Reason *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="">Select Reason</option>
                <option value="Change of plans">Change of plans</option>
                <option value="Found another train">Found another train</option>
                <option value="Ticket booked by mistake">
                  Ticket booked by mistake
                </option>
                <option value="Travel postponed">Travel postponed</option>
                <option value="Price issue">Price issue</option>
                <option value="Personal emergency">Personal emergency</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Optional Comment */}
            <div className="form-group">
              <label>Additional Comments</label>
              <textarea
                rows="4"
                placeholder="Tell us more (optional)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* Smart Reschedule Option */}
            <div className="reschedule-box">
              <h3>🚆 Would you like to reschedule instead?</h3>
              <p>You can explore alternative trains before cancelling.</p>

              <div className="reschedule-buttons">
                <button
                  onClick={() => navigate("/trains")}
                  className="view-btn"
                >
                  View Other Trains
                </button>

                <button
                  className="continue-btn"
                  onClick={handleContinue}
                >
                  Continue Cancellation
                </button>
              </div>
            </div>

            {/* Confirmation Area */}
            {showConfirm && (
              <div className="confirm-box">
                <h3>Confirm Cancellation</h3>
                <p className="warning-text">
                  Are you sure you want to proceed? This action cannot be undone.
                </p>

                <button
                  className="final-cancel-btn"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm Cancellation"}
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