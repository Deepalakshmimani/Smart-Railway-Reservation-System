import React from "react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

const SpendingChart = ({ data = [] }) => {

    const totalSpent = data.reduce(

        (sum, item) => sum + Number(item.amount || 0),

        0

    );

    const averageSpent =

        data.length > 0

            ? Math.round(totalSpent / data.length)

            : 0;

    return (

        <div className="dashboard-card">

            {/* Header */}

            <div className="chart-header">

                <div>

                    <h2 className="card-title">

                        Monthly Spending

                    </h2>

                    <p className="card-subtitle">

                        Money spent on confirmed bookings

                    </p>

                </div>

            </div>

            {/* Chart */}

            <div className="chart-container">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <AreaChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="month"
                        />

                        <YAxis />

                        <Tooltip />

                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#2563EB"
                            fill="#93C5FD"
                            strokeWidth={3}
                        />

                    </AreaChart>

                </ResponsiveContainer>

            </div>

            {/* Footer */}

            <div className="spending-footer">

                <div>

                    <span>

                        Total Spent

                    </span>

                    <h3>

                        ₹{totalSpent.toLocaleString()}

                    </h3>

                </div>

                <div>

                    <span>

                        Average / Month

                    </span>

                    <h3>

                        ₹{averageSpent.toLocaleString()}

                    </h3>

                </div>

            </div>

        </div>

    );

};

export default SpendingChart;