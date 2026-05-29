// AdminLayout.jsx

import React from "react";

import "./AdminLayout.css";

import {
  NavLink,
  Outlet,
  useNavigate
} from "react-router-dom";

import {
  LayoutDashboard,
  TrainFront,
  PlusSquare,
  Armchair,
  BookOpen,
  LogOut
} from "lucide-react";

import { useAppContext }
from "../../context/AppContext";

const AdminLayout = () => {

  const {
    setIsAdmin
  } = useAppContext();

  const navigate = useNavigate();

  const handleLogout = () => {

    setIsAdmin(false);

    navigate("/admin");
  };

  return (

    <div className="admin-layout">

      {/* Sidebar */}

      <div className="admin-sidebar">

        <div>

          <h1 className="admin-logo">
            Admin Panel
          </h1>

          <nav>

            {/* Dashboard */}

            <NavLink
              to="/admin/dashboard"
              end
              className={({ isActive }) =>
                isActive
                  ? "admin-link active"
                  : "admin-link"
              }
            >

              <LayoutDashboard size={20} />

              Dashboard

            </NavLink>

            {/* Train List */}

            <NavLink
              to="/admin/dashboard/trains"
              className={({ isActive }) =>
                isActive
                  ? "admin-link active"
                  : "admin-link"
              }
            >

              <TrainFront size={20} />

              Train List

            </NavLink>

            {/* Add Train */}

            <NavLink
              to="/admin/dashboard/add-train"
              className={({ isActive }) =>
                isActive
                  ? "admin-link active"
                  : "admin-link"
              }
            >

              <PlusSquare size={20} />

              Add Train

            </NavLink>

            {/* Coach Management */}

            <NavLink
              to="/admin/dashboard/coaches"
              className={({ isActive }) =>
                isActive
                  ? "admin-link active"
                  : "admin-link"
              }
            >

              <Armchair size={20} />

              Coach Management

            </NavLink>

            {/* Bookings */}

            <NavLink
              to="/admin/dashboard/bookings"
              className={({ isActive }) =>
                isActive
                  ? "admin-link active"
                  : "admin-link"
              }
            >

              <BookOpen size={20} />

              Bookings

            </NavLink>

          </nav>

        </div>

        {/* Logout */}

        <button
          className="logout-btn"
          onClick={handleLogout}
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

      {/* Main Section */}

      <div className="admin-main">

        {/* Navbar */}

        <div className="admin-navbar">

          <h2>
            Railway Admin Dashboard
          </h2>

          <div className="admin-profile">

            A

          </div>

        </div>

        {/* Dynamic Pages */}

        <div className="admin-content">

          <Outlet />

        </div>

      </div>

    </div>
  );
};

export default AdminLayout;