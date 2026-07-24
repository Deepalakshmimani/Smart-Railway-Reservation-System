import express from "express";
import {
  createBooking,
  confirmPayment,
  getTicket,
  getMyBookings,
  cancelBooking,
  getCancellationPreview
} from "../controllers/bookingController.js";


import { authUser } from "../middlewares/authUser.js";

const bookingRouter = express.Router();

bookingRouter.post("/create", authUser, createBooking);
bookingRouter.post("/confirm-payment", confirmPayment);
bookingRouter.get("/ticket/:bookingId", getTicket);
bookingRouter.get("/my-bookings", authUser, getMyBookings);

bookingRouter.post("/cancel/:bookingId", authUser, cancelBooking);

bookingRouter.get(
  "/cancel-preview/:bookingId",
  authUser,
  getCancellationPreview
);

bookingRouter.post(
  "/cancel/:bookingId",
  authUser,
  cancelBooking
);

export default bookingRouter;