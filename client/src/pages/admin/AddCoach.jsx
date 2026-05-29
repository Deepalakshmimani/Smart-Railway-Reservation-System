// AddTemplate.jsx

import React, {
  useEffect,
  useState
} from "react";

import "./AddCoach.css";

import toast from "react-hot-toast";

import {
  useNavigate,
  useParams
} from "react-router-dom";

/* Dummy Template Data */

const templates = [

  {
    id: 1,
    coachType: "Sleeper",
    codePrefix: "S",
    seats: 72,
    status: "Active"
  },

  {
    id: 2,
    coachType: "AC Sleeper",
    codePrefix: "A",
    seats: 48,
    status: "Active"
  },

  {
    id: 3,
    coachType: "Chair Car",
    codePrefix: "C",
    seats: 60,
    status: "Maintenance"
  }

];

const AddCoach = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  const [templateData, setTemplateData] =
    useState({

      coachType: "",
      codePrefix: "",
      seats: "",
      status: "Active"

    });

  /* Prefill Existing Data */

  useEffect(() => {

    if (id) {

      const template =
        templates.find(
          item =>
            item.id === Number(id)
        );

      if (template) {

        setTemplateData(template);

      }
    }

  }, [id]);

  /* Handle Change */

  const handleChange = (e) => {

    setTemplateData({
      ...templateData,
      [e.target.name]:
        e.target.value
    });
  };

  /* Submit */

  const handleSubmit = (e) => {

    e.preventDefault();

    if (id) {

      toast.success(
        "Template Updated Successfully 🚆"
      );

    } else {

      toast.success(
        "Template Added Successfully 🚆"
      );
    }

    console.log(templateData);

    navigate(
      "/admin/dashboard/coaches"
    );
  };

  return (

    <div className="template-page">

      <div className="template-card">

        {/* Heading */}

        <h1>

          {id
            ? "Edit Coach Template"
            : "Add Coach Template"}

        </h1>

        <p className="subtitle">

          {id
            ? "Modify existing coach configuration"
            : "Create reusable coach configuration"}

        </p>

        {/* Form */}

        <form onSubmit={handleSubmit}>

          {/* Coach Type */}

          <div className="form-group">

            <label>
              Coach Type
            </label>

            <input
              type="text"
              name="coachType"
              placeholder="Enter coach type"
              value={templateData.coachType}
              onChange={handleChange}
              required
            />

          </div>

          {/* Code Prefix */}

          <div className="form-group">

            <label>
              Code Prefix
            </label>

            <input
              type="text"
              name="codePrefix"
              placeholder="Example: S"
              value={templateData.codePrefix}
              onChange={handleChange}
              required
            />

          </div>

          {/* Seats */}

          <div className="form-group">

            <label>
              Total Seats
            </label>

            <input
              type="number"
              name="seats"
              placeholder="Enter seat count"
              value={templateData.seats}
              onChange={handleChange}
              required
            />

          </div>

          {/* Status */}

          <div className="form-group">

            <label>
              Status
            </label>

            <select
              name="status"
              value={templateData.status}
              onChange={handleChange}
            >

              <option>
                Active
              </option>

              <option>
                Maintenance
              </option>

            </select>

          </div>

          {/* Submit */}

          <button
            type="submit"
            className="submit-btn"
          >

            {id
              ? "Save Changes"
              : "Add Template"}

          </button>

        </form>

      </div>

    </div>
  );
};

export default AddCoach;