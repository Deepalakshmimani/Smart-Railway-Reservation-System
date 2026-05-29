import express from "express";

import {
  addTrain,
  getTrains,
  searchTrains
} from "../controllers/trainController.js";

import {authAdmin} from "../middlewares/authAdmin.js";
import { authUser } from "../middlewares/authUser.js";
import { getTrainDetails } from "../controllers/trainController.js";

const trainRouter =
  express.Router();


trainRouter.post(
  "/add",
  authAdmin,
  addTrain
);


trainRouter.get(
  "/list",
  getTrains
);

trainRouter.get(
  "/search",
  searchTrains
);

trainRouter.get(
  "/train/:scheduleId",
   getTrainDetails
);

export default trainRouter;