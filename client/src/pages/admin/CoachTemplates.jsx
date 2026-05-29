// CoachTemplates.jsx

import React from "react";

import "./CoachTemplates.css";
import { useAppContext } from "../../context/AppContext";

const coachTemplates = [

  {
    id: 1,
    coachType: "Sleeper",
    codePrefix: "S",
    seats: 72,
    status: "Active",
    usedIn: 12
  },

  {
    id: 2,
    coachType: "AC Sleeper",
    codePrefix: "A",
    seats: 48,
    status: "Active",
    usedIn: 8
  },

  {
    id: 3,
    coachType: "Chair Car",
    codePrefix: "C",
    seats: 60,
    status: "Active",
    usedIn: 5
  },

  {
    id: 4,
    coachType: "General",
    codePrefix: "G",
    seats: 90,
    status: "Maintenance",
    usedIn: 3
  }

];

const CoachTemplates = () => {

  const {navigate}=useAppContext();

  const getStatusClass = (
    status
  ) => {

    if (status === "Active") {
      return "active";
    }

    return "maintenance";
  };

  return (

    <div className="coach-template-page">

      {/* Top */}

      <div className="template-top">

        <div>

          <h1>
            Coach Templates
          </h1>

          <p>
            Manage reusable coach configurations
          </p>

        </div>

        <button onClick={()=>navigate('/admin/dashboard/add-coach')} className="add-template-btn">

          + Add Template

        </button>

      </div>

      {/* Grid */}

      <div className="template-grid">

        {coachTemplates.map((item) => (

          <div
            key={item.id}
            className="template-card"
          >

            {/* Header */}

            <div className="template-header">

              <div>

                <h2>
                  {item.coachType}
                </h2>

                <span>
                  Prefix:
                  {" "}
                  {item.codePrefix}
                </span>

              </div>

              

            </div>

            {/* Details */}

            <div className="template-details">

              <div className="detail-box">

                <p>
                  Total Seats
                </p>

                <h3>
                  {item.seats}
                </h3>

              </div>

              <div className="detail-box">

                <p>
                  Used In
                </p>

                <h3>
                  {item.usedIn}
                </h3>

              </div>

            </div>

            {/* Footer */}

            <div className="template-footer">

              <button onClick={()=>navigate(`/admin/dashboard/add-coach/${item.id}`)} className="edit-btn">

                Edit Template

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default CoachTemplates;