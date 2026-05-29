// AdminLogin.jsx

import React, { useEffect, useState } from "react";
import "./AdminLogin.css";

import { useAppContext } from "../../context/AppContext";

import toast from "react-hot-toast";

const AdminLogin = () => {

  const {
    isAdmin,
    setIsAdmin,
    navigate
  } = useAppContext();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const onSubmitHandler = (event) => {

    event.preventDefault();

    // Dummy Frontend Login

    if (
      email === "admin@gmail.com" &&
      password === "admin123"
    ) {

      setIsAdmin(true);
      navigate('/admin/dashboard')

      toast.success(
        "Admin Login Successful"
      );

    } else {

      toast.error(
        "Invalid Admin Credentials"
      );
    }
  };

  

  return (

    !isAdmin && (

      <div className="admin-login-page">

        <form
          onSubmit={onSubmitHandler}
          className="admin-login-card"
        >

          <h1>
            <span>Admin</span> Login
          </h1>

          <p className="subtitle">
            Manage trains and bookings
          </p>

          {/* Email */}

          <div className="input-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          {/* Password */}

          <div className="input-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <button type="submit">

            Login

          </button>

          <div className="demo-box">

            <p>
              Demo Credentials
            </p>

            <span>
              admin@gmail.com
            </span>

            <span>
              admin123
            </span>

          </div>

        </form>

      </div>

    )

  );
};

export default AdminLogin;