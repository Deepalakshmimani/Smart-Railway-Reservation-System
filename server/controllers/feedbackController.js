import db from "../configs/db.js";

export const submitFeedback = async (req, res) => {

  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    const userId = req.user.id;

    const {
      bookingId,
      overallRating,
      cleanlinessRating,
      comfortRating,
      timingRating,
      staffRating,
      travelType,
      suggestions
    } = req.body;

    /* =========================
       GET BOOKING
    ========================= */

    const [bookingRows] = await connection.execute(
      `
      SELECT
        b.booking_id,
        ts.train_id,
        ts.travel_date
      FROM bookings b
      JOIN train_schedule ts
        ON b.schedule_id = ts.schedule_id
      WHERE
        b.booking_id = ?
        AND b.user_id = ?
        AND b.status = 'CONFIRMED'
      `,
      [bookingId, userId]
    );

    if (bookingRows.length === 0) {

      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    const booking = bookingRows[0];

    /* =========================
       JOURNEY COMPLETED?
    ========================= */

    const today = new Date();
    const journeyDate = new Date(booking.travel_date);

    if (today < journeyDate) {

      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Feedback allowed only after journey completion."
      });
    }

    /* =========================
       DUPLICATE FEEDBACK
    ========================= */

    const [existingFeedback] = await connection.execute(
      `
      SELECT feedback_id
      FROM train_feedback
      WHERE booking_id = ?
      `,
      [bookingId]
    );

    if (existingFeedback.length > 0) {

      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "Feedback already submitted."
      });
    }

    /* =========================
       INSERT FEEDBACK
    ========================= */

    await connection.execute(
      `
      INSERT INTO train_feedback
      (
        booking_id,
        user_id,
        train_id,
        overall_rating,
        cleanliness_rating,
        comfort_rating,
        timing_rating,
        staff_rating,
        travel_type,
        suggestions
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        bookingId,
        userId,
        booking.train_id,
        overallRating,
        cleanlinessRating,
        comfortRating,
        timingRating,
        staffRating,
        travelType,
        suggestions || null
      ]
    );

    /* =========================
       UPDATE TRAIN RATING
    ========================= */

    await connection.execute(
      `
      UPDATE trains
      SET

      rating = (
          SELECT ROUND(AVG(overall_rating),1)
          FROM train_feedback
          WHERE train_id = ?
      ),

      total_reviews = (
          SELECT COUNT(*)
          FROM train_feedback
          WHERE train_id = ?
      )

      WHERE train_id = ?
      `,
      [
        booking.train_id,
        booking.train_id,
        booking.train_id
      ]
    );

    /* =========================
       ADD ₹5 PENDING REWARD
    ========================= */

    await connection.execute(
      `
      UPDATE users
      SET
          pending_rewards = pending_rewards + 5,
          feedback_count = feedback_count + 1
      WHERE user_id = ?
      `,
      [userId]
    );

    /* =========================
       REWARD TRANSACTION
    ========================= */

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
      VALUES (?, ?, 'EARNED', 5, ?)
      `,
      [
        userId,
        bookingId,
        "Reward earned for submitting feedback"
      ]
    );

    /* =========================
       GET UPDATED PROGRESS
    ========================= */

    const [userRows] = await connection.execute(
      `
      SELECT
          pending_rewards,
          reward_credits,
          feedback_count
      FROM users
      WHERE user_id = ?
      `,
      [userId]
    );

    const user = userRows[0];

    const progress = user.feedback_count % 10;

    const claimAvailable = user.feedback_count >= 10;

    await connection.commit();

    return res.status(200).json({

      success: true,

      message: "Feedback submitted successfully.",

      reward: {

        earned: 5,

        pendingRewards: user.pending_rewards,

        rewardCredits: user.reward_credits,

        feedbackCount: user.feedback_count,

        progress,

        nextMilestone: 10,

        claimAvailable,

        popup: claimAvailable
          ? {
              title: "🎉 Milestone Reached!",
              message:
                "You have completed 10 feedback submissions. ₹50 is ready to be claimed."
            }
          : null
      }

    });

  } catch (error) {

    await connection.rollback();

    console.log(error);

    return res.status(500).json({

      success: false,

      message: error.message

    });

  } finally {

    connection.release();

  }

};