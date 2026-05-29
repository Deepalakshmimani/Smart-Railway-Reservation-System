import express from "express";

import { completePayment }
from "../controllers/paymentController.js";

import { authUser }
from "../middlewares/authUser.js";

const paymentRouter =
express.Router();

paymentRouter.post(

  "/pay/:bookingId",

  authUser,

  completePayment
);

export default paymentRouter;