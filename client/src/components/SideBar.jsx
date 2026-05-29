import React from "react";

import { NavLink } from "react-router-dom";

import "./Sidebar.css";

import trainImg from "../assets/logo.avif";

import { useAppContext } from "../context/AppContext";

import toast from "react-hot-toast";

function Sidebar() {

  const {
    user,
    setUser,
    navigate
  } = useAppContext();

  /* Logout */

  const logout = async () => {

    setUser(null);

    toast.success(
      "Logged out successfully..."
    );

    navigate("/");
  };

  return (

    <div className="sidebar">

      {/* Logo */}

      <div className="sidebar-logo">

        <NavLink
          to="/"
          end
          className="sidebar-logo-link"
        >

          <img
            src={trainImg}
            className="sidebar-logo-img"
            alt="logo"
          />

          <span className="sidebar-logo-text">

            Ticket

          </span>

        </NavLink>

      </div>

      {/* Menu */}

      <ul className="sidebar-menu">

        <li>

          <NavLink
            to="/dashboard"
            className="menu-link"
          >

            Dashboard

          </NavLink>

        </li>

        <li>

          <NavLink
            to="/trains"
            className="menu-link"
          >

            Train List

          </NavLink>

        </li>

        <li>

          <NavLink
            to="/chat"
            className="menu-link"
          >

            Help / Chatbot

          </NavLink>

        </li>

        {/* Logout */}

        {user && (

          <li>

            <button
              onClick={logout}
              className="button-logout"
            >

              Logout

            </button>

          </li>

        )}

      </ul>

    </div>
  );
}

export default Sidebar;