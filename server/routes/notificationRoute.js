import express from "express";
import { authUser } from "../middlewares/authUser.js";
import {
    getNotifications
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get(
    "/",
    authUser,
    getNotifications
);

export default notificationRouter;