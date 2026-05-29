// Login.jsx

import React, { useState } from "react";
import "./Login.css";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {

  const [state, setState] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    setShowUserLogin,
    setUser,
    navigate
  } = useAppContext();

  const onSubmitHandler = async (event) => {

    event.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    if (state === "register" && !name) {
      toast.error("Please enter your name");
      return;
    }

    setUser({
      email: email,
      name: state === "register"
        ? name
        : "Deepa"
    });

    toast.success(
      state === "login"
        ? "Login Successful 🎉"
        : "Account Created Successfully 🎉"
    );

    setShowUserLogin(false);

    navigate("/");
  };

  return (

    <div
      className="login-container"
      onClick={() => setShowUserLogin(false)}
    >

      <form
        className="login-form"
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
      >

        <h2>
          <span>User</span>{" "}
          {state === "login"
            ? "Login"
            : "Sign Up"}
        </h2>

        {state === "register" && (

          <div className="input-group">

            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>

        )}

        <div className="input-group">

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

        </div>

        <div className="input-group">

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

        </div>

        {state === "register" ? (

          <p className="toggle-text">

            Already have an account?

            <span
              onClick={() =>
                setState("login")
              }
            >
              Login
            </span>

          </p>

        ) : (

          <p className="toggle-text">

            Create a new account?

            <span
              onClick={() =>
                setState("register")
              }
            >
              Sign Up
            </span>

          </p>

        )}

        <button
          type="submit"
          className="login-btn"
        >

          {state === "register"
            ? "Create Account"
            : "Login"}

        </button>

      </form>

    </div>
  );
};

export default Login;