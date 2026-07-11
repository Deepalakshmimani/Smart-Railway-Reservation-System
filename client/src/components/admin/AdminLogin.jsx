// AdminLogin.jsx

import React, { useEffect, useState } from "react";
import "./AdminLogin.css";

import { useAppContext } from "../../context/AppContext";

import toast from "react-hot-toast";

const AdminLogin = () => {

  const {
    isAdmin,
    setIsAdmin,
    navigate,
    axios,
    backendUrl
  } = useAppContext();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const onSubmitHandler = async (event) => {

    event.preventDefault();

    

    try {

    const { data } = await axios.post(

      `${backendUrl}/api/admin/login`,

      {
        email,
        password
      },

      {
        withCredentials: true
      }

    );

    if (data.success) {

      setIsAdmin(true);

      toast.success("Admin Login Successful");

      navigate("/admin/dashboard");

    } else {

      toast.error(data.message);

    }

  } catch (error) {

    console.log(error);

    toast.error("Something went wrong");

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