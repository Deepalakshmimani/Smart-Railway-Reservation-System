import express from "express";

import {
  addTrain,
  getTrains,
  searchTrains,
  getTrainDetails,
  updateTrain,
  getTrainById,
  deleteTrain,
  restoreTrain,
  getRecommendedTrains
} from "../controllers/trainController.js";

import {authAdmin} from "../middlewares/authAdmin.js";
import { authUser } from "../middlewares/authUser.js";


const trainRouter =
  express.Router();


trainRouter.post(
  "/add",
  authAdmin,
  addTrain
);

trainRouter.put(
  "/update/:id",
  authAdmin,
  updateTrain
);



trainRouter.put(
  "/delete/:id",
  authAdmin,
  deleteTrain
);

trainRouter.put(
  "/restore/:id",
  authAdmin,
  restoreTrain
);

trainRouter.get(
  "/list",
  getTrains
);

trainRouter.get(
    "/recommended",
    getRecommendedTrains
);



trainRouter.get(
  "/search",
  searchTrains
);

trainRouter.get(
  "/train/:trainId",
   getTrainDetails
);




trainRouter.get(
  "/:id",
  authAdmin,
  getTrainById
);
export default trainRouter;