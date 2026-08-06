import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "./PassengerDetails.css";
import toast from "react-hot-toast";

const PassengerDetails = () => {

    const location = useLocation();

    const { axios, backendUrl,navigate } = useAppContext();

    const {

        scheduleId,

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

    const handleProceed = async () => {

        for (let i = 0; i < passengers.length; i++) {

            const passenger = passengers[i];

            if (!passenger.name.trim()) {

                toast.error(`Please enter Passenger ${i + 1} Name`);

                return;

            }

            if (

                passenger.age === "" ||

                passenger.age < 1 ||

                passenger.age > 120

            ) {

                toast.error(

                    `Please enter a valid age for Passenger ${i + 1}`

                );

                return;

            }

            if (!passenger.gender) {

                toast.error(

                    `Please select Gender for Passenger ${i + 1}`

                );

                return;

            }

        }

        try {

            // Send only availability ids
            const availabilityIds = selectedSeats.map(

                seat => seat.availability_id

            );

           
            const { data } = await axios.post(

                `${backendUrl}/api/bookings/create`,

                {

                    scheduleId,

                    coachType,

                    selectedSeats: availabilityIds,

                    passengers,

                    totalAmount: selectedSeats.length * price

                }

            );

            if (data.success) {

                navigate(

                    "/payment",

                    {

                        state: {

                            bookingId: data.bookingId,

                            bookingCode: data.bookingCode,

                            totalAmount: selectedSeats.length * price

                        }

                    }

                );

            }

            else {

                toast.error(data.message);

            }

        }

        catch (error) {

            console.log(error);

            if (error.response?.status === 409) {

                toast.error(

                    error.response.data.message

                );

                navigate(

                    `/seat-selection/${scheduleId}/${coachType}`,

                    {

                        state: {

                            travelDate: location.state.travelDate,

                            price,

                            refresh: true

                        }

                    }

                );

                return;

            }

            toast.error(

                error.response?.data?.message ||

                "Booking Failed"

            );

        }

    };

    return (

        <div className="passenger-page">

            {/* Booking Summary */}

            <div className="booking-header">

                <h1>Passenger Details</h1>

                <hr />

                <div className="booking-info">

                    <p>

                        <strong>Coach Type :</strong>{" "}

                        {coachType.replaceAll("_", " ")}

                    </p>

                    <p>

                        <strong>Selected Seats :</strong>{" "}

                        {

                            selectedSeats

                                .map(seat => seat.seat_number)

                                .join(", ")

                        }

                    </p>

                    <p>

                        <strong>Total Tickets :</strong>{" "}

                        {selectedSeats.length}

                    </p>

                    <p>

                        <strong>Total Amount :</strong>{" "}

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

                                {selectedSeats[index].seat_number}

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

                                    onChange={(e) =>

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

                                    onChange={(e) =>

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

                                    onChange={(e) =>

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

            <button

                className="payment-btn"

                onClick={handleProceed}

            >

                Proceed To Payment →

            </button>

        </div>

    );

};

export default PassengerDetails;