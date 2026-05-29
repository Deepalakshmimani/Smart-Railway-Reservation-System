import 'dotenv/config'
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import fs from "fs";
import releaseExpiredBookings
from "./jobs/releaseExpiredBookings.js";

import userRouter from './routes/userRoute.js';
import pool from './configs/db.js';
import adminRouter from './routes/adminRoute.js';
import stationRouter from './routes/stationRoutes.js';
import trainRouter from "./routes/trainRoutes.js";
import { bookingRouter } from './routes/bookingRoute.js';
import paymentRouter from './routes/paymentRoutes.js';
import notificationRouter from './routes/notificationRoute.js';
import feedbackRouter from './routes/feedbackRoute.js';
const app=express();
const port=process.env.PORT || 4000;




//allow multiple orgins
const allowedOrigins=['http://localhost:5173'];

//Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}))


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
app.use("/api/booking" ,bookingRouter);
app.use("/api/payment" ,paymentRouter);
app.use("/api/notifications",notificationRouter);
app.use("/api/feedback",feedbackRouter);


releaseExpiredBookings();
app.listen(port,()=>
{
  console.log(`Server is running on http://localhost:${port}`)
})