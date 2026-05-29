// Feedback.jsx

import React, { useState } from "react";
import "./Feedback.css";

import toast from "react-hot-toast";

import { useAppContext } from "../context/AppContext";

const Feedback = () => {

  const { navigate } = useAppContext();

  const [submitted, setSubmitted] =
    useState(false);

  const [feedback, setFeedback] = useState({
    rating: "",
    cleanliness: "",
    comfort: "",
    timing: "",
    service: "",
    travelType: "",
    suggestion: ""
  });

  const handleChange = (e) => {

    setFeedback({
      ...feedback,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    setSubmitted(true);

    toast.success(
      "🎉 Feedback Submitted Successfully"
    );

    console.log(feedback);
  };

  return (

    <div className="feedback-page">

      <div className="feedback-card">

        {!submitted ? (

          <>

            <h1>Train Feedback</h1>

            <p className="reward-text">
              Submit feedback and get
              ₹10 reward credits 🎁
            </p>

            <form onSubmit={handleSubmit}>

              {/* Rating */}

              <div className="form-group">

                <label>
                  Overall Rating
                </label>

                <select
                  name="rating"
                  value={feedback.rating}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Rating
                  </option>

                  <option>⭐ 1</option>
                  <option>⭐ 2</option>
                  <option>⭐ 3</option>
                  <option>⭐ 4</option>
                  <option>⭐ 5</option>

                </select>

              </div>

              {/* Cleanliness */}

              <div className="form-group">

                <label>
                  Train Cleanliness
                </label>

                <select
                  name="cleanliness"
                  value={feedback.cleanliness}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Option
                  </option>

                  <option>
                    Excellent
                  </option>

                  <option>
                    Good
                  </option>

                  <option>
                    Average
                  </option>

                  <option>
                    Poor
                  </option>

                </select>

              </div>

              {/* Comfort */}

              <div className="form-group">

                <label>
                  Seat Comfort
                </label>

                <select
                  name="comfort"
                  value={feedback.comfort}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Option
                  </option>

                  <option>
                    Very Comfortable
                  </option>

                  <option>
                    Comfortable
                  </option>

                  <option>
                    Average
                  </option>

                  <option>
                    Uncomfortable
                  </option>

                </select>

              </div>

              {/* Timing */}

              <div className="form-group">

                <label>
                  Train Timing
                </label>

                <select
                  name="timing"
                  value={feedback.timing}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Option
                  </option>

                  <option>
                    On Time
                  </option>

                  <option>
                    Slight Delay
                  </option>

                  <option>
                    Late
                  </option>

                </select>

              </div>

              {/* Service */}

              <div className="form-group">

                <label>
                  Staff Service
                </label>

                <select
                  name="service"
                  value={feedback.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Option
                  </option>

                  <option>
                    Excellent
                  </option>

                  <option>
                    Good
                  </option>

                  <option>
                    Average
                  </option>

                  <option>
                    Poor
                  </option>

                </select>

              </div>

              {/* Travel Type */}

              <div className="form-group">

                <label>
                  Preferred Travel Type
                </label>

                <select
                  name="travelType"
                  value={feedback.travelType}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Option
                  </option>

                  <option>
                    Budget Travel
                  </option>

                  <option>
                    Fastest Train
                  </option>

                  <option>
                    Comfortable Journey
                  </option>

                  <option>
                    Premium Experience
                  </option>

                  <option>
                    Overnight Journey
                  </option>

                </select>

              </div>

              {/* Suggestions */}

              <div className="form-group">

                <label>
                  Suggestions
                </label>

                <textarea
                  name="suggestion"
                  placeholder="Share your experience..."
                  value={feedback.suggestion}
                  onChange={handleChange}
                  rows="4"
                />

              </div>

              <button
                type="submit"
                className="submit-btn"
              >
                Submit Feedback
              </button>

            </form>

          </>

        ) : (

          <div className="success-box">

            <h2>
              🎉 Feedback Submitted
            </h2>

            <p>
              Thank you for sharing your
              travel experience.
            </p>

            <div className="reward-box">

              ₹10 Reward Credits Added
            </div>

            <p className="reward-note">
              Your feedback helps us
              recommend better trains
              for future journeys.
            </p>

            <button
              className="back-home-btn"
              onClick={() =>
                navigate("/bookings")
              }
            >
              Back To My Bookings
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default Feedback;