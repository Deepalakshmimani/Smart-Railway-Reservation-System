import React from "react";
import "./RecommendedTrainCard.css";
import RecommendedTrainCard from "./RecommendedTrainCard";

const RecommendedTrainList = ({
    title,
    trains
}) => {

    if (!trains || trains.length === 0) {

        return (
            <div className="recommended-section">

                <h2>{title}</h2>

                <div className="empty-recommendation">

                    <div className="empty-icon">
                        🤖
                    </div>

                    <h3>No Recommendations Yet</h3>

                    <p>
                        Book a few journeys and we'll recommend
                        the best trains based on your travel
                        preferences.
                    </p>

                </div>

            </div>
        );

    }

    return (

        <section className="recommended-section">

            <div className="recommended-header">

                <div>

                    <h2>{title}</h2>

                    <p>
                        Personalized using your travel history
                    </p>

                </div>

            </div>

            <div className="recommended-grid">

                {trains.map(train => (

                    <RecommendedTrainCard

                        key={train.train_id}

                        train={train}

                    />

                ))}

            </div>

        </section>

    );

};

export default RecommendedTrainList;