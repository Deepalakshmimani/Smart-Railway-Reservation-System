import 'dotenv/config'
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import fs from "fs";
import releaseExpiredBookings
from "./jobs/releaseExpiredBookings.js";

import chatbotRouter from "./routes/chatbotRoute.js";

import userRouter from './routes/userRoute.js';
import pool from './configs/db.js';
import adminRouter from './routes/adminRoute.js';
import stationRouter from './routes/stationRoutes.js';
import trainRouter from "./routes/trainRoutes.js";
import  bookingRouter  from './routes/bookingRoute.js';
import paymentRouter from './routes/paymentRoutes.js';
import notificationRouter from './routes/notificationRoute.js';
import feedbackRouter from './routes/feedbackRoute.js';
import seatRouter from './routes/seatRoutes.js';
import pdfRouter from "./routes/pdfRoute.js";

import rewardRouter from "./routes/rewardRoutes.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";

import startRecommendationWorker from "./workers/recommendationWorker.js";





const app=express();
const port=process.env.PORT || 4000;






const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
    "https://smart-railway-reservation-system-dpc2wduxu.vercel.app"
];

app.use(express.json());
app.use(cookieParser());



console.log("Allowed Origins:", allowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

//Middleware configuration




app.use((req, res, next) => {

    const log =
`${new Date().toISOString()} | ${req.method} | ${req.url}\n`;

    fs.appendFile("logs.txt", log, (err) => {

        if (err) {
            console.log("Log Error:", err);
        }
    });

    next();
});


app.get('/',(req,res)=>res.send("API is working.."));
app.use('/api/user',userRouter);
app.use('/api/admin',adminRouter);
app.use('/api/stations',stationRouter);
app.use("/api/trains",trainRouter);
app.use("/api/bookings" ,bookingRouter);
app.use("/api/payment" ,paymentRouter);
app.use("/api/notifications",notificationRouter);
app.use(
    "/api/dashboard",
    dashboardRoutes
);
app.use("/api/rewards", rewardRouter);
app.use("/api/feedback",feedbackRouter);
app.use("/api/seats", seatRouter);
app.use("/api/pdf", pdfRouter);

app.use("/api/chatbot", chatbotRouter);



releaseExpiredBookings();
app.listen(port,()=>
{
  console.log(`Server started on port ${port}`);
  startRecommendationWorker();
})