import express from "express";
import { getSeats } from "../controllers/seatController.js";

const seatRouter = express.Router();

seatRouter.get(
    "/:scheduleId/:coachType",
    getSeats
);

export default seatRouter;