// Profile.jsx

import React, { useState } from "react";
import "./Profile.css";

import toast from "react-hot-toast";

const Profile = () => {

  const [isEdit, setIsEdit] =
    useState(false);

  const [profile, setProfile] = useState({
    name: "Deepa",
    email: "deepa46@gmail.com",
    phone: "9876543210",
    age: "21",
    gender: "Female",
    city: "Chennai"
  });

  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {

    setIsEdit(false);

    toast.success(
      "Profile Updated Successfully"
    );
  };

  return (

    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-top">

          <div className="profile-image">

            {profile.name.charAt(0)}

          </div>

          <div>

            <h1>
              {profile.name}
            </h1>

            <p>
              {profile.email}
            </p>

          </div>

        </div>

        <div className="profile-form">

          {/* Name */}

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!isEdit}
            />

          </div>

          {/* Email */}

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEdit}
            />

          </div>

          {/* Phone */}

          <div className="form-group">

            <label>
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEdit}
            />

          </div>

          {/* Age */}

          <div className="form-group">

            <label>
              Age
            </label>

            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              disabled={!isEdit}
            />

          </div>

          {/* Gender */}

          <div className="form-group">

            <label>
              Gender
            </label>

            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              disabled={!isEdit}
            >

              <option>
                Male
              </option>

              <option>
                Female
              </option>

              <option>
                Other
              </option>

            </select>

          </div>

          {/* City */}

          <div className="form-group">

            <label>
              City
            </label>

            <input
              type="text"
              name="city"
              value={profile.city}
              onChange={handleChange}
              disabled={!isEdit}
            />

          </div>

        </div>

        {/* Buttons */}

        <div className="profile-buttons">

          {!isEdit ? (

            <button
              className="edit-btn"
              onClick={() =>
                setIsEdit(true)
              }
            >
              Edit Profile
            </button>

          ) : (

            <button
              className="save-btn"
              onClick={handleSave}
            >
              Save Changes
            </button>

          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;