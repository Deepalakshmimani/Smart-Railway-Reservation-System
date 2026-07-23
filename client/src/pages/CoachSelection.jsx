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

    const [schedules, setSchedules] = useState([]);

    const [selectedSchedule, setSelectedSchedule] = useState("");

    const fetchTrain = async () => {
        
        if (!selectedSchedule) return;
        try {

            const { data } = await axios.get(

                `${backendUrl}/api/trains/schedule/${selectedSchedule}`

            );

            if (data.success) {

                setTrain(data.train);
                setCoaches(data.coaches);

            }

        } catch (error) {

            console.log(error);

        }

    };

    const fetchSchedules = async () => {

    try {

        const { data } = await axios.get(

            `${backendUrl}/api/trains/${trainId}/schedules`

        );

        if (data.success) {

            setSchedules(data.schedules);

            if (data.schedules.length > 0) {

                setSelectedSchedule(

                    data.schedules[0].schedule_id

                );

            }

        }

    }

    catch (error) {

        console.log(error);

    }

};

    useEffect(()=>{

    fetchSchedules();

},[]);

useEffect(()=>{

    if(selectedSchedule){

        fetchTrain();

    }

},[selectedSchedule]);

    const handleCoachSelect = (coach) => {

    navigate(

        `/seat-selection/${selectedSchedule}/${coach.coach_type}`,

        {

            state: {

                price: coach.base_price,

                travelDate:

                    schedules.find(

                        s =>

                        s.schedule_id == selectedSchedule

                    )?.travel_date

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

            <div className="date-selection">

                <h3>

                    Select Travel Date

                </h3>

                <select

                    value={selectedSchedule}

                    onChange={(e)=>

                        setSelectedSchedule(

                            e.target.value

                        )

                    }
                >
                    {
                        schedules.map(

                            schedule=>(

                                <option

                                    key={schedule.schedule_id}

                                    value={schedule.schedule_id}

                                >

                                    {

                                        new Date(

                                            schedule.travel_date

                                        ).toLocaleDateString(

                                            "en-IN",

                                            {
                                         day:"2-digit",

                                                month:"short",

                                                year:"numeric"
                                            }
                                        )
                                    }
                                </option>
                            )
                        )
                    }

                </select>

            </div>

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