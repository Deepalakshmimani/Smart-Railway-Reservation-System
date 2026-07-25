import db from "../configs/db.js";

import {
  createNotification
} from "../utils/createNotifications.js";

import { sendTicketEmail } from "../services/emailService.js";

import {
  getTicketData,
  getUserEmailById,
} from "../services/bookingService.js";


// Finalize Booking

export const completePayment = async (req, res) => {

  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    const { bookingId } = req.params;

    const {
      useRewards = false,
      redeemAmount = 0
    } = req.body;

    const userId = req.user.id;



    const [bookingRows] = await connection.execute(
      `
      SELECT *
      FROM bookings
      WHERE booking_id = ?
      FOR UPDATE
      `,
      [bookingId]
    );

    if (bookingRows.length === 0) {
      throw new Error("Booking not found");
    }

    const booking = bookingRows[0];

    if (booking.status !== "PENDING") {
      throw new Error("Booking already processed");
    }

    if (new Date() > new Date(booking.payment_expiry)) {
      throw new Error("Payment session expired");
    }

    /* =========================
       GET LOCKED SEATS
    ========================= */

    const [seatRows] = await connection.execute(
      `
      SELECT
          sa.availability_id,
          sa.status
      FROM seat_availability sa
      JOIN booking_seats bs
      ON sa.availability_id = bs.availability_id
      WHERE bs.booking_id = ?
      FOR UPDATE
      `,
      [bookingId]
    );

    if (seatRows.length === 0) {
      throw new Error("No seats found for booking");
    }

    const seatIds = seatRows.map(
      seat => seat.availability_id
    );

    for (const seat of seatRows) {

      if (seat.status !== "LOCKED") {

        throw new Error(
          "Seat lock lost. Please book again."
        );

      }

    }

    /* =========================
       PAYMENT SIMULATION
    ========================= */

    const paymentSuccess = Math.random() < 0.8;

    if (paymentSuccess) {

      const transactionId =
        `TXN${Date.now()}`;

      /* PAYMENT SUCCESS */

      await connection.execute(
        `
        UPDATE payments
        SET
            status = 'SUCCESS',
            transaction_id = ?,
            payment_method = 'UPI',
            failure_reason = NULL
        WHERE booking_id = ?
        `,
        [
          transactionId,
          bookingId
        ]
      );

      await connection.execute(
        `
        UPDATE bookings
        SET status = 'CONFIRMED'
        WHERE booking_id = ?
        `,
        [bookingId]
      );

      await connection.query(
        `
        UPDATE seat_availability
        SET
            status='BOOKED',
            booked_at=NOW(),
            locked_at=NULL
        WHERE availability_id IN (?)
        `,
        [seatIds]
      );



/* =========================
   REDEEM REWARD
========================= */

      if (useRewards && Number(redeemAmount) > 0) {

        const [[wallet]] = await connection.execute(
          `
          SELECT reward_credits
          FROM users
          WHERE user_id = ?
          FOR UPDATE
          `,
          [userId]
        );

        if (!wallet) {
          throw new Error("User not found");
        }

        const availableCredits = Number(wallet.reward_credits);
        const bookingAmount = Number(booking.total_amount);
        const requestedAmount = Number(redeemAmount);

        const redeemValue = Math.min(
          availableCredits,
          bookingAmount,
          requestedAmount
        );

        if (redeemValue <= 0) {
          throw new Error("Invalid reward amount.");
        }

        await connection.execute(
          `
          UPDATE users
          SET reward_credits = reward_credits - ?
          WHERE user_id = ?
          `,
          [
            redeemValue,
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
          (?, ?, 'REDEEMED', ?, ?)
          `,
          [
            userId,
            bookingId,
            redeemValue,
            "Reward redeemed for booking payment."
          ]
        );

      }

    }
    else {

      /* PAYMENT FAILED */

      await connection.execute(
        `
        UPDATE payments
        SET
            status='FAILED',
            payment_method='UPI',
            failure_reason='Bank Server Error'
        WHERE booking_id=?
        `,
        [bookingId]
      );

      

    }

    await connection.commit();

    /* =========================
      AFTER PAYMENT SUCCESS
    ========================= */

    if (paymentSuccess) {

      await createNotification(
        booking.user_id,
        "Booking Confirmed",
        `Your booking ${booking.booking_code} has been confirmed.`
      );

      try {

        console.log("📩 Preparing confirmation email...");

        const ticket = await getTicketData(bookingId);

        if (!ticket) {
          console.log("❌ Ticket data not found");
        } else {

          const userEmail = await getUserEmailById(ticket.user_id);

          console.log("📧 User Email:", userEmail);

          if (userEmail) {

            await sendTicketEmail(ticket, userEmail);

            console.log("✅ Booking confirmation email sent.");

          } else {

            console.log("❌ User email not found.");

          }

        }

      } catch (error) {

        console.error("❌ Failed to send booking email:", error);

      }

    } else {

      await createNotification(
        booking.user_id,
        "Payment Failed",
        `Payment failed. You can retry payment before the session expires.`
      );

    }

    return res.json({

      success: paymentSuccess,

      paymentStatus: paymentSuccess ? "SUCCESS" : "FAILED",

      rewardUsed: paymentSuccess && useRewards,

      paymentExpiry: booking.payment_expiry

    });
  }
  catch (error) {

    await connection.rollback();

    return res.json({

      success: false,

      message: error.message

    });

  }
  finally {

    connection.release();

  }

};