import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notifications.css";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Notifications = () => {

    const { backendUrl } = useAppContext();

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {

        fetchNotifications();

    }, []);

    const fetchNotifications = async () => {

        try {

            const { data } = await axios.get(
                `${backendUrl}/api/notifications`,
                {
                    withCredentials: true
                }
            );

            if (data.success) {

                setNotifications(data.notifications);

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            toast.error(error.message);

        }

    };

    return (

        <div className="notifications-page">

            <div className="notifications-card">

                <div className="notification-header">

                    <h1>Notifications</h1>

                    <span>
                        {notifications.length} New
                    </span>

                </div>

                <div className="notification-list">

                    {
                        notifications.length === 0 ?

                        (
                            <p>No notifications available.</p>
                        )

                        :

                        notifications.map((item) => (

                            <div
                                key={item.notification_id}
                                className="notification-item"
                            >

                                <div className="notification-content">

                                    <h3>{item.title}</h3>

                                    <p>{item.message}</p>

                                </div>

                                <span className="time">

                                    {
                                        new Date(item.created_at)
                                        .toLocaleString()
                                    }

                                </span>

                            </div>

                        ))

                    }

                </div>

            </div>

        </div>

    );

};

export default Notifications;