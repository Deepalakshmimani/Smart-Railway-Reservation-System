import React from "react";

import { NavLink } from "react-router-dom";

import "./NavBar.css";

import { useAppContext } from "../context/AppContext";

import { assets } from "../assets/assets";

function Navbar() {

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate
  } = useAppContext();

  return (

    <nav className="navbar-container">

      {/* Navigation Links */}

      <ul className="navbar-links-list">

        <li className="navbar-links-item">

          <NavLink
            to="/"
            end
            className="navbar-link"
          >

            Home

          </NavLink>

        </li>

        {user && (

          <li className="navbar-links-item">

            <NavLink
              to="/bookings"
              className="navbar-link"
            >

              My Bookings

            </NavLink>

          </li>

        )}

        <li className="navbar-links-item">

          <NavLink
            to="/about"
            className="navbar-link"
          >

            About

          </NavLink>

        </li>

      </ul>

      {/* Right Section */}

      <div className="navbar-right-section">

        {user && (

          <div
            onClick={() =>
              navigate("/notifications")
            }
            className="navbar-notification"
          >

            🔔

            <span className="navbar-notification-badge">

              3

            </span>

          </div>

        )}

        {!user ? (

          <NavLink
            onClick={() =>
              setShowUserLogin(true)
            }
            to="/login"
            className="navbar-auth-link"
          >

            Login

          </NavLink>

        ) : (

          <div
            onClick={() =>
              navigate("/profile")
            }
            className="navbar-profile-wrapper"
          >

            <img
              src={assets.profile_icon}
              className="navbar-profile-icon"
            />

          </div>

        )}

      </div>

    </nav>
  );
}

export default Navbar;