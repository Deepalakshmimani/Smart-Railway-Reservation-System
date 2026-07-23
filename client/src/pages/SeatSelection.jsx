import React, { useEffect, useState } from "react";
import {
    useParams,
    useLocation
} from "react-router-dom";

import { useAppContext } from "../context/AppContext";

import "./SeatSelection.css";

import SeatCard from "../components/SeatCard";

const SeatSelection = () => {

    const { scheduleId, coachType } = useParams();

    const location = useLocation();

    const travelDate =location.state?.travelDate;

    const { axios, backendUrl, navigate } = useAppContext();

    const price = Number(location.state?.price || 0);

    const [seats, setSeats] = useState([]);

    const [selectedSeats, setSelectedSeats] = useState([]);

    const fetchSeats = async () => {

        try {

            const { data } = await axios.get(

                `${backendUrl}/api/seats/${scheduleId}/${coachType}`

            );

            if (data.success) {

                setSeats(data.seats);

            }

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchSeats();

    }, []);

    /* ===========================
       Select / Unselect Seat
    =========================== */

    const handleSeatSelect = (seat) => {

        if (seat.status !== "AVAILABLE") return;

        const exists = selectedSeats.find(

            s => s.seat_id === seat.seat_id

        );

        if (exists) {

            setSelectedSeats(

                selectedSeats.filter(

                    s => s.seat_id !== seat.seat_id

                )

            );

        }

        else {

            setSelectedSeats([

                ...selectedSeats,
                seat

            ]);

        }

    };

    /* ===========================
       Continue
    =========================== */

    const handleContinue = () => {

        navigate("/passenger-details", {

            state: {

                scheduleId,

                coachType,

                selectedSeats,

                price

            }

        });

    };

    return (

        <div className="seat-page">

            {/* LEFT */}

            <div className="seat-layout">

                <h1>Seat Selection</h1>

                <h2>

                    Coach Type : {coachType.replaceAll("_", " ")}

                </h2>


                <h3>

                    Travel Date :

                    {

                        new Date(

                            travelDate

                        ).toLocaleDateString(

                            "en-IN",

                            {

                                day:"2-digit",

                                month:"short",

                                year:"numeric"

                            }

                        )

                    }

                </h3>

                <h3>

                    Total Seats : {seats.length}

                </h3>

                <hr />

                {/* Legend */}

                <div className="seat-legend">

                    <div className="legend-item">

                        <span className="legend-box available"></span>

                        Available

                    </div>

                    <div className="legend-item">

                        <span className="legend-box booked"></span>

                        Booked

                    </div>

                    <div className="legend-item">

                        <span className="legend-box selected"></span>

                        Selected

                    </div>

                </div>

                {/* Seat Grid */}

                <div className="seat-grid">

                    {

                        seats.map((seat) => (

                            <SeatCard

                                key={seat.seat_id}

                                seat={seat}

                                selected={

                                    selectedSeats.some(

                                        s =>

                                        s.seat_id === seat.seat_id

                                    )

                                }

                                onSelect={handleSeatSelect}

                            />

                        ))

                    }

                </div>

            </div>

            {/* RIGHT */}

            <div className="booking-summary">

                <h2>Booking Summary</h2>

                <hr />

                <p>

                    <strong>Coach Type :</strong>

                    {" "}

                    {coachType.replaceAll("_", " ")}

                </p>

                <p>

                    <strong>Price / Seat :</strong>

                    {" "}

                    ₹ {price.toFixed(2)}

                </p>

                <p>

                    <strong>Selected Seats</strong>

                </p>

                <div className="selected-seat-list">

                    {

                        selectedSeats.length === 0

                        ?

                        "None"

                        :

                        selectedSeats.map(

                            seat => (

                                <span

                                    key={seat.seat_id}

                                    className="selected-seat-chip"

                                >

                                    {seat.seat_number}

                                </span>

                            )

                        )

                    }

                </div>

                <hr />

                <p>

                    <strong>Tickets :</strong>

                    {" "}

                    {selectedSeats.length}

                </p>

                <p>

                    <strong>Total :</strong>

                    {" "}

                    ₹ {(selectedSeats.length * price).toFixed(2)}

                </p>

                <button

                    className="continue-btn"

                    disabled={selectedSeats.length === 0}

                    onClick={handleContinue}

                >

                    Continue →

                </button>

            </div>

        </div>

    );

};

export default SeatSelection;