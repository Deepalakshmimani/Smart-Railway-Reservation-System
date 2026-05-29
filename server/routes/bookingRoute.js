import express from "express";
import { createBooking ,getMyBookings,getBookingDetails, cancelBooking,getCancellationPreview} from "../controllers/bookingController.js";
import { authUser } from "../middlewares/authUser.js";


export const bookingRouter=express.Router();

// bookingRouter.post("/create",authUser,createBooking);

bookingRouter.post("/book/:scheduleId",authUser,createBooking);
bookingRouter.get("/my-bookings",authUser,getMyBookings);
bookingRouter.get("/my-bookings/:bookingId",authUser,getBookingDetails);
bookingRouter.post("/cancel/:bookingId",authUser,cancelBooking);
bookingRouter.get("/cancel-preview/:bookingId",authUser,getCancellationPreview);
