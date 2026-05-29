import express from "express";

import {getNotifications} from "../controllers/notificationController.js";

import {authUser} from "../middlewares/authUser.js";

const notificationRouter =
express.Router();
notificationRouter.get("/",authUser,getNotifications);

export default
notificationRouter;