import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { authUser }
from "../middlewares/authUser.js";

const router = express.Router();

/* =========================
   DASHBOARD
========================= */

router.get(
    "/",
    authUser,
    getDashboard
);

export default router;