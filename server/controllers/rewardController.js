import db from "../configs/db.js";

/* =====================================
   GET REWARD WALLET
===================================== */

export const getRewardWallet = async (req, res) => {

    try {

        const userId = req.user.id;

        const [rows] = await db.execute(
            `
            SELECT
                reward_credits,
                pending_rewards,
                feedback_count
            FROM users
            WHERE user_id = ?
            `,
            [userId]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const user = rows[0];

        return res.json({

            success: true,

            wallet: {

                rewardCredits: Number(user.reward_credits),

                pendingRewards: Number(user.pending_rewards),

                feedbackCount: user.feedback_count,

                milestone: 10,

                remainingFeedbacks:
                    Math.max(
                        10 - user.feedback_count,
                        0
                    ),

                claimAvailable:
                    user.feedback_count >= 10 &&
                    user.pending_rewards > 0

            }

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* =====================================
   CLAIM REWARD
===================================== */

export const claimReward = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const userId = req.user.id;

        const [rows] = await connection.execute(
            `
            SELECT
                reward_credits,
                pending_rewards,
                feedback_count
            FROM users
            WHERE user_id = ?
            FOR UPDATE
            `,
            [userId]
        );

        if (rows.length === 0) {

            throw new Error("User not found");

        }

        const user = rows[0];

        if (user.feedback_count < 10) {

            throw new Error(
                `Submit ${10 - user.feedback_count} more feedback(s) to unlock rewards.`
            );

        }

        if (Number(user.pending_rewards) <= 0) {

            throw new Error(
                "No rewards available to claim."
            );

        }

        const claimAmount =
            Number(user.pending_rewards);

        /* -----------------------------
           ADD TO WALLET
        ------------------------------ */

        await connection.execute(
            `
            UPDATE users
            SET

                reward_credits = reward_credits + ?,

                pending_rewards = 0,

                feedback_count = 0

            WHERE user_id = ?
            `,
            [
                claimAmount,
                userId
            ]
        );

        /* -----------------------------
           TRANSACTION HISTORY
        ------------------------------ */

        await connection.execute(
            `
            INSERT INTO reward_transactions
            (
                user_id,
                transaction_type,
                amount,
                description
            )
            VALUES
            (
                ?, 'CLAIMED', ?, ?
            )
            `,
            [
                userId,
                claimAmount,
                `Claimed reward after completing 10 feedback submissions`
            ]
        );

        await connection.commit();

        return res.json({

            success: true,

            amount: claimAmount,

            message:
                `₹${claimAmount} successfully added to your Reward Wallet.`

        });

    }

    catch (error) {

        await connection.rollback();

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

    finally {

        connection.release();

    }

};


/* =====================================
   REWARD HISTORY
===================================== */

export const getRewardHistory = async (req, res) => {

    try {

        const userId = req.user.id;

        const [history] = await db.execute(
            `
            SELECT
                transaction_id,
                booking_id,
                transaction_type,
                amount,
                description,
                created_at
            FROM reward_transactions
            WHERE user_id = ?
            ORDER BY created_at DESC
            `,
            [userId]
        );

        return res.json({

            success: true,

            history

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* =====================================
   REDEEM REWARD
   (Payment Module)
===================================== */

export const redeemReward = async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const userId = req.user.id;

        const {

            bookingId,

            redeemAmount

        } = req.body;

        if (
            !redeemAmount ||
            redeemAmount <= 0
        ) {

            throw new Error(
                "Invalid redeem amount."
            );

        }

        const [rows] =
        await connection.execute(
            `
            SELECT reward_credits
            FROM users
            WHERE user_id=?
            FOR UPDATE
            `,
            [userId]
        );

        const wallet =
        Number(rows[0].reward_credits);

        if (wallet < redeemAmount) {

            throw new Error(
                "Insufficient reward balance."
            );

        }

        await connection.execute(
            `
            UPDATE users
            SET reward_credits =
                reward_credits - ?
            WHERE user_id = ?
            `,
            [
                redeemAmount,
                userId
            ]
        );

        await connection.execute(
            `
            INSERT INTO reward_transactions
            (
                user_id,
                booking_id,
                transaction_type,
                amount,
                description
            )
            VALUES
            (
                ?, ?, 'REDEEMED', ?, ?
            )
            `,
            [
                userId,
                bookingId,
                redeemAmount,
                "Reward redeemed during ticket payment"
            ]
        );

        await connection.commit();

        return res.json({

            success: true,

            redeemedAmount:
                redeemAmount,

            message:
                "Reward redeemed successfully."

        });

    }

    catch (error) {

        await connection.rollback();

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

    finally {

        connection.release();

    }

};