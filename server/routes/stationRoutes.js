import express from"express";
import { authAdmin } from "../middlewares/authAdmin.js";
import { addStation, deleteStation, updateStation,getStations } from "../controllers/stationController.js";

const stationRouter=express.Router();


stationRouter.post("/add",authAdmin,addStation);

stationRouter.put("/update/:id",authAdmin,updateStation);

stationRouter.put("/delete/:id",authAdmin,deleteStation);

stationRouter.get(
  "/list",
  getStations
);

export default stationRouter;