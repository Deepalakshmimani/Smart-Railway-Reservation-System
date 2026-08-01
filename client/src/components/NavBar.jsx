import React ,{useState,useEffect} from "react";

import { NavLink } from "react-router-dom";

import "./NavBar.css";

import { useAppContext } from "../context/AppContext";

import axios from "axios";

import { assets } from "../assets/assets";

function Navbar() {

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    backendUrl
  } = useAppContext();

  const [notificationCount, setNotificationCount] = useState(0);

useEffect(() => {
    fetchNotificationCount();
}, []);

const fetchNotificationCount = async () => {
    try {
        const { data } = await axios.get(
            `${backendUrl}/api/notifications`,
            {
                withCredentials: true
            }
        );

        if (data.success) {
            setNotificationCount(data.notifications.length);
        }
    } catch (error) {
        console.log(error);
    }
};

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



        <NavLink
            to="/admin"
            className="navbar-admin-link"
        >

            Admin Login

        </NavLink>

        {user && (

          <div
            onClick={() =>
              navigate("/notifications")
            }
            className="navbar-notification"
          >

            🔔

            {notificationCount > 0 && (
                <span className="navbar-notification-badge">
                    {notificationCount}
                </span>
            )}

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

            Sign Up/Login

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