import React from "react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";

const COLORS = [
    "#22C55E",
    "#EF4444",
    "#F59E0B"
];

const StatusChart = ({ data = [] }) => {

    const total = data.reduce(

        (sum, item) => sum + Number(item.value),

        0

    );

    return (

        <div className="dashboard-card">

            {/* Header */}

            <div className="chart-header">

                <div>

                    <h2 className="card-title">

                        Booking Status

                    </h2>

                    <p className="card-subtitle">

                        Confirmed, Cancelled & Pending Bookings

                    </p>

                </div>

            </div>

            {/* Chart */}

            <div className="chart-container">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={70}
                            outerRadius={105}
                            paddingAngle={4}
                        >

                            {

                                data.map((entry, index) => (

                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />

                                ))

                            }

                        </Pie>

                        <Tooltip />

                        <Legend />

                    </PieChart>

                </ResponsiveContainer>

            </div>

            {/* Summary */}

            <div className="status-summary">

                {

                    data.map((item, index) => (

                        <div
                            key={index}
                            className="status-item"
                        >

                            <div>

                                <span
                                    className="status-dot"
                                    style={{
                                        background: COLORS[index]
                                    }}
                                />

                                {item.name}

                            </div>

                            <strong>

                                {item.value}

                            </strong>

                        </div>

                    ))

                }

            </div>

            <div
                style={{
                    textAlign: "center",
                    marginTop: "18px",
                    fontWeight: "600",
                    color: "#555"
                }}
            >

                Total Bookings : {total}

            </div>

        </div>

    );

};

export default StatusChart;