import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

import "./CancelBooking.css"

const CancelBooking = () => {

    const { bookingId } = useParams();
    const navigate = useNavigate();

    const { backendUrl } = useAppContext();

    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchPreview();
    }, []);

    const fetchPreview = async () => {

        try {

            const { data } = await axios.get(
                `${backendUrl}/api/bookings/cancel-preview/${bookingId}`,
                {
                    withCredentials: true
                }
            );

            if (data.success) {
                setPreview(data.preview);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }

        setLoading(false);
    };

    const cancelTicket = async () => {

        try {

            setCancelling(true);

            const { data } = await axios.post(
                `${backendUrl}/api/bookings/cancel/${bookingId}`,
                {},
                {
                    withCredentials: true
                }
            );

            if (data.success) {

                toast.success(

                `Ticket Cancelled Successfully

                Refund ₹${data.refund.refundAmount}`

                );

                navigate("/bookings");

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            toast.error(error.response?.data?.message || error.message);

        }

        setCancelling(false);

    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!preview) {
        return <h2>No Preview Available</h2>;
    }

    return (
        <div className="cancel-container">

            <h1>Cancel Ticket</h1>

            <div className="refund-card">

                <p><strong>Booking Code:</strong> {preview.bookingCode}</p>

                <p><strong>Total Amount:</strong> ₹{preview.totalAmount}</p>

                <p><strong>Days Left:</strong> {preview.daysLeft}</p>

                <p><strong>Cancellation Charge:</strong> ₹{preview.cancellationCharge}</p>

                <p><strong>Refund Amount:</strong> ₹{preview.refundAmount}</p>

                <p><strong>Policy:</strong> {preview.policy}</p>

            </div>

            <button
                onClick={cancelTicket}
                disabled={cancelling}
            >
                {cancelling ? "Cancelling..." : "Confirm Cancellation"}
            </button>

        </div>
    );

};

export default CancelBooking;