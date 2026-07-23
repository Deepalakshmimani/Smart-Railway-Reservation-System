import express from "express";
import {
  createBooking,
  confirmPayment,
  getTicket,
  getMyBookings,
  cancelBooking, // 1. Import your cancellation controller
} from "../controllers/bookingController.js";
import { authUser } from "../middlewares/authUser.js";

const bookingRouter = express.Router();

bookingRouter.post("/create", authUser, createBooking);
bookingRouter.post("/confirm-payment", confirmPayment);
bookingRouter.get("/ticket/:bookingId", getTicket);
bookingRouter.get("/my-bookings", authUser, getMyBookings);

// 2. Add the cancellation route here
bookingRouter.post("/cancel/:bookingId", authUser, cancelBooking);

export default bookingRouter;