import express from "express";

import { authUser } from "../middlewares/authUser.js";

import {

    getRewardWallet,

    claimReward,

    getRewardHistory,

    redeemReward

} from "../controllers/rewardController.js";

const rewardRouter = express.Router();

/* ===============================
   REWARD WALLET
=============================== */

rewardRouter.get(
    "/wallet",
    authUser,
    getRewardWallet
);

/* ===============================
   CLAIM REWARD
=============================== */

rewardRouter.post(
    "/claim",
    authUser,
    claimReward
);

/* ===============================
   REWARD HISTORY
=============================== */

rewardRouter.get(
    "/history",
    authUser,
    getRewardHistory
);

/* ===============================
   REDEEM REWARD
=============================== */

rewardRouter.post(
    "/redeem",
    authUser,
    redeemReward
);

export default rewardRouter;