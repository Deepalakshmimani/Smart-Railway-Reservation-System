import db from "../configs/db.js";

export const submitFeedback =
async (req, res) => {

  const connection =
  await db.getConnection();

  try {

    await connection.beginTransaction();

    const userId =
    req.user.id;

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

    const [bookingRows] =
    await connection.execute(

      `
      SELECT

        b.booking_id,

        ts.train_id,

        ts.travel_date

      FROM bookings b

      JOIN train_schedule ts
      ON b.schedule_id =
      ts.schedule_id

      WHERE

      b.booking_id = ?

      AND b.user_id = ?

      AND b.status = 'CONFIRMED'
      `,

      [

        bookingId,

        userId
      ]
    );

    /* =========================
       BOOKING CHECK
    ========================= */

    if (
      bookingRows.length === 0
    ) {

      await connection.rollback();

      return res.json({

        success: false,

        message:
        "Booking not found"
      });
    }

    const booking =
    bookingRows[0];

    /* =========================
       JOURNEY COMPLETED?
    ========================= */

    const today =
    new Date();

    const journeyDate =
    new Date(
      booking.travel_date
    );

    if (today < journeyDate) {

      await connection.rollback();

      return res.json({

        success: false,

        message:
        "Feedback allowed only after journey"
      });
    }

    /* =========================
       ALREADY REVIEWED?
    ========================= */

    const [existingFeedback] =
    await connection.execute(

      `
      SELECT feedback_id

      FROM train_feedback

      WHERE booking_id = ?
      `,

      [bookingId]
    );

    if (
      existingFeedback.length > 0
    ) {

      await connection.rollback();

      return res.json({

        success: false,

        message:
        "Feedback already submitted"
      });
    }

    /* =========================
       INSERT FEEDBACK
    ========================= */

    await connection.execute(

      `
      INSERT INTO train_feedback (

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
   UPDATE TRAIN RATINGS
========================= */

await connection.execute(

  `
  UPDATE trains

  SET

   rating = (

    SELECT ROUND(
      AVG(overall_rating),
      1
    )

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
       ADD REWARD CREDITS
    ========================= */

    await connection.execute(

      `
      UPDATE users

      SET reward_credits =
      reward_credits + 10

      WHERE user_id = ?
      `,

      [userId]
    );

    await connection.commit();

    return res.json({

      success: true,

      message:
      "Feedback Submitted Successfully",

      reward:
      "₹10 Credits Added"
    });

  } catch (error) {

    await connection.rollback();

    console.log(error);

    return res.json({

      success: false,

      message:
      error.message
    });

  } finally {

    connection.release();
  }
};