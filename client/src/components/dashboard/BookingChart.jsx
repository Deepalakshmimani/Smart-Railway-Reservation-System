import React from "react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

const BookingChart = ({ data = [] }) => {

    return (

        <div className="dashboard-card">

            <div className="chart-header">

                <div>

                    <h2 className="card-title">

                        Monthly Bookings

                    </h2>

                    <p className="card-subtitle">

                        Number of bookings made this year

                    </p>

                </div>

            </div>

            <div className="chart-container">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart data={data}>

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="month"
                        />

                        <YAxis
                            allowDecimals={false}
                        />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="bookings"
                            stroke="#2563EB"
                            strokeWidth={4}
                            dot={{
                                r: 5
                            }}
                            activeDot={{
                                r: 8
                            }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

};

export default BookingChart;