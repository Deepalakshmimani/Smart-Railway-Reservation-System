import React from "react";
import {
    FaTrain,
    FaMapMarkerAlt,
    FaArrowRight
} from "react-icons/fa";

const FavouriteRoute = ({ route }) => {

    if (!route) {

        return (

            <div className="dashboard-card favourite-route-card">

                <h2 className="card-title">
                    Favourite Route
                </h2>

                <p className="card-subtitle">
                    No travel history available.
                </p>

            </div>

        );

    }

    return (

        <div className="dashboard-card favourite-route-card">

            <h2 className="card-title">

                Favourite Route

            </h2>

            <p className="card-subtitle">

                Your most travelled railway route

            </p>

            <div className="route-container">

                <div>

                    <FaMapMarkerAlt />

                    <h3>

                        {route.source}

                    </h3>

                </div>

                <FaArrowRight />

                <div>

                    <FaTrain />

                </div>

                <FaArrowRight />

                <div>

                    <FaMapMarkerAlt />

                    <h3>

                        {route.destination}

                    </h3>

                </div>

            </div>

            <div
                style={{
                    marginTop: "25px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >

                <span>

                    Total Trips

                </span>

                <strong>

                    {route.tripCount}

                </strong>

            </div>

        </div>

    );

};

export default FavouriteRoute;