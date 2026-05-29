// About.jsx

import React from "react";
import "./About.css";

const About = () => {

  return (

    <div className="about-page">

      <div className="about-hero">

        <h1>About Our Train Booking System</h1>

        <p>
          Fast, simple, and reliable train ticket
          booking experience for passengers.
        </p>

      </div>

      <div className="about-container">

        <div className="about-card">

          <h2>🚆 Our Mission</h2>

          <p>
            We aim to make train ticket booking
            easier and more convenient for users
            through a modern and user-friendly
            platform.
          </p>

        </div>

        <div className="about-card">

          <h2>⚡ Features</h2>

          <ul>

            <li>Easy Train Search</li>

            <li>Real-Time Seat Availability</li>

            <li>Online Ticket Booking</li>

            <li>QR-Based Ticket System</li>

            <li>Downloadable PDF Tickets</li>

          </ul>

        </div>

        <div className="about-card">

          <h2>🛡 Why Choose Us?</h2>

          <p>
            Our platform provides a smooth and
            secure booking process with a clean
            interface and quick access to train
            details.
          </p>

        </div>

      </div>

    </div>
  );
};

export default About;