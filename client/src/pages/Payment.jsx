import React from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import "./Payment.css";

const Payment = () => {

    const { axios, backendUrl, navigate } = useAppContext();

    const location = useLocation();

    const {

        bookingId,

        bookingCode,

        totalAmount

    } = location.state;

    const handlePayment = async () => {

        try {

            const { data } = await axios.post(

                `${backendUrl}/api/bookings/confirm-payment`,

                {

                    bookingId

                }

            );

            if (data.success) {

                toast.success("Payment Successful");

                navigate(`/ticket/${bookingId}`);

            }

            else {

                toast.error(data.message);

            }

        }

        catch (error) {

            console.log(error);

            toast.error("Payment Failed");

        }

    };

    return (

    <div className="payment-page">

        <div className="payment-card">

            <h1>Payment</h1>

            <hr />

            <div className="payment-row">

                <strong>Booking Code</strong>

                <span>{bookingCode}</span>

            </div>

            <div className="payment-row">

                <strong>Booking ID</strong>

                <span>{bookingId}</span>

            </div>

            <div className="amount">

                <h2>Total Amount</h2>

                <h1>₹ {totalAmount}</h1>

            </div>

            <button

                className="pay-btn"

                onClick={handlePayment}

            >

                Pay Now

            </button>

        </div>

    </div>

);

};

export default Payment;