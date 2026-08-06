import express from "express";

import {authUser} from "../middlewares/authUser.js";
import { submitFeedback } from "../controllers/feedbackController.js";

const feedbackRouter =express.Router();

feedbackRouter.post("/submit",authUser,submitFeedback);

export default feedbackRouter;