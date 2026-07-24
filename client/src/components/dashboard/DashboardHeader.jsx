import React from "react";
import { FaTrain } from "react-icons/fa";

const DashboardHeader = ({ profile }) => {

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {

        greeting = "Good Morning";

    } else if (hour < 17) {

        greeting = "Good Afternoon";

    }

    const today = new Date().toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

    return (

        <div className="dashboard-card dashboard-header">

    <div>

        <h1>
            {greeting}, {profile?.name} 👋
        </h1>

        <p>{today}</p>

        <p>Every Journey Begins with a Ticket</p>

    </div>

    <div className="header-right">

        <div className="icon-circle">

            <FaTrain />

        </div>

    </div>

</div>
    );

};

export default DashboardHeader;