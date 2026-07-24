import React, { useEffect, useState } from "react";
import "./Dashboard.css";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import UpcomingJourney from "../components/dashboard/UpcomingJourney";
import RewardCard from "../components/dashboard/RewardCard";
import BookingChart from "../components/dashboard/BookingChart";
import SpendingChart from "../components/dashboard/SpendingChart";
import StatusChart from "../components/dashboard/StatusChart";
import FavouriteRoute from "../components/dashboard/FavouriteRoute";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import QuickActions from "../components/dashboard/QuickActions";
import ProfileSummary from "../components/dashboard/ProfileSummary";

import { getDashboard } from "../services/dashboardService.js";

const Dashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const data = await getDashboard();

            setDashboard(data);

        } catch (error) {

            console.error("Dashboard Error:", error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <div className="dashboard-page">
                <h2>Loading Dashboard...</h2>
            </div>
        );

    }

    if (!dashboard) {

        return (
            <div className="dashboard-page">
                <h2>Unable to load dashboard.</h2>
            </div>
        );

    }

    return (

        <div className="dashboard-page">

            {/* Header */}

            <DashboardHeader
                profile={dashboard.profile}
            />

            {/* Stats */}

            <StatsCards
                stats={dashboard.stats}
            />

            {/* Upcoming Journey + Reward */}

            <div className="dashboard-grid two-column">

                <UpcomingJourney
                    journey={dashboard.upcomingJourney}
                />

                <RewardCard
                    reward={dashboard.reward}
                />

            </div>

            {/* Charts */}

            <div className="dashboard-grid chart-grid">

                <div className="large-card">

                    <BookingChart
                        data={dashboard.monthlyBookings}
                    />

                </div>

                <div className="small-card">

                    <StatusChart
                        data={dashboard.bookingStatus}
                    />

                </div>

            </div>

            {/* Spending */}

            <div className="dashboard-grid">

                <SpendingChart
                    data={dashboard.monthlySpending}
                />

            </div>

            {/* Favourite Route + Profile */}

            <div className="dashboard-grid two-column">

                <FavouriteRoute
                    route={dashboard.favouriteRoute}
                />

                <ProfileSummary
                    profile={dashboard.profile}
                />

            </div>

            {/* Recent Activities */}

            <div className="dashboard-grid">

                <ActivityTimeline
                    activities={dashboard.recentActivities}
                />

            </div>

            {/* Quick Actions */}

            <div className="dashboard-grid">

                <QuickActions />

            </div>

        </div>

    );

};

export default Dashboard;