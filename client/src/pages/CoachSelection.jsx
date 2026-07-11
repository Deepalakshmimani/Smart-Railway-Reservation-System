import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import CoachCard from "../components/CoachCard";
import "./CoachSelection.css";

const CoachSelection = () => {

    const { trainId } = useParams();

    const { axios, backendUrl, navigate } = useAppContext();

    const [train, setTrain] = useState(null);
    const [coaches, setCoaches] = useState([]);

    const fetchTrain = async () => {

        try {

            const { data } = await axios.get(

                `${backendUrl}/api/trains/train/${trainId}`

            );

            if (data.success) {

                setTrain(data.train);
                setCoaches(data.coaches);

            }

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchTrain();

    }, []);

    const handleCoachSelect = (coach) => {
        console.log(coach);

    navigate(

        `/seat-selection/${train.schedule_id}/${coach.coach_type}`,

        {

            state: {

                price: coach.base_price,

                coachName: coach.coach_name

            }

        }

    );

};

    if (!train) {

        return <h2 className="loading">Loading...</h2>;

    }

    return (

        <div className="coach-selection-page">

            {/* Train Details */}

            <div className="train-summary">

                <div className="train-header">

                    <div>

                        <h1>🚆 {train.train_name}</h1>

                        <p className="train-no">

                            Train No : {train.train_no}

                        </p>

                    </div>

                    <div className="rating">

                        ⭐ {train.rating}

                    </div>

                </div>

                <div className="route-section">

                    <div className="station">

                        <h2>{train.source_station}</h2>

                        <p>{train.departure_time}</p>

                    </div>

                    <div className="duration">

                        ⏱ {train.duration}

                    </div>

                    <div className="station">

                        <h2>{train.destination_station}</h2>

                        <p>{train.arrival_time}</p>

                    </div>

                </div>

                <div className="summary-footer">

                    <div>

                        <span>Starting Fare</span>

                        <h3>₹ {train.starting_price}</h3>

                    </div>

                    <div>

                        <span>Total Seats</span>

                        <h3>{train.totalSeats}</h3>

                    </div>

                    <div>

                        <span>Coach Types</span>

                        <h3>{train.coaches}</h3>

                    </div>

                </div>

            </div>

            {/* Coach Cards */}

            <h2 className="coach-title">

                Choose Your Coach Type

            </h2>

            <div className="coach-grid">

                {

                    coaches.map((coach) => (

                        <CoachCard

                            key={coach.coach_type}

                            coach={coach}

                            onSelect={handleCoachSelect}

                        />

                    ))

                }

            </div>

        </div>

    );

};

export default CoachSelection;