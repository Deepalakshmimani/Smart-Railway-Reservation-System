import express from "express";

import { getRecommendedTrains } from "../controllers/trainController.js";
import authUser from "../middlewares/authUser.js"; // Use your actual auth middleware

const router = express.Router();

router.get(
    "/",
    authUser,
    getRecommendedTrains
);

export default router;