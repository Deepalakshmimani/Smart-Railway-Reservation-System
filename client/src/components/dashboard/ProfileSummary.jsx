import React from "react";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaIdCard,
    FaCalendarAlt
} from "react-icons/fa";

const ProfileSummary = ({ profile }) => {

    if (!profile) {

        return (

            <div className="dashboard-card profile-card">

                <h2 className="card-title">
                    My Profile
                </h2>

                <p className="card-subtitle">
                    Profile information unavailable.
                </p>

            </div>

        );

    }

    return (

        <div className="dashboard-card profile-card">

            <h2 className="card-title">

                My Profile

            </h2>

            <p className="card-subtitle">

                Passenger Information

            </p>

            <div className="profile-details">

                <div className="profile-item">

                    <FaUser className="profile-icon" />

                    <div>

                        <span>Name</span>

                        <h4>{profile.name}</h4>

                    </div>

                </div>

                <div className="profile-item">

                    <FaEnvelope className="profile-icon" />

                    <div>

                        <span>Email</span>

                        <h4>{profile.email}</h4>

                    </div>

                </div>

                <div className="profile-item">

                    <FaPhone className="profile-icon" />

                    <div>

                        <span>Mobile</span>

                        <h4>{profile.phone}</h4>

                    </div>

                </div>

                <div className="profile-item">

                    <FaIdCard className="profile-icon" />

                    <div>

                        <span>User ID</span>

                        <h4>{profile.userId}</h4>

                    </div>

                </div>

                <div className="profile-item">

                    <FaCalendarAlt className="profile-icon" />

                    <div>

                        <span>Member Since</span>

                        <h4>{profile.memberSince}</h4>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default ProfileSummary;