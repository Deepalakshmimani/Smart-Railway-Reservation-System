import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./PassengerDetails.css";

const PassengerDetails = () => {

    const location = useLocation();

    const {

        coachType,

        selectedSeats,

        price

    } = location.state;

    const [passengers, setPassengers] = useState(

        selectedSeats.map(() => ({

            name: "",

            age: "",

            gender: "Male"

        }))

    );

    const handleChange = (index, field, value) => {

        const updated = [...passengers];

        updated[index][field] = value;

        setPassengers(updated);

    };

    return (

        <div className="passenger-page">

            {/* Booking Summary */}

            <div className="booking-header">

                <h1>Passenger Details</h1>

                <hr />

                <div className="booking-info">

                    <p>

                        <strong>Coach Type :</strong>

                        {coachType.replaceAll("_", " ")}

                    </p>

                    <p>

                        <strong>Selected Seats :</strong>

                        {

                            selectedSeats

                            .map(seat => seat.seat_number)

                            .join(", ")

                        }

                    </p>

                    <p>

                        <strong>Total Tickets :</strong>

                        {selectedSeats.length}

                    </p>

                    <p>

                        <strong>Total Amount :</strong>

                        ₹ {(selectedSeats.length * price).toFixed(2)}

                    </p>

                </div>

            </div>

            {/* Passenger Forms */}

            {

                passengers.map((passenger, index) => (

                    <div

                        key={index}

                        className="passenger-card"

                    >

                        <h2>

                            Passenger {index + 1}

                        </h2>

                        <p>

                            Seat Number :

                            <strong>

                                {" "}

                                {

                                    selectedSeats[index].seat_number

                                }

                            </strong>

                        </p>

                        <div className="form-grid">

                            <div>

                                <label>

                                    Name

                                </label>

                                <input

                                    type="text"

                                    value={passenger.name}

                                    onChange={(e)=>

                                        handleChange(

                                            index,

                                            "name",

                                            e.target.value

                                        )

                                    }

                                />

                            </div>

                            <div>

                                <label>

                                    Age

                                </label>

                                <input

                                    type="number"

                                    value={passenger.age}

                                    onChange={(e)=>

                                        handleChange(

                                            index,

                                            "age",

                                            e.target.value

                                        )

                                    }

                                />

                            </div>

                            <div>

                                <label>

                                    Gender

                                </label>

                                <select

                                    value={passenger.gender}

                                    onChange={(e)=>

                                        handleChange(

                                            index,

                                            "gender",

                                            e.target.value

                                        )

                                    }

                                >

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

                            </div>

                        </div>

                    </div>

                ))

            }

            <button className="payment-btn">

                Proceed To Payment →

            </button>

        </div>

    );

};

export default PassengerDetails;